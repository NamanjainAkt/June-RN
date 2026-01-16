import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, deleteDoc, doc, getDocs, query, setDoc } from 'firebase/firestore';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { PREDEFINED_AGENTS } from '../constants/agents';
import { db } from '../services/firebase';
import { Agent, ChatSession, Message } from '../types';
import { useAuthStore } from './useAuthStore';

interface ChatState {
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  agents: Agent[];
  isLoading: boolean;

  // Session methods
  createSession: (agent: Agent) => ChatSession;
  setCurrentSession: (session: ChatSession | null) => void;
  getSessionById: (sessionId: string) => ChatSession | null;
  addMessage: (message: Message) => void;
  saveSessions: (userId: string) => Promise<void>;
  loadSessions: (userId: string) => Promise<void>;
  deleteSession: (sessionId: string, userId: string) => Promise<void>;
  clearAllSessions: (userId: string) => Promise<void>;

  // Agent methods
  loadAgents: (userId: string) => Promise<void>;
  loadCustomAgents: (userId: string) => Promise<void>;
  addCustomAgent: (agent: Agent) => Promise<void>;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      sessions: [],
      currentSession: null,
      agents: PREDEFINED_AGENTS,
      isLoading: false,

      createSession: (agent) => {
        const session: ChatSession = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          agentId: agent.id,
          agentName: agent.name,
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set({
          currentSession: session,
          sessions: [...get().sessions, session],
        });
        return session;
      },

      setCurrentSession: (session) => {
        set({ currentSession: session });
      },

      getSessionById: (sessionId) => {
        const sessions = get().sessions;
        return sessions.find((s) => s.id === sessionId) || null;
      },

      addMessage: (message) => {
        const current = get().currentSession;
        if (current) {
          const updatedSession = {
            ...current,
            messages: [...current.messages, message],
            updatedAt: Date.now(),
          };
          set({
            currentSession: updatedSession,
            sessions: get().sessions.map((s) =>
              s.id === current.id ? updatedSession : s
            ),
          });
          // Save to Firestore asynchronously (gracefully fails if Firebase not configured)
          const userId = useAuthStore.getState().user?.id;
          if (userId) {
            get().saveSessions(userId).catch((error) => {
              console.error('Error saving sessions:', error);
            });
          }
        }
      },

      saveSessions: async (userId) => {
        if (!db) return;
        try {
          const sessions = get().sessions;
          for (const session of sessions) {
            const sessionRef = doc(db, 'users', userId, 'sessions', session.id);
            // Sanitize session to remove undefined values for Firestore
            const sanitizedSession = JSON.parse(JSON.stringify(session));
            await setDoc(sessionRef, sanitizedSession);
          }
        } catch (error) {
          console.error('Error saving sessions to Firestore:', error);
        }
      },

      loadSessions: async (userId) => {
        set({ isLoading: true });
        try {
          if (!db) {
            set({ sessions: [], isLoading: false });
            return;
          }
          const q = query(collection(db, 'users', userId, 'sessions'));
          const snapshot = await getDocs(q);
          const sessions: ChatSession[] = snapshot.docs.map((doc) => ({
            ...doc.data(),
          })) as ChatSession[];
          set({ sessions: sessions.sort((a, b) => b.updatedAt - a.updatedAt) });
        } catch (error) {
          console.error('Error loading sessions:', error);
          set({ sessions: [] });
        } finally {
          set({ isLoading: false });
        }
      },

      deleteSession: async (sessionId, userId) => {
        if (!db) return;
        try {
          await deleteDoc(doc(db, 'users', userId, 'sessions', sessionId));
          set({
            sessions: get().sessions.filter((s) => s.id !== sessionId),
            currentSession:
              get().currentSession?.id === sessionId
                ? null
                : get().currentSession,
          });
        } catch (error) {
          console.error('Error deleting session:', error);
        }
      },

      clearAllSessions: async (userId) => {
        if (!db) {
          set({ sessions: [], currentSession: null });
          return;
        }
        try {
          const sessions = get().sessions;
          for (const session of sessions) {
            await deleteDoc(doc(db, 'users', userId, 'sessions', session.id));
          }
          set({ sessions: [], currentSession: null });
        } catch (error) {
          console.error('Error clearing all sessions:', error);
        }
      },

      loadAgents: async (userId) => {
        set({ isLoading: true });
        try {
          await get().loadSessions(userId);
          await get().loadCustomAgents(userId);
        } finally {
          set({ isLoading: false });
        }
      },

      loadCustomAgents: async (userId) => {
        if (!db) return;
        try {
          const q = query(collection(db, 'users', userId, 'customAgents'));
          const snapshot = await getDocs(q);
          const customAgents = snapshot.docs.map((doc) => doc.data() as Agent);
          set({ agents: [...PREDEFINED_AGENTS, ...customAgents] });
        } catch (error) {
          console.error('Error loading custom agents:', error);
        }
      },

      addCustomAgent: async (agent) => {
        set({ agents: [...get().agents, agent] });

        // Persist to Firestore if user is signed in
        const userId = useAuthStore.getState().user?.id;
        if (userId && db) {
          try {
            const sanitizedAgent = JSON.parse(JSON.stringify(agent));
            await setDoc(doc(db, 'users', userId, 'customAgents', agent.id), sanitizedAgent);
          } catch (error) {
            console.error('Error saving custom agent to Firestore:', error);
          }
        }
      },
    }),
    {
      name: 'chat-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        sessions: state.sessions,
        agents: state.agents,
      }),
    }
  )
);
