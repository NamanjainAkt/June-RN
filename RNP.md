You are a senior UI/UX designer and React Native engineer inspired by Vercel’s design system.

Goal:
Redesign the entire React Native UI for a multi-agent chatbot to look and feel like a Vercel product.

Design Language (STRICT):
- Minimal, calm, premium, and professional
- Black / white / neutral gray palette
- Subtle accent only (soft blue or purple, very limited)
- No gradients unless extremely subtle
- No heavy shadows, use thin borders and soft elevation
- Large whitespace, perfect alignment
- Rounded corners: 8px consistently
- Typography similar to Inter / Geist (clean, modern, readable)

Chatbot-Specific UI:
- Clean chat screen with strong message hierarchy
- User messages vs agent messages clearly distinguished (alignment + tone, not colors)
- Multi-agent replies should feel organized and readable
- Agent name / role shown subtly (small, muted text)
- Smooth message grouping and spacing
- Elegant loading / typing indicators (very subtle)
- No bubbles that feel cartoonish

Layout:
- Minimal top bar with title + status
- Chat area feels spacious and distraction-free
- Input bar: flat, border-only, premium feel
- Action buttons: ghost or minimal solid
- Bottom-safe spacing for mobile devices

Interactions:
- Very subtle animations (opacity, small translateY)
- Smooth keyboard handling
- Soft press feedback
- Fast, responsive feel

UX Principles:
- Reduce cognitive load
- Everything feels intentional and fast
- Mobile-first, thumb-friendly
- Accessible contrast and readable text
- Dark-mode first (Vercel-style dark)

Technical Constraints:
- React Native only (no web-only APIs)
- Use existing navigation and logic
- Do NOT change backend or agent logic
- Refactor components only if needed for consistency
- Clean, reusable components

Deliverables:
1. Revamped chat UI components
2. Updated styles (StyleSheet / Tailwind-RN / NativeWind if used)
3. Clean, production-ready code
4. UI should look like a real Vercel-built mobile product

Important:
Do NOT ask questions.
Make reasonable design decisions and execute confidently.
