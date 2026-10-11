# Repository settings checklist

This is a checklist for the repository owner, not a record of settings already applied. The repository is public on GitHub Free. No external AI review app is installed by this setup.

## Current state

- `main` is the default branch and the initial tooling has been published.
- Quality and PR-title workflows have run successfully on a PR.
- The last verified state had no active rulesets and an unprotected `main`. Public visibility makes protection available; it does not enable protection automatically.
- `.github/CODEOWNERS` names `@StevenTampos` as the sole code owner. GitHub reads this file from the PR's base branch, and code owners need write access.

## Public visibility and collaborator access

Anyone can read, clone, download, and fork a public repository. Public forks cannot be disabled. A fork does not grant write access to this repository.

Invite only teammates under **Settings / Collaborators**. They can push to task branches and open PRs. Do not grant outside apps or people write access without a deliberate decision. Keep research documents, credentials, real pharmacy records, biometric material, and database backups out of both files and commit history.

Teammates can submit approving reviews, but required sole-code-owner review makes only `@StevenTampos`'s approval satisfy the owner gate. After that approval and passing checks, a collaborator with write access can still merge. This is an approval gate, not a rule restricting who can click Merge.

## Basic settings

In GitHub **Settings**:

- Keep `main` as the default branch.
- Under **General / Pull Requests**, allow squash merging and disable merge commits and rebase merging.
- Set the default squash commit title to the PR title. Check the title again in the merge dialog.
- Enable automatic deletion of merged branches.
- Under **Actions / General**, allow the pinned Actions used by the workflows, keep the default workflow token read-only, and leave workflow permission to create/approve PRs disabled.
- Standard GitHub-hosted Actions runners are free for public repositories. Larger runners and storage have separate limits or charges; do not enable paid services as part of the baseline.
- Enable available Dependabot alerts, secret scanning, and push protection. Consider CodeQL when application source exists; availability does not mean a scan is configured.

The workflows grant read-only access. Reviewdog emits GitHub Actions annotations rather than write-enabled review comments. No personal access token or external review service is required. Dependency installation can execute package scripts, so use GitHub-hosted ephemeral runners without application secrets for PR checks. Do not use privileged `pull_request_target` execution of untrusted PR code.

## Protect main

Use one protection method, not overlapping rulesets and classic rules. A branch ruleset on public GitHub Free can enforce the policy:

1. Open **Settings / Rulesets / New branch ruleset**.
2. Name it `protect-main`, choose **Active**, and target the branch `main`.
3. Add the repository's administrator/owner role to the bypass list with **For pull requests only**, where available. This is the agreed exception for the owner's own PRs, not permission to skip checks on teammates' PRs.
4. Enable **Restrict deletions** and **Block force pushes**.
5. Enable **Require a pull request before merging**, with **one approval**, **Require review from Code Owners**, and dismissal of stale approvals when new commits modify reviewed code.
6. Enable required conversation resolution.
7. Enable required status checks and select the actual GitHub Actions checks `quality` and `pr-title` after they appear in the picker.

Do not enable a blanket update restriction that stops collaborators from merging already approved PRs. Avoid extra rules such as required deployments, signed commits, or a merge queue for this small team.

If using a classic branch protection rule instead, apply the same PR/review/check requirements to `main` and preserve the agreed administrator bypass. Do not enable a no-bypass policy that blocks owner-authored PRs.

### Owner-authored PRs

GitHub forbids self-approval. The owner's own PRs need the agreed manual bypass after checks pass. The bypass can override other requirements too; it is an explicit trust exception, not a narrowly scoped self-approval feature. Give teammates collaborator access rather than administrator access. Revisit bypass permissions if repository ownership moves to an organization.

### If the repository becomes private again

Private GitHub Free does not provide the protected-branch enforcement needed here. Keeping enforcement while private requires GitHub Pro or another eligible plan; qualified students may receive Pro through GitHub Education. Do not assume the public rule remains enforceable after a visibility change.

## Verification on GitHub

Use a small test PR after settings changes are authorized:

1. Confirm lint and formatting run and the check names are `quality` and `pr-title`.
2. Introduce a temporary lint error in the test PR. Confirm the quality check fails and Reviewdog annotates the changed line, then remove it.
3. Give the PR an invalid title, then fix it. Confirm title edits rerun the title check.
4. Confirm a teammate's approval alone cannot satisfy code-owner review and direct teammate pushes to `main` are rejected.
5. Confirm the owner's approval satisfies review, new code dismisses stale approval, and an owner-authored PR needs the documented bypass.
6. Confirm the squash commit title matches the valid PR title.

Until active protection and these checks have been verified, do not describe sole-owner approval as enforced.

## AI review later

Reviewdog is static lint feedback, not AI business-logic review. Public repositories can qualify for ongoing free AI PR reviews from services such as CodeRabbit and Sourcery. Recheck terms and approve repository access before installing an app; it will receive source-code access. No external AI reviewer is configured here.

## References

- [GitHub rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets)
- [GitHub branch protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [GitHub CODEOWNERS](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)
- [GitHub Actions billing](https://docs.github.com/en/billing/managing-billing-for-your-products/managing-billing-for-github-actions/about-billing-for-github-actions)
- [GitHub Education](https://education.github.com/pack)
- [Reviewdog](https://github.com/reviewdog/reviewdog)
- [CodeRabbit pricing](https://www.coderabbit.ai/pricing)
- [Sourcery pricing](https://www.sourcery.ai/pricing)
