---
id: 001
title: Frontend Specification
stage: spec
date: 2026-01-03
surface: agent
model: gemini-2.0-flash
feature: frontend
branch: master
user: user
command: Now create `specify.md` for the FRONTEND.
labels: [frontend, spec, nextjs, better-auth]
links:
  spec: specs/frontend/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/frontend/spec.md
tests:
 []
---

## Prompt

Create `specify.md` for the FRONTEND.
Requirements: Next.js 16+, Better Auth, JWT handling, Responsive UI.
Constraints: Frontend does NOT manage authz; Backend is source of truth.

## Response snapshot

Created `specs/frontend/spec.md` defining the Next.js App Router architecture. detailed the integration with Better Auth and the requirement to use the `BETTER_AUTH_SECRET` to sign tokens compatible with the backend.

## Outcome

- ✅ Impact: Clear blueprint for the frontend implementation.
- 🧪 Tests: None
- 📁 Files: Created `specs/frontend/spec.md`.
- 🔁 Next prompts: Frontend Planning (`plan.md`).
- 🧠 Reflection: The challenge will be ensuring Better Auth (which usually handles its own session) exposes a JWT compatible with the Python backend. We might need a custom session callback in Next.js.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): default
- Next experiment (smallest change to try): None
