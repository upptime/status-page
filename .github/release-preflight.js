const semanticRelease = require("semantic-release");

/**
 * Tokenless release preflight: runs semantic-release in dry-run mode WITHOUT
 * NPM_TOKEN so that @koj/config's `npmPublish: !!process.env.NPM_TOKEN`
 * evaluates to false and npm auth verification is skipped. This lets pushes
 * with no pending release pass CI even when the NPM_TOKEN secret is invalid,
 * while pushes that DO have a pending release still run the real release step
 * (with NPM_TOKEN) so broken publishing stays visible.
 */
(async () => {
  const result = await semanticRelease(
    { dryRun: true, ci: false },
    { env: { ...process.env, NPM_TOKEN: "", NPM_CONFIG_USERCONFIG: "" } }
  );
  const required = Boolean(result);
  console.log(`::notice::release_required=${required}`);
  if (result) {
    console.log(`::notice::next_version=${result.nextRelease ? result.nextRelease.version : "unknown"}`);
  }
  require("fs").appendFileSync(
    process.env.GITHUB_OUTPUT || "/dev/null",
    `required=${required}\n`
  );
})().catch((error) => {
  console.error("Preflight failed:", error.message);
  process.exit(1);
});
