Run quality checks and commit to the current branch.

FIRST: Check branch with `git branch --show-current`.
- If on `main`: STOP. Never commit directly to main. Run `/branch [name]` first.
- If on `dev`: only for merge commits. Direct work goes on feature branches.
- If on `feature/*` or `fix/*` or `chore/*`: proceed.

Steps:
1. `npx tsc --noEmit` — must pass. Fix all errors before proceeding.
2. `npm run lint` — must pass. Fix all warnings before proceeding.
3. `git add -A`
4. Write commit message in conventional commit format:
   `<type>(<scope>): <short description>`

   Types: `feat` `fix` `style` `refactor` `perf` `a11y` `i18n` `api` `db` `chore` `docs`
   Scopes: `hero` `nav` `events` `cards` `gallery` `merch` `modal` `ticket` `email` `webhook` `schema` `i18n` `deps` `ci` `theme` `layout` `footer`

   Examples:
   - `feat(hero): add full-bleed layout with cursor spotlight`
   - `fix(webhook): verify stripe-signature before processing`
   - `style(theme): apply dark colour palette via CSS variables`
   - `chore(deps): add @supabase/supabase-js and stripe`

5. `git commit -m "<message>"`
6. `git push origin <current-branch>`

Do NOT run `npm run build` before every commit — it's slow. Save that for `/wrap` and `/phase-complete`.
