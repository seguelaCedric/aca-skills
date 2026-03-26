---
name: push-to-editor
description: Push Remotion compositions to the ACA video editor via MCP tools
metadata:
  tags: push, mcp, deploy, upload, video_projects
---

# Push to the Video Editor

After writing the code, push it to the video editor using ACA MCP tools.

## Push Method

Use the `push_remotion_code` MCP tool. It handles creating or updating projects automatically.

### Create a new project:

```
push_remotion_code({
  code: "// @aspect portrait\n// @duration 32s\n// @fps 30\n... your full composition ...\nexport default MyComposition;",
  title: "Your Video Title"
})
```

Returns `{ success, project_id, scenes_synced, aspect_ratio, message }`.

### Update an existing project:

```
push_remotion_code({
  project_id: "existing-uuid",
  code: "... updated composition ...",
  title: "Updated Title"
})
```

### List existing projects:

```
list_video_projects({ limit: 10 })
```

Returns `{ projects: [{ id, title, created_at, updated_at }], count }`.

### Get a project's code:

```
get_video_project({ project_id: "uuid" })
```

Returns the full project including `remotion_code`, `scenes`, and `settings`.

## After pushing

Tell the user: "Your video is live in the editor. Open `/editor/{project_id}` to preview and export it."

## Verification

After pushing, use `get_video_project` to confirm the code was stored. Check that `remotion_code` is non-empty and starts with `// @aspect`.
