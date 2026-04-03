# FRIKI WEBSITE — New Chat Onboarding
*Read this at the start of every new claude.ai conversation about this project.*
*This is the bridge between your claude.ai strategy sessions and Claude Code build sessions.*

---

## STEP 1 — READ THESE FILES FIRST

Before doing anything, ask Claude Code to read:
1. `SESSION_CONTEXT.md` — what phase is complete, what tests pass, what comes next
2. `SELF_IMPROVEMENT_LOG.md` — bugs already solved, patterns to follow, known pending problems
3. `PROJECT_OVERVIEW.md` — the "why" behind architecture choices (read when making big decisions)
4. `agent_docs/design-system.md` — before touching any CSS or visual code

Reading all four takes about 90 seconds and gives complete context. Do not skip.

---

## THE PROJECT IN ONE PARAGRAPH

FRIKi is the student council of UL FRI (Faculty of Computer and Information Science, Ljubljana, Slovenia). **Shipped today:** a light-themed marketing site — homepage (hero, events carousel, archive with search/modal), event detail pages from mock data (`lib/data.ts`), SL/EN via React Context + `localStorage`. **Not shipped yet:** Stripe, Supabase, Resend, API routes, `/events` list, merch/past-events pages. Stack: Next.js 16 App Router, React 19, TypeScript, Tailwind v4, shadcn/ui (new-york) in `components/ui/` (not yet used by pages), IBM Plex fonts. **Planned services:** Supabase, Stripe, Resend. **Target host:** Vercel. **Phase 2:** URL-based SL/EN with next-intl (replace context-only toggle).

---

## THE TWO TOOLS

### claude.ai (this chat) — Strategy, Architecture, Research
- Brainstorm features and product direction
- Deep research on libraries, approaches, patterns
- Write detailed prompts for Claude Code to execute
- Review architecture decisions
- Update context and session files
- Write the MD files that Claude Code will reference

**This chat does NOT write TypeScript code directly.** It thinks, plans, and writes prompts.

### Claude Code (VS Code / terminal) — Building
- Implement features (TypeScript, CSS, tests)
- Run dev server, build, lint, type check
- Execute the build prompts written in this chat
- Commit and push to GitHub

**Workspace:** `C:\Users\amade\Desktop\Claude Madness\website\`

---

## THE FILE SYSTEM — WHAT EVERY FILE IS FOR

### Core Memory Files (READ EVERY SESSION)

| File | Purpose |
|---|---|
| `SESSION_CONTEXT.md` | Current build state. File status, phases, what comes next. The "where we are now." |
| `SELF_IMPROVEMENT_LOG.md` | Engineering lessons. Every bug solved and how. Read BEFORE writing code. |
| `CLAUDE.md` | Auto-read by Claude Code. Commands, git workflow, non-negotiables. |
| `PROJECT_OVERVIEW.md` | Full product spec, architecture decisions, schema, security contract. |

### Agent Docs (READ WHEN RELEVANT)

| File | When to read |
|---|---|
| `agent_docs/stack.md` | Before adding dependencies, setting up services, or touching env vars |
| `agent_docs/architecture.md` | Before creating new pages, routes, or components |
| `agent_docs/design-system.md` | Before writing any CSS, globals.css, or Tailwind classes |
| `agent_docs/deployment.md` | Before any Vercel/hosting/CI work |

### Slash Commands (inside Claude Code terminal)

| Command | What it does |
|---|---|
| `/session-start` | Reads context files + prints current state |
| `/commit` | Quality checks + conventional commit + push |
| `/wrap` | End-of-session: build check, commit, update session files |
| `/branch [name]` | Create a feature branch from dev |
| `/merge` | Merge current feature branch into dev (no-ff) |
| `/phase-complete` | Full phase closeout: lint + build + commit + update session docs |
| `/plan` | Print a plan before writing code |
| `/status` | Quick status print |
| `/debug` | Debug a failing build or error |
| `/security-review` | Spawn security subagent on changed files |
| `/quality-check` | Spawn quality-control subagent |
| `/bug-hunt` | Spawn bug-finder subagent |

---

## THE WORKFLOW

### In claude.ai (this chat):
1. Start a new chat
2. Tell Claude to read `SESSION_CONTEXT.md` and `SELF_IMPROVEMENT_LOG.md`
3. Discuss what to build, research approaches, make decisions
4. Write the Claude Code build prompt (use the prompt template below)
5. Update `PROJECT_OVERVIEW.md` or `SESSION_CONTEXT.md` if meaningful decisions were made

### In Claude Code (VS Code terminal):
1. Open terminal in `C:\Users\amade\Desktop\Claude Madness\website\`
2. Run `/session-start` — reads context, confirms current state, checks branch
3. Paste the build prompt from this chat
4. Use `/compact` at ~50% context usage (don't wait until 70%+)
5. Run `/wrap` when done — tests, commit, update session files

### The update rule:
Every time something meaningful is decided in claude.ai — architecture choice, feature decision, new lesson, technical direction — update `SESSION_CONTEXT.md` or `PROJECT_OVERVIEW.md`. If it isn't written down, the next session starts without it.

---

## HOW TO WRITE A GOOD CLAUDE CODE BUILD PROMPT

Use this template for every feature build:

```
Read CLAUDE.md, SESSION_CONTEXT.md, SELF_IMPROVEMENT_LOG.md, and agent_docs/[relevant].md.

