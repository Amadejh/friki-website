Spawn a security subagent to review recently changed files.

1. Get the list of changed files:
   ```
   git diff --name-only HEAD~1 HEAD 2>/dev/null || git diff --name-only --cached
   ```

2. Filter to relevant files (TypeScript, API routes, config):
   - All `app/api/**/*.ts` files
   - All `lib/**/*.ts` files
   - Any file containing "stripe", "supabase", "resend", "config", "env"

3. For each relevant file, spawn the security-reviewer subagent:
   Use agent: `.claude/agents/security-reviewer.md`
   Pass the file content and path.

4. Collect all findings and print a unified report:
   ## Security Review — [date]
   **Files reviewed:** [count]
   
   ### CRITICAL (fix before commit)
   [list each finding: file, line, description, fix]
   
   ### HIGH (fix before commit)
   [list each finding]
   
   ### MEDIUM (flag, fix when possible)
   [list each finding]
   
   **Summary:** CRITICAL: N | HIGH: N | MEDIUM: N
   
   If CRITICAL > 0: "❌ Do not commit until all CRITICAL issues are resolved."
   If CRITICAL = 0 and HIGH = 0: "✅ No blocking issues found."

5. Fix all CRITICAL findings immediately. Fix all HIGH findings before the next commit.
