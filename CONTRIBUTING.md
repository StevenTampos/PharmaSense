# Contributing

## One branch per task

Keep `main` stable. Create a short-lived branch for one focused change:

```sh
git switch main
git pull --ff-only
git switch -c feat/inventory-batches
```

These commands assume the repository's initial commit has already been published. Other examples are `fix/pos-total` and `docs/setup`. There is no `develop` branch or special release process.

## Commit messages and PR titles

Use this format for both:

```text
type(scope): short description
```

Allowed types are `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, and `test`. Use a lowercase scope describing the affected area, such as `inventory`, `pos`, `auth`, `analytics`, `chatbot`, `attendance`, `db`, `setup`, or `repo`. These are examples, not a fixed list.

```text
feat(inventory): add batch expiry tracking
fix(pos): correct change calculation
docs(setup): explain local installation
chore(repo): update development tooling
```

Keep the full title at most 100 characters. Use a short, imperative description without a final period. Do not append a closing `)` to the description. Put issue references in the PR body, for example `Closes #12`.

After `npm ci`, the commit-message hook checks local messages. Validate a proposed PR title with:

```sh
npm run pr-title -- "fix(inventory): correct stock count"
```

Local hooks can be bypassed and are not a security boundary. The separate GitHub title check reports whether the PR title follows the same rules. When merging, use the valid PR title as the squash commit title.

## Before requesting review

1. Run `npm run lint` and `npm run format:check`. Apply `npm run format` when needed.
2. Run relevant application tests once those tests exist. Until then, describe what was manually checked; do not claim unimplemented tests passed.
3. Open a PR to `main` using the template. Explain the change, link its task, and include UI screenshots if relevant.
4. Request review from `@StevenTampos` and resolve review discussions.
5. Wait for checks to pass and for `@StevenTampos` to approve before merging. Re-request review after changing reviewed code.

Keep PRs small enough to review. Reviewdog annotates lint findings; it does not verify business rules, database safety, or the adequacy of tests. Dependabot update PRs follow the same review process and are never automatically merged.

## Approval policy and its limits

**Current plan: private GitHub Free.** Required approvals, protected branches, and merge-blocking status checks are unavailable. The preceding workflow is a team agreement; failing checks and missing approval do not technically prevent merging. A `CODEOWNERS` file does not enforce review by itself.

If an eligible plan becomes available, require code-owner approval on `main` with `@StevenTampos` as the sole code owner. Teammates may still submit reviews, but their approvals will not satisfy that owner's required approval. An authorized collaborator may merge after approval; this is not a restriction on who can click Merge.

GitHub does not allow PR authors to approve their own PRs. For owner-authored PRs, the agreed exception is a manual owner bypass **only after checks pass**. That bypass can technically override other protections too; it must not be used to skip checks on teammates' changes. Details are in [repository settings](docs/repository-settings.md).

Prefer squash merging and delete the task branch after merging. Do not push directly to `main`, force-push `main`, or merge automatically.

## Privacy and secrets

- Keep the reference PDF local and untracked.
- Never commit actual pharmacy records, database dumps, employee photos, biometric templates, passwords, tokens, or model weights.
- Put private data in `local-data/`, weights in `model-weights/`, and backups in `backups/`. Do not place sensitive data elsewhere and assume it is ignored.
- Use synthetic fixtures. Schema and migration source code belongs in Git; real database contents do not.
- `.env.example` files must contain placeholders only. Actual environment files remain local.
- If a credential is exposed, revoke or rotate it immediately and inform the repository owner. Removing a file in a later commit does not remove it from history.

## Add tooling as the application grows

Create `frontend/`, `backend/`, Python services, and database directories when real code exists. ESLint already separates frontend browser globals from backend and tooling Node.js globals. Update it if a different structure or language is chosen.

Add Ruff lint/format checks with the first Python service and meaningful tests with the first application modules. Add Dependabot entries for new manifests when those manifests exist. Do not introduce empty test jobs or deployment automation just to make the repository appear complete.
