import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Agent, ChatSession, Message } from '../types';
import { PREDEFINED_AGENTS } from '../constants/agents';
import { db } from '../services/firebase';
import { collection, doc, setDoc, getDocs, query, where, deleteDoc } from 'firebase/firestore';

interface ChatState {
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  agents: Agent[];
  isLoading: boolean;
  
  // Session methods
  createSession: (agent: Agent) => ChatSession;
  setCurrentSession: (session: ChatSession | null) => void;
  addMessage: (message: Message) => void;
  saveSessions: (userId: string) => Promise<void>;
  loadSessions: (userId: string) => Promise<void>;
  deleteSession: (sessionId: string, userId: string) => Promise<void>;
  
  // Agent methods
  loadAgents: (customAgents?: Agent[]) => void;
  addCustomAgent: (agent: Agent) => void;
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
        set({ currentSession: session });
        return session;
      },

      setCurrentSession: (session) => {
        set({ currentSession: session });
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
        }
      },

      saveSessions: async (userId) => {
        if (!db) return;
        const sessions = get().sessions;
        for (const session of sessions) {
          const sessionRef = doc(db, 'users', userId, 'sessions', session.id);
          await setDoc(sessionRef, session);
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

      loadAgents: (customAgents = []) => {
        set({ agents: [...PREDEFINED_AGENTS, ...customAgents] });
      },

      addCustomAgent: (agent) => {
        set({ agents: [...get().agents, agent] });
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
