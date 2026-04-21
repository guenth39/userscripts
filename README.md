# userscripts

Small browser userscripts for day-to-day tooling improvements.

## Available Scripts

### GitHub PR Age Highlighter (Business Days)

Highlights old pull requests in `https://github.com/*/*/pulls` using business days:

- `> 3bd`: warning
- `> 7bd`: danger

- Install: [github-pr-age.user.js](https://raw.githubusercontent.com/guenth39/userscripts/main/github-pr-age.user.js)
- Source: [`github-pr-age.user.js`](./github-pr-age.user.js)

## Tampermonkey Setup

1. Open the Tampermonkey extension page in the Chrome Web Store:  
   `https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=de&utm_source=ext_sidebar`
2. Click **Add to Chrome** and confirm with **Add extension**.
3. Optional but recommended: click the puzzle icon in Chrome and pin Tampermonkey for quick access.
4. Open the install link above (`github-pr-age.user.js`).
5. Tampermonkey opens an install tab automatically.
6. Click **Install** in Tampermonkey.
7. Open or reload a GitHub pull request list page (`https://github.com/*/*/pulls`).
8. Verify the script is active:
   - Tampermonkey icon shows the script count on GitHub.
   - Older pull requests are highlighted by age.

## Development Flow

Use this flow for reliable updates:

1. Edit the script file (for example `github-pr-age.user.js`).
2. Increase `@version` in the userscript header (for example `1.0.0` -> `1.0.1`).
3. Test locally in Tampermonkey:
   - Open Tampermonkey dashboard.
   - Open the script and paste/test changes, or reinstall from Raw URL.
4. Commit and push changes to `main`.
5. Team members get the update through Tampermonkey's update check.

## Sharing With Colleagues

The easiest team sharing setup is:

1. Share the install link:
   - `https://raw.githubusercontent.com/guenth39/userscripts/main/github-pr-age.user.js`
2. Colleagues install once via Tampermonkey.
3. Future updates are distributed by bumping `@version` and pushing to this repo.

Tip: Add the install link to your team wiki/Notion/Slack pinned message.

## Adding More Scripts

You can keep multiple scripts in this same repository:

- One `.user.js` file per script.
- One install link per script in this README.
- Always include `@downloadURL` and `@updateURL`.
- Always bump `@version` on every release.

## Cursor AI Rules

This repository includes project-specific Cursor guidance in `.cursor/`.

- Overview: [`.cursor/README.md`](./.cursor/README.md)
- Rules: [`.cursor/rules/`](./.cursor/rules/)

## Troubleshooting

- Script not updating:
  - Check that `@version` increased.
  - In Tampermonkey dashboard, use **Check for userscript updates**.
- Script not running:
  - Verify `@match` covers the target URL.
  - Reload the page after install/update.
