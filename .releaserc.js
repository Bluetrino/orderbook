module.exports = {
  branches: ["main", { name: "develop", prerelease: true }],
  tagFormat: "${version}",
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    "@semantic-release/npm",
    "@semantic-release/github",
    [
      "@semantic-release/git",
      {
        assets: [
          ".build/**/*.{js,js.map,d.ts,json,proto}",
          "package.json",
          "CHANGELOG.md",
        ],
        message:
          "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
      },
    ],
    [
      "@semantic-release/exec",
      {
        successCmd:
          'echo "SEMANTIC_VERSION=${nextRelease.version}" >> $GITHUB_ENV && echo "VERSION_TYPE=${nextRelease.type}" >> $GITHUB_ENV',
      },
    ],
  ],
};
