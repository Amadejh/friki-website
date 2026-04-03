Full phase closeout. Run this when a numbered phase (1a, 1b, etc.) is complete.

1. Run the full quality suite:
   ```
   npx tsc --noEmit
   npm run lint
   npm run build
   ```
   All three MUST pass. Fix any failures before continuing.

2. Commit all remaining changes:
   ```
   git add -A
   git commit -m "feat(<scope>): complete phase [X] — [short description]"
   git push origin <current-branch>
   ```

3. Merge feature branch into dev:
   ```
   git checkout dev
   git pull origin dev
   git merge --no-ff <feature-branch> -m "merge: phase [X] complete — <feature-branch> into dev"
   git push origin dev
   ```

4. Update SESSION_CONTEXT.md:
   - Change the completed phase from ⬜ to ✅
   - Update all relevant FILE STATUS entries to ✅
   - Add Session Log entry with date, branch, commits, what was built
   - Update WHAT TO BUILD NEXT to the next phase

5. Update SELF_IMPROVEMENT_LOG.md:
   - Add any new lessons learned
   - Mark any PENDING items as solved

6. Commit the doc updates:
   ```
   git add SESSION_CONTEXT.md SELF_IMPROVEMENT_LOG.md
   git commit -m "docs(session): phase [X] complete — session wrap-up"
   git push origin dev
   ```

7. Print:
   ## Phase [X] complete ✅
   **Merged:** <feature-branch> → dev
   **Next phase:** [next phase name and description from SESSION_CONTEXT]
   **Start next phase with:** `/branch [next-feature-name]`
