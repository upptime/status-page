import { createRequire } from "module";

const require = createRequire(import.meta.url);
const baseConfig = require("../release.config.js");
const { default: semanticRelease } = await import("semantic-release");

/**
 * Tokenless release preflight: runs semantic-release in dry-run mode with
 * `@semantic-release/npm`'s `npmPublish` overridden to `false`, so npm auth
 * verification is skipped and commit analysis can still decide whether the
 * current commits warrant a new release.
 *
 * This lets no-op pushes (non-release-triggering gitmoji commits) skip the
 * Release step entirely, even while npm Trusted Publishing (OIDC) is not yet
 * configured on the npm side. Pushes that DO warrant a release report
 * `required=true`, so the real Release step runs with the full config
 * (including npm publishing) and surfaces any publishing/auth error.
 *
 * Requires Node 22+ (semantic-release@25 is ESM-only).
 */
const plugins = baseConfig.plugins.map((plugin) => {
  const name = Array.isArray(plugin) ? plugin[0] : plugin;
  const options = Array.isArray(plugin) ? plugin[1] || {} : {};
  if (name === "@semantic-release/npm") {
    return ["@semantic-release/npm", { ...options, npmPublish: false }];
  }
  return plugin;
});

const result = await semanticRelease(
  { dryRun: true, ci: false, plugins },
  {
    env: { ...process.env, NPM_CONFIG_USERCONFIG: "" },
  }
).catch((error) => {
  console.error("Preflight failed:", String(error.message || error));
  process.exit(1);
});

const required = Boolean(result);
console.log(`::notice::release_required=${required}`);
if (result) {
  console.log(
    `::notice::next_version=${
      result.nextRelease ? result.nextRelease.version : "unknown"
    }`
  );
}
const fs = await import("node:fs");
fs.appendFileSync(
  process.env.GITHUB_OUTPUT || "/dev/null",
  `required=${required}\n`
);
