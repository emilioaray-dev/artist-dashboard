#!/usr/bin/env node

/**
 * Version bump script — keeps package.json as the single source of truth.
 *
 * Usage:
 *   node scripts/bump-version.mjs patch        # 1.0.1 → 1.0.2
 *   node scripts/bump-version.mjs minor        # 1.0.1 → 1.1.0
 *   node scripts/bump-version.mjs major        # 1.0.1 → 2.0.0
 *   node scripts/bump-version.mjs patch --tag  # also runs: git tag vX.Y.Z
 *
 * Updated files:
 *   - package.json + package-lock.json
 *   - sonar-project.properties  (sonar.projectVersion)
 *   - CHANGELOG.md              (Unreleased header + comparison links)
 *
 * Does NOT auto-commit or auto-push (respects manual release workflow).
 */

import { readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

// --- Parse args -----------------------------------------------------------
const args = process.argv.slice(2);
const bumpType = args.find((a) => ["patch", "minor", "major"].includes(a));
const shouldTag = args.includes("--tag");

if (!bumpType) {
  console.error("Usage: node scripts/bump-version.mjs <patch|minor|major> [--tag]");
  process.exit(1);
}

// --- Compute new version --------------------------------------------------
const pkgPath = resolve(root, "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
const oldVersion = pkg.version;
const [major, minor, patch] = oldVersion.split(".").map(Number);

let newVersion;
if (bumpType === "major") newVersion = `${major + 1}.0.0`;
else if (bumpType === "minor") newVersion = `${major}.${minor + 1}.0`;
else newVersion = `${major}.${minor}.${patch + 1}`;

const today = new Date().toISOString().slice(0, 10);
const updated = [];
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// --- 1. package.json ------------------------------------------------------
pkg.version = newVersion;
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
updated.push("package.json");

// --- 2. package-lock.json -------------------------------------------------
try {
  execSync("npm install --package-lock-only --ignore-scripts", {
    cwd: root,
    stdio: "ignore",
  });
  updated.push("package-lock.json");
} catch {
  console.warn("⚠  Could not update package-lock.json (npm install failed)");
}

// --- 3. sonar-project.properties ------------------------------------------
const sonarPath = resolve(root, "sonar-project.properties");
try {
  let sonar = readFileSync(sonarPath, "utf-8");
  if (sonar.includes("sonar.projectVersion=")) {
    sonar = sonar.replace(
      /sonar\.projectVersion=.*/,
      `sonar.projectVersion=${newVersion}`,
    );
  } else {
    sonar = sonar.replace(
      /(sonar\.host\.url=.*\n)/,
      `$1sonar.projectVersion=${newVersion}\n`,
    );
  }
  writeFileSync(sonarPath, sonar);
  updated.push("sonar-project.properties");
} catch {
  console.warn("⚠  Could not update sonar-project.properties");
}

// --- 4. CHANGELOG.md ------------------------------------------------------
const changelogPath = resolve(root, "CHANGELOG.md");
try {
  let changelog = readFileSync(changelogPath, "utf-8");

  // Insert new version header into the body
  const escapedOld = escapeRegex(oldVersion);
  if (changelog.includes("## [Unreleased]")) {
    // Replace existing Unreleased heading — stamp it as the new version
    changelog = changelog.replace(
      /## \[Unreleased\]/,
      `## [Unreleased]\n\n## [${newVersion}] - ${today}`,
    );
  } else {
    // No Unreleased section — insert both before the previous latest entry
    const latestHeading = `## [${oldVersion}]`;
    if (changelog.includes(latestHeading)) {
      changelog = changelog.replace(
        latestHeading,
        `## [Unreleased]\n\n## [${newVersion}] - ${today}\n\n${latestHeading}`,
      );
    }
  }

  // Update comparison links at the bottom
  const repoUrl = "https://github.com/emilioaray-dev/artist-dashboard";
  const unreleasedLink = `[Unreleased]: ${repoUrl}/compare/v${newVersion}...HEAD`;
  const newVersionLink = `[${newVersion}]: ${repoUrl}/compare/v${oldVersion}...v${newVersion}`;

  if (changelog.includes("[Unreleased]:")) {
    changelog = changelog.replace(/\[Unreleased\]:.*/, unreleasedLink);
  } else {
    // Add before the first version link
    const firstLinkPattern = new RegExp(`(\\[${escapedOld}\\]:)`);
    if (firstLinkPattern.test(changelog)) {
      changelog = changelog.replace(firstLinkPattern, `${unreleasedLink}\n$1`);
    }
  }

  // Add new version comparison link if it doesn't exist
  if (!changelog.includes(`[${newVersion}]:`)) {
    const oldLinkPattern = new RegExp(`(\\[${escapedOld}\\]:.*)`);
    if (oldLinkPattern.test(changelog)) {
      changelog = changelog.replace(oldLinkPattern, `${newVersionLink}\n$1`);
    }
  }

  writeFileSync(changelogPath, changelog);
  updated.push("CHANGELOG.md");
} catch {
  console.warn("⚠  Could not update CHANGELOG.md");
}

// --- 5. Optional git tag --------------------------------------------------
if (shouldTag) {
  try {
    execSync(`git tag v${newVersion}`, { cwd: root, stdio: "inherit" });
    console.log(`\n🏷  Created tag v${newVersion}`);
  } catch {
    console.warn(`⚠  Could not create tag v${newVersion}`);
  }
}

// --- Summary --------------------------------------------------------------
console.log(`\n✅ Bumped ${oldVersion} → ${newVersion} (${bumpType})`);
console.log(`   Updated: ${updated.join(", ")}`);
