Proactively hunt for bugs in the codebase. Spawn a bug-finder subagent.

Usage: /bug-hunt [optional: specific area — e.g. "events page" or "checkout flow"]

1. Determine scope:
   - If $ARGUMENTS provided: focus on that area/feature
   - Otherwise: full codebase scan of `app/` and `components/` and `lib/`

2. Spawn the bug-finder subagent:
   Use agent: `.claude/agents/bug-finder.md`
   Provide the scope.

3. The bug-finder will look for:
   - Logic bugs (wrong conditional, off-by-one, inverted check)
   - Unhandled edge cases (empty arrays, null values, 0-price events)
   - Race conditions or async/await issues
   - Missing error boundaries or uncaught promise rejections
   - Data fetching without loading/error states
   - Props passed incorrectly between components
   - Accessibility regressions (missing labels, focus traps)

4. Print findings:
   ## Bug Hunt Report — [date]
   **Scope:** [what was checked]
   
   ### Confirmed Bugs (fix immediately)
   [file, line, description, reproduction steps, fix]
   
   ### Likely Bugs (investigate)
   [file, line, suspicion, how to verify]
   
   ### Code Smells (not bugs, but risky)
   [file, line, concern]
   
   **Total confirmed bugs:** N

5. Fix all confirmed bugs and commit with type `fix`.
