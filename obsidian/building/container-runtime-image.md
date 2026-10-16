---
category: building
related:
  - moc.md
  - ../client/moc.md
status: current
updated: 2026-10-16
---

# Runtime image is `nginx-unprivileged`, pinned by index digest

The runtime stage of the [Dockerfile](../../Dockerfile) uses `nginxinc/nginx-unprivileged` instead of `nginx:alpine`.
The stock image runs as root and listens on port 80; a non-root user cannot bind that port, and root-owned runtime paths would need a `chown` and a replaced main `nginx.conf` in the `Dockerfile`.
The unprivileged variant avoids that extra code, and only `listen 8080;` in [nginx.conf](../../nginx.conf) had to change.
The decision is driven by the non-root requirement in the [client-container spec](../../openspec/specs/client-container/spec.md).

Pitfalls:

- The container port is 8080, not 80.
  `docker run` must map to it (`-p 8080:8080`), and `EXPOSE` must match.
- The pinned `@sha256:` digests are those of the multi-architecture image index, not of a single platform manifest, so the same `FROM` line resolves on amd64 and arm64.
  Fetch them with an `Accept` header for the OCI index or Docker manifest list, otherwise the registry returns a platform-specific digest.
- A digest never moves on its own; updating a base image means replacing the digest deliberately.
