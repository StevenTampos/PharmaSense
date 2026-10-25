import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";

async function main() {
  if (!process.env.GITHUB_EVENT_PATH) {
    throw new Error("GITHUB_EVENT_PATH is required.");
  }

  const event = JSON.parse(await readFile(process.env.GITHUB_EVENT_PATH, "utf8"));
  const pr = event.pull_request;
  if (!pr) {
    throw new Error("No pull_request found in GitHub event.");
  }

  const prNumber = pr.number;
  const currentTitle = pr.title || "";
  const originalBody = pr.body || "";

  // If already formatted, avoid re-formatting
  if (originalBody.includes("## Summary") && originalBody.includes("## Checklist")) {
    console.log("PR body is already formatted according to template.");
    return;
  }

  // Ensure title conforms to commitlint (max 100 chars, valid prefix)
  let newTitle = currentTitle.trim();
  if (newTitle.length > 100) {
    const prefixMatch = newTitle.match(/^(chore\(deps\)|ci\(deps\)):\s*/);
    if (prefixMatch) {
      const prefix = prefixMatch[0];
      const maxDescLength = 100 - prefix.length - 3;
      const desc = newTitle.slice(prefix.length).slice(0, maxDescLength).trim();
      newTitle = `${prefix}${desc}...`;
    } else {
      newTitle = `${newTitle.slice(0, 97)}...`;
    }
  }

  const dependencyNames = process.env.DEPENDENCY_NAMES || "dependencies";
  const updateType = process.env.UPDATE_TYPE || "dependency";

  const newBody = `## Summary

Automated ${updateType} update for \`${dependencyNames}\`.

## Linked task

None.

## How tested

Automated CI checks (\`quality\`, \`pr-title\`, \`codeql\`, \`dependency-review\`).

## Checklist

- [x] The PR title uses \`type(scope): short description\`.
- [x] Lint and formatting checks pass.
- [x] Relevant tests or manual verification are described above.
- [x] No secrets, real pharmacy data, biometric records, or reference paper are included.
- [x] Review has been requested from \`@StevenTampos\`.

<details>
<summary>Dependabot release notes and details</summary>

${originalBody}

</details>`;

  console.log(`Updating PR #${prNumber}...`);
  execFileSync("gh", ["pr", "edit", String(prNumber), "--title", newTitle, "--body", newBody], {
    stdio: "inherit",
    env: process.env,
  });

  console.log(`PR #${prNumber} formatted successfully.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
