# Repository settings checklist

This is a checklist for the repository owner, not a record of settings already applied. Keep the repository private. Do not install external AI apps or change paid services without a separate decision.

## Initial publication

The local repository began without a first commit. Before initial publication, verify that the configured remote is correct and whether it already contains commits. Do not force-push over remote history. Publish the initial setup on `main` through an explicitly authorized bootstrap step; normal feature PRs start afterward.

Confirm that `@StevenTampos` is the intended owner before relying on `.github/CODEOWNERS`. Code owners need write access. GitHub reads `CODEOWNERS` from a PR's base branch, so it must exist on `main` to apply to PRs targeting `main`.

## Available baseline

In GitHub **Settings**:

- Keep `main` as the default branch once it exists.
- Under **General / Pull Requests**, allow squash merging and disable merge commits and rebase merging.
- Set the default squash commit title to the PR title. Check the title again in the merge dialog.
- Enable automatic deletion of merged branches.
- Under **Actions / General**, allow the pinned Actions used by the workflows, keep the default workflow token read-only, and leave permission to create/approve PRs disabled.
- Check private-repository Actions usage and spending settings. The free allowance is limited; do not enable paid overage as part of this setup.
- Enable Dependabot alerts and available security updates. `.github/dependabot.yml` configures scheduled version-update PRs after publication; no automatic merging is configured.

The workflows grant read-only access. Reviewdog uses GitHub Actions annotations rather than posting write-enabled review comments. No personal access token or external review service is required. New dependency installations can execute package scripts, so run them only on GitHub-hosted ephemeral runners without application credentials.

## Current limitation: private GitHub Free

GitHub Free does not provide protected branches for private repositories. Checks can fail and policy can require review, but those conditions cannot be made merge-blocking on this plan. `CODEOWNERS` does not change that. Do not describe the repository as technically enforcing sole-owner approval yet.

To enforce the policy while remaining private, obtain GitHub Pro or another eligible plan. Qualified students may receive Pro through GitHub Education, but eligibility and benefits must be verified on the account. Do not change the repository to public simply to unlock protections.

## Optional protection after an eligible plan is available

After the workflows have successfully run and the actual check names are visible, add a branch protection rule for `main`:

- Require a pull request before merging.
- Require **one approving review**.
- Require review from code owners, with `* @StevenTampos` as the sole ownership rule.
- Dismiss stale approvals when new commits modify reviewed code.
- Require conversation resolution.
- Require the `quality` and `pr-title` status checks. Select the checks reported by GitHub Actions rather than guessing their names.
- Leave force pushes and branch deletion disabled.
- Preserve the administrator bypass for the owner's own PRs; do not enable **Do not allow bypassing the above settings** under the agreed owner-exception policy.

Only give teammates collaborator access, not administrative access. Revisit the bypass policy if the repository moves to an organization or its permissions model changes.

### What this does and does not guarantee

A teammate can click Approve, but that review does not satisfy required sole-code-owner approval. After the owner approves and checks pass, someone with merge permission may still click Merge. This policy gates approval, not the merge button's identity.

GitHub forbids self-approval. The owner's own PRs therefore need the agreed manual administrator bypass after passing checks. That bypass can override other requirements too; it is an explicit trust exception, not a narrowly scoped self-approval feature.

## Verification on GitHub

Use a small test PR after publication is authorized:

1. Confirm lint and formatting run and the check names are `quality` and `pr-title`.
2. Introduce a temporary lint error in the test PR. Confirm the quality check fails and Reviewdog annotates the changed line, then remove it.
3. Give the PR an invalid title, then fix it. Confirm title edits rerun the title check.
4. On Free, record that checks and approvals remain advisory; do not claim a merge restriction was tested.
5. On an eligible protected plan, confirm a teammate's approval is insufficient, direct teammate pushes to `main` are rejected, the owner's approval satisfies review, and new code dismisses stale approval. Confirm an owner-authored PR needs the documented bypass.
6. Confirm the squash commit title matches the valid PR title.

## AI review later

Reviewdog is static lint feedback, not AI business-logic review. CodeRabbit and Sourcery currently offer ongoing free reviews for public repositories, not private repositories after their trials. Before choosing an AI app, recheck current free private-repository eligibility and approve its source-code access. No such app is installed by this setup.

## References

- [GitHub branch protection and plan availability](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [GitHub CODEOWNERS](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)
- [GitHub Education](https://education.github.com/pack)
- [Reviewdog](https://github.com/reviewdog/reviewdog)
- [CodeRabbit pricing](https://www.coderabbit.ai/pricing)
- [Sourcery pricing](https://www.sourcery.ai/pricing)
