Before writing any code, print a structured plan for the current task.

Read SESSION_CONTEXT.md to understand current phase and next task.

Then print a plan in this format:

## Plan — [task name]

**Goal:** [one sentence — what does "done" look like?]

**Files to create:**
- `path/to/file.tsx` — [what it does]

**Files to modify:**
- `path/to/file.tsx` — [what changes and why]

**Steps:**
1. [First thing to do, with specific file name and what to write]
2. [Second thing]
3. ...
N. [Last step: tsc + lint + commit]

**Risks / things to watch out for:**
- [Gotcha 1 from SELF_IMPROVEMENT_LOG or known stack quirk]
- [Gotcha 2]

**Estimated commits:** [how many logical commit units]

Do not write any code until the plan is confirmed.
Print: "Ready to proceed — confirm with 'go' or suggest changes."
