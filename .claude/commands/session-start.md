Read these files in order:
1. SESSION_CONTEXT.md
2. SELF_IMPROVEMENT_LOG.md

Then run these commands and collect output:
```
git branch --show-current
git log --oneline -8
npx tsc --noEmit
npm run lint
```

Print a clean summary in this format:

## Session Start — !`date /t`
**Branch:** [current branch]
  ⚠️ If on `main`: STOP — never work directly on main. Run `/branch [feature-name]` first.
  ⚠️ If on `dev`: prefer a feature branch for new work. Run `/branch [feature-name]`.
**Recent commits:**
[last 8 commits]
**Current phase:** [phase + status from SESSION_CONTEXT]
**TypeScript:** [passing ✅ / errors ❌ — list first 3 errors if failing]
**Lint:** [passing ✅ / errors ❌]
**What to build next:** [from SESSION_CONTEXT "WHAT TO BUILD NEXT"]
**Top pending gotchas:** [top 2 items from SELF_IMPROVEMENT_LOG PENDING section]

If TypeScript or lint is failing, fix it before writing any new code.
