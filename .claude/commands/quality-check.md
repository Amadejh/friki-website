Run a thorough quality pass on recently changed or specified files.

Usage: /quality-check [optional: specific file or directory]

1. Determine scope:
   - If $ARGUMENTS provided: review those specific files
   - Otherwise: `git diff --name-only HEAD~1 HEAD 2>/dev/null` — review changed files

2. For each file in scope, spawn the quality-control subagent:
   Use agent: `.claude/agents/quality-control.md`

3. Also run automated checks:
   ```
   npx tsc --noEmit
   npm run lint
   ```

4. Print unified quality report:
   ## Quality Check — [date]
   **Files reviewed:** [list]
   
   ### Code Quality Issues
   [list: file, line, issue, suggested fix]
   
   ### Accessibility Issues
   [list: file, component, issue, WCAG criterion]
   
   ### Performance Concerns
   [list: file, concern, recommendation]
   
   ### Consistency Issues
   [list: things that deviate from project patterns]
   
   **Overall:** [Pass ✅ / Needs work ⚠️ / Failing ❌]

5. Fix anything rated HIGH priority before committing.
