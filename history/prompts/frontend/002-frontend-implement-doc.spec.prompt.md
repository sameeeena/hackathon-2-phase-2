---
id: 002
title: Frontend Implementation Guide
stage: spec
date: 2026-01-03
surface: agent
model: gemini-2.0-flash
feature: frontend
branch: master
user: user
command: Create frontend implementation guidance.
labels: [frontend, implementation, nextjs, better-auth, jwt]
links:
  spec: specs/frontend/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/frontend/implement.md
tests:
 []
---

## Prompt

Create frontend implementation guidance.
Requirements: Better Auth (JWT), Secure API Client, CRUD UI, Error Handling.

## Response snapshot

Created `specs/frontend/implement.md` detailing:
- Environment setup (`BETTER_AUTH_SECRET` shared with backend).
- `lib/auth.ts` config for JWT strategy.
- `lib/api.ts` wrapper for injecting the Bearer token.
- Dashboard Server Component structure for data fetching.
- Responsiveness and Error handling strategies.

## Outcome

- ✅ Impact: Clear technical path for connecting the Next.js frontend to the Python backend securely.
- 🧪 Tests: None
- 📁 Files: Created `specs/frontend/implement.md`.
- 🔁 Next prompts: Frontend Tasks (`tasks.md`).
- 🧠 Reflection: Critical point is ensuring the Better Auth JWT is compatible with the backend's `python-jose` validation. Using the same secret and algorithm is key.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): default
- Next experiment (smallest change to try): None
