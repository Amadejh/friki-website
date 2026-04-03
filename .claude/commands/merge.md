Merge the current feature branch into dev.

Steps:
1. Check current branch: `git branch --show-current`
   - If on main: STOP. This command merges feature → dev, not dev → main.
   - If already on dev: STOP. Check out the feature branch first.
2. Run pre-merge quality checks:
   ```
   npx tsc --noEmit
   npm run lint
   npm run build
   ```
   All three must pass. Fix failures before merging.
3. Get the current branch name: `FEATURE=$(git branch --show-current)`
4. Switch to dev and merge:
   ```
   git checkout dev
   git pull origin dev
   git merge --no-ff $FEATURE -m "merge: $FEATURE into dev"
   git push origin dev
   ```
5. Confirm merge: `git log --oneline -5`
6. Print:
   ## Merged ✅
   **Branch merged:** $FEATURE → dev
   **Next:** continue on dev, or create a new feature branch with `/branch [name]`
   **To deploy:** create a PR from dev → main on GitHub

Note: Merging dev → main should only be done via a GitHub PR, not from the terminal.
