Create a new feature branch from dev.

Usage: /branch [description]
Example: /branch dark-theme
Example: /branch api-checkout
Example: /branch fix-mobile-nav

Steps:
1. Check current branch: `git branch --show-current`
2. If not on dev, switch first: `git checkout dev && git pull origin dev`
3. Determine branch prefix from description:
   - Contains "ui", "style", "theme", "design", "animation", "visual" → `feature/ui-$ARGUMENTS`
   - Contains "api", "webhook", "stripe", "supabase", "resend" → `feature/api-$ARGUMENTS`
   - Contains "fix", "bug", "broken", "error" → `fix/$ARGUMENTS`
   - Contains "i18n", "locale", "translation", "bilingual" → `feature/i18n-$ARGUMENTS`
   - Contains "deps", "config", "setup", "chore" → `chore/$ARGUMENTS`
   - Anything else → `feature/$ARGUMENTS`
4. Create and switch to the branch:
   ```
   git checkout -b <prefix-description>
   git push -u origin <prefix-description>
   ```
5. Confirm: `git branch --show-current`
6. Print: `Ready to work on: <branch-name>`
