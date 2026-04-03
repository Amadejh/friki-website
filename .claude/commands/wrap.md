End-of-session wrap-up. Execute in order:

1. Quality checks:
   ```
   npx tsc --noEmit
   npm run lint
   npm run build
   ```
   Fix anything that fails. Do not proceed until all three pass.

2. Commit all remaining changes on the current branch:
   ```
   git add -A
   git commit -m "<type>(<scope>): <description>"
   git push origin <current-branch>
   ```

3. If the feature is complete and ready to merge into dev:
   ```
   git checkout dev
   git merge --no-ff <feature-branch> -m "merge: <feature-branch> into dev"
   git push origin dev
   ```
   Only merge dev → main when dev is fully stable and ready to deploy.

4. Update SESSION_CONTEXT.md:
   - Add a Session Log entry: date, branch worked on, what was built, commit hash(es)
   - Update the FILE STATUS table (mark completed files ✅)
   - Update WHAT TO BUILD NEXT
   - Update Phase Status table if a phase completed

5. Update SELF_IMPROVEMENT_LOG.md:
   - Add any new lessons learned this session
   - Mark any PENDING items as SOLVED if they were resolved

6. Commit the documentation updates:
   ```
   git add SESSION_CONTEXT.md SELF_IMPROVEMENT_LOG.md
   git commit -m "docs(session): session wrap-up log"
   git push origin <current-branch>
   ```

7. Print summary:
   ## Session complete ✅
   **Branch:** [current branch]
   **Commits this session:** [list commit hashes + messages]
   **Next session should start with:** [branch name and first task]
