---
name: bump-release-version
description: Bump the release version of this repository, validate consistency, commit changes with a dedicated message, and create a release tag to trigger the actions workflow.
---

## Task preconditions

You MUST NOT generate code if even one of the preconditions is not met.

### Identify target version

Extract the version from the request.
Check if version has major number only, e.g. `1.4`.
Replace placeholder `{version}` with version.

### Validate target version

If the local release version is greater than or equal to `{version}` then
- Response with `Your local release version is greater than or equal to {version}`.
- Stop immediately.
- Do not edit files.

## Task steps

### Update VERSION file.

Set content of `VERSION` file to `{version}`.
Do not add a line break.

### Commit and push version changes

```bash
git add .
git commit -m 'version: {version}'
git push
```

### Create and push version tag

```bash
git tag {version}
git push --tags
```

The GitHub actions workflow listens for tags and executes release steps for that tagged commit.