Context: [What this step does and why, in 2-3 sentences.]

STEP 1 — [name]
[Specific task with file names, component names, exact behavior expected.]
[How to verify it works.]

STEP 2 — [name]
[Next task.]
...

STEP N — Wire + verify + document
- Run npx tsc --noEmit — must pass
- Run npm run lint — must pass
- Update SESSION_CONTEXT.md with what was built
- Add any new lessons to SELF_IMPROVEMENT_LOG.md
```

**Key rules for good prompts:**
- Always start with "Read CLAUDE.md, SESSION_CONTEXT.md, SELF_IMPROVEMENT_LOG.md"
- Always end with "run tsc + lint + update session files"
- Break into numbered STEPs — never one giant instruction
- Name specific files and components explicitly
- Add `agent_docs/design-system.md` to the reads if any CSS is involved
- Use `ultrathink before [hardest decision]` for complex architecture
- Use `use context7` for any library API questions

---

## CURRENT STATE SUMMARY (as of Session 2)

See `SESSION_CONTEXT.md` for the full phase table. In short: **Phase 1a–1e are done** (light theme, layout, hero, homepage sections, event detail). **Next:** lib scaffolding for Supabase/Stripe/Resend (Phase 1f), then `/events` index and backend flows.

```
Phase 1a–1e ✅  Light UI, nav/footer, hero, carousel, archive, /events/[slug]
Phase 1f ⬜    Lib scaffolding (config + SDK clients with placeholders)
...
```

---

## WHO IS AMADEJ

- Based in Ljubljana, Slovenia. Computer science student at UL FRI.
- Member of the student council FRIKi — the site is for his council.
- Thinks in big patterns first, then drills into detail.
- Gives high-level direction, expects autonomous intelligent execution.
- Does not want 10 clarifying questions — make reasonable decisions and explain them.
- Values real files on disk. If it isn't saved and committed, it doesn't exist.
- Also runs the CORTEX project (separate AI desktop app) — context is precious.

---

## COMMON MISTAKES TO AVOID (from SELF_IMPROVEMENT_LOG)

1. **Tailwind v4 syntax** — use `@import "tailwindcss"`, not the v3 directives. Project tokens in `@theme inline {}` (see `app/globals.css`).
2. **SDK init with empty keys** — always add `|| 'placeholder_value'` fallbacks so builds pass without real keys.
3. **Server secrets in client files** — `.server.ts` files are API-route-only. Never import in pages or components.
4. **Stripe webhook raw body** — use `req.text()` not `req.json()` before `stripe.webhooks.constructEvent()`.
5. **`next/image` needs dimensions** — always provide `width` and `height` or `fill` with a relative-positioned parent.
6. **next-intl static rendering (Phase 2)** — every server page needs `setRequestLocale(locale)` before `getTranslations()`.

---

## CLAUDE CODE PERMISSIONS — NO PROMPTS

`.claude/settings.json` is configured for fully autonomous operation:
```json
{
  "permissions": {
    "allow": ["Bash(*)", "Edit(*)", "Write(*)"]
  }
}
```
Claude Code will execute all shell commands, file edits, and writes without asking for permission. Destructive commands (rm -rf /, DROP TABLE, git push --force) are blocked by PreToolUse hooks.

---

*This file is the starting point for every claude.ai strategy session.*
*Last updated: Session 2 — April 3, 2026*
