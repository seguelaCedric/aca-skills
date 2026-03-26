---
name: logo-reveal
description: Logo and brand entrance animations for Remotion - scale, glow, and tagline fade-in.
metadata:
  tags: logo, brand, reveal, intro, outro, branding
---

## Scale + Glow Logo Reveal

Logo scales in from 0 with a glow ring expanding behind it, followed by a tagline fade-in. Use for intros and outros.

See [LogoReveal](assets/logo-reveal-scale-glow.tsx) for a complete runnable example with glow ring and tagline.

```tsx
const LogoReveal: React.FC<{
  logoText: string;
  tagline?: string;
  color?: string;
  delay?: number;
}> = ({ logoText, tagline, color = "#6366f1", delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({
    frame, fps, delay,
    config: { damping: 12, stiffness: 200 },
  });
  const glowExpand = spring({
    frame, fps, delay,
    config: { damping: 30, stiffness: 60 },
  });
  const taglineEntrance = spring({
    frame, fps,
    delay: delay + Math.round(0.6 * fps),
    config: { damping: 200 },
  });

  const glowSize = interpolate(glowExpand, [0, 1], [0, 400]);
  const glowOpacity = interpolate(glowExpand, [0, 0.3, 1], [0, 0.5, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
      }}
    >
      {/* Glow ring */}
      <div style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: glowSize,
            height: glowSize,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
            opacity: glowOpacity,
            transform: "translate(-50%, -50%)",
            filter: "blur(40px)",
          }}
        />
        {/* Logo text */}
        <div
          style={{
            position: "relative",
            fontSize: 72,
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: 4,
            transform: `scale(${logoScale})`,
            opacity: logoScale,
            textShadow: `0 0 60px ${color}60`,
          }}
        >
          {logoText}
        </div>
      </div>

      {/* Tagline */}
      {tagline && (
        <div
          style={{
            fontSize: 28,
            fontWeight: 600,
            color: "rgba(255,255,255,0.6)",
            opacity: taglineEntrance,
            transform: `translateY(${interpolate(taglineEntrance, [0, 1], [15, 0])}px)`,
            letterSpacing: 2,
          }}
        >
          {tagline}
        </div>
      )}
    </div>
  );
};
```

## Image Logo Reveal

Same animation but with an `<Img>` element instead of text. Use when you have a logo image URL.

```tsx
const ImageLogoReveal: React.FC<{
  src: string;
  width?: number;
  tagline?: string;
  color?: string;
  delay?: number;
}> = ({ src, width = 200, tagline, color = "#6366f1", delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({
    frame, fps, delay,
    config: { damping: 12, stiffness: 200 },
  });
  const taglineEntrance = spring({
    frame, fps,
    delay: delay + Math.round(0.6 * fps),
    config: { damping: 200 },
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
      <Img
        src={src}
        style={{
          width,
          transform: `scale(${logoScale})`,
          opacity: logoScale,
          filter: `drop-shadow(0 0 30px ${color}50)`,
        }}
      />
      {tagline && (
        <div
          style={{
            fontSize: 28,
            fontWeight: 600,
            color: "rgba(255,255,255,0.6)",
            opacity: taglineEntrance,
            transform: `translateY(${interpolate(taglineEntrance, [0, 1], [15, 0])}px)`,
          }}
        >
          {tagline}
        </div>
      )}
    </div>
  );
};
```

## Underline Reveal

Text logo with an animated underline that draws across. Clean, minimal style.

```tsx
const UnderlineReveal: React.FC<{
  text: string;
  color?: string;
  delay?: number;
}> = ({ text, color = "#6366f1", delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const textEntrance = spring({ frame, fps, delay, config: { damping: 200 } });
  const lineProgress = interpolate(
    frame,
    [delay + Math.round(0.4 * fps), delay + Math.round(0.9 * fps)],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
      <div
        style={{
          fontSize: 64,
          fontWeight: 900,
          color: "#ffffff",
          letterSpacing: 3,
          opacity: textEntrance,
          transform: `translateY(${interpolate(textEntrance, [0, 1], [20, 0])}px)`,
        }}
      >
        {text}
      </div>
      <div
        style={{
          height: 4,
          width: `${lineProgress}%`,
          background: color,
          borderRadius: 2,
          marginTop: 8,
          boxShadow: `0 0 12px ${color}80`,
          alignSelf: "flex-start",
        }}
      />
    </div>
  );
};
```

## Logo Asset Library

Logos are stored in the Supabase `content-media` bucket under a dedicated path convention:

```
content-media/
  video-assets/logos/
    {org_id}/
      logo-primary.png       # Main logo (transparent PNG)
      logo-white.png          # White/mono version for dark backgrounds
      logo-icon.png           # Icon-only / square mark
      logo-wordmark.png       # Text-only wordmark
```

**Base URL pattern:**
```
{SUPABASE_STORAGE_URL}/storage/v1/object/public/content-media/video-assets/logos/{org_id}/{filename}
```

### How to use logos in compositions

**Step 1: Check what logos exist for the org.**

Before writing code, query the storage bucket to see what's available:

```sql
SELECT name FROM storage.objects
WHERE bucket_id = 'content-media'
  AND name LIKE 'video-assets/logos/{org_id}/%'
ORDER BY name;
```

