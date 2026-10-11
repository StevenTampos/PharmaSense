import { readFile } from "node:fs/promises";
import lint from "@commitlint/lint";
import load from "@commitlint/load";

async function main() {
  let title = process.argv[2];

  if (title === undefined && process.env.GITHUB_EVENT_PATH) {
    const event = JSON.parse(await readFile(process.env.GITHUB_EVENT_PATH, "utf8"));
    title = event.pull_request?.title;
  }

  if (typeof title !== "string" || !title.trim() || /[\r\n]/u.test(title)) {
    throw new Error("Provide one nonempty PR title using type(scope): short description.");
  }

  const config = await load({}, { cwd: process.cwd() });
  const result = await lint(title, config.rules, {
    parserOpts: config.parserPreset?.parserOpts,
    defaultIgnores: false,
  });

  if (!result.valid) {
    console.error("PR title must use type(scope): short description.");
    for (const error of result.errors) {
      console.error(`- ${error.message} (${error.name})`);
    }
    process.exitCode = 1;
    return;
  }

  console.log("PR title follows the commit-message convention.");
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
