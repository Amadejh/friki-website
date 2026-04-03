Print a quick status snapshot of the project. No code changes.

Run:
```
git branch --show-current
git log --oneline -5
git status --short
npx tsc --noEmit 2>&1 | tail -5
```

Then read SESSION_CONTEXT.md (Phase Status and File Status sections only).

Print in this format:

## Status Snapshot — !`date /t`

**Branch:** [branch name]
**Uncommitted changes:** [file list from git status, or "none"]
**Recent commits:**
[last 5 commits]

**Phase progress:**
[copy Phase Status table from SESSION_CONTEXT]

**TypeScript:** [passing ✅ / errors ❌ — count]
**What's next:** [from SESSION_CONTEXT WHAT TO BUILD NEXT]