**Step 2: Build the URL and use `<Img>`.**

```tsx
const LOGO_BASE = "YOUR_SUPABASE_URL/storage/v1/object/public/content-media/video-assets/logos";
const orgId = "YOUR_ORG_ID"; // current org

// Use in ImageLogoReveal
<ImageLogoReveal
  src={`${LOGO_BASE}/${orgId}/logo-white.png`}
  width={220}
  tagline="Automated Client Acquisition"
  color="#6366f1"
/>
```

**Step 3: Always use `<Img>` from Remotion** (available as a global in the ACA editor). Never use `<img>` or CSS `background-image` -- they cause blank frames during export.

### Decision tree: text logo vs image logo

- **No logos uploaded for this org** -> Use `LogoReveal` (text) or `UnderlineReveal` (text)
- **Logo exists** -> Use `ImageLogoReveal` with `logo-white.png` (preferred on dark backgrounds) or `logo-primary.png`
- **Only icon available** -> Use `ImageLogoReveal` with smaller `width` (80-120px) + text name below

## Public / Third-Party Logos

For videos that reference external brands, competitors, tools, or platforms (e.g. "Slack", "HubSpot", "Notion"), use public logo APIs. These are CORS-safe and return PNGs on the fly.

### Logo sources (in priority order)

**1. logo.dev (best quality, SVG/PNG, free tier)**
```
https://img.logo.dev/{domain}?token=YOUR_LOGO_DEV_TOKEN&size=200&format=png
```
Examples:
```tsx
// Company logos by domain
<Img src="https://img.logo.dev/slack.com?token=YOUR_LOGO_DEV_TOKEN&size=200&format=png" style={{ width: 80 }} />
<Img src="https://img.logo.dev/hubspot.com?token=YOUR_LOGO_DEV_TOKEN&size=200&format=png" style={{ width: 80 }} />
<Img src="https://img.logo.dev/notion.so?token=YOUR_LOGO_DEV_TOKEN&size=200&format=png" style={{ width: 80 }} />
```

**2. Clearbit Logo API (free, PNG, 128px)**
```
https://logo.clearbit.com/{domain}
```
Examples:
```tsx
<Img src="https://logo.clearbit.com/stripe.com" style={{ width: 60 }} />
<Img src="https://logo.clearbit.com/salesforce.com" style={{ width: 60 }} />
```

**3. Google Favicon (fallback, small, 64px max)**
```
https://www.google.com/s2/favicons?domain={domain}&sz=64
```

### How to use public logos in compositions

When a scene references external tools/brands (e.g. an icon grid of "11 tools" or a comparison), use the company's domain to pull their logo:

```tsx
const tools = [
  { name: "HubSpot", domain: "hubspot.com", color: "#ff7a59" },
  { name: "Slack", domain: "slack.com", color: "#4a154b" },
  { name: "Notion", domain: "notion.so", color: "#ffffff" },
  { name: "Zapier", domain: "zapier.com", color: "#ff4a00" },
];

// In the render
{tools.map((tool, i) => (
  <div key={i} style={{ display: "flex", alignItems: "center", gap: 16 }}>
    <Img
      src={`https://img.logo.dev/${tool.domain}?token=YOUR_LOGO_DEV_TOKEN&size=200&format=png`}
      style={{ width: 48, height: 48, borderRadius: 10 }}
    />
    <span style={{ fontSize: 24, fontWeight: 700, color: "#ffffff" }}>{tool.name}</span>
  </div>
))}
```

### Rules for public logos

- **Always use `<Img>` from Remotion** -- ensures the logo is fully loaded before the frame renders.
- **logo.dev is preferred** -- higher quality, larger sizes, transparent backgrounds.
- **Clearbit is the fallback** -- works for most major companies but smaller output.
- **Google favicons are last resort** -- low resolution, only for tiny icon use.
- **Add `borderRadius: 10-12`** to logo containers -- many logos have square/rounded backgrounds that look better with radius.
- **On dark backgrounds**, some logos may be invisible (dark logo on dark bg). Add a subtle white container or `filter: brightness(1.2)` if needed.
- **Size logos consistently** within a grid or list -- all logos in the same scene should be the same width/height.

### Uploading logos

If the user provides a logo file or URL, upload it to the correct path before using it:

```sql
-- Check if the folder exists
SELECT name FROM storage.objects
WHERE bucket_id = 'content-media'
  AND name LIKE 'video-assets/logos/{org_id}/%';
```

For uploading, use the Supabase Storage API or ask the user to upload via the UI.

## Usage Rules

- Logo reveals use a **bouncy spring** (`damping: 12, stiffness: 200`) for impact.
- The glow ring expands BEHIND the logo with blur - it should feel like a light source, not an outline.
- Tagline always enters AFTER the logo (0.6s delay) with a smooth spring.
- Use `letterSpacing: 3-4` on logo text for a premium feel.
- Logo reveals are typically 3-4 seconds total. Don't overstay.
- For image logos, use `filter: drop-shadow()` instead of `boxShadow` (works with transparent PNGs).
- **Always check the logo library first** before falling back to text logos.
- Prefer `logo-white.png` on dark backgrounds for maximum contrast.
- Logo images should be transparent PNGs. If they have a solid background, add `borderRadius` to soften edges.
