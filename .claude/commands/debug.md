Debug a failing build, type error, or runtime error. Usage: /debug [optional: paste the error]

Steps:
1. If an error was passed as $ARGUMENTS, start with that. Otherwise run:
   ```
   npx tsc --noEmit 2>&1 | head -40
   npm run lint 2>&1 | head -40
   npm run build 2>&1 | tail -50
   ```

2. For each error found, print:
   **Error:** [exact error message]
   **File:** [file path + line number]
   **Root cause:** [why this is happening]
   **Fix:** [specific change to make]

3. Read SELF_IMPROVEMENT_LOG.md — check if this error pattern is a known lesson.
   If it matches a lesson, say: "This matches LESSON [N]: [title]. Applying the documented fix."

4. Apply fixes one at a time. After each fix, re-run `npx tsc --noEmit` to confirm it resolved.

5. When all errors are fixed:
   - Run the full check: `npx tsc --noEmit && npm run lint && npm run build`
   - If a new lesson was learned, add it to SELF_IMPROVEMENT_LOG.md
   - Commit the fix with `/commit` (type: `fix`)

Common causes to check first:
- Missing import
- Wrong prop type
- React 19 ref type change (Ref<T> not RefObject<T>)
- Tailwind v4 syntax used with v3 patterns
- Server-only module imported in client component
- `.env` key missing fallback causing SDK init to throw
