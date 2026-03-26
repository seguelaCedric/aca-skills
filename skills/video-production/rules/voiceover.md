---
name: voiceover
description: TTS voiceover generation via ElevenLabs, voice selection, push to project, script rules
metadata:
  tags: voiceover, tts, elevenlabs, speech, audio, captions, character, voice
---

# Voiceover (MANDATORY for scripted videos)

After pushing composition + SFX/music, generate voiceover audio from the script.

## Voice Selection

Pick the right voice for the content:

1. **User specifies a voice** in their prompt - use it
2. **Org has a default character** - use `list_voices` MCP tool to find available voices
3. **No character configured** - omit voice_id to use the ElevenLabs default (Rachel)

## Generate and Attach TTS

Use the `generate_video_tts` MCP tool - it generates audio and attaches it to the project in one step:

```
generate_video_tts({
  project_id: "uuid",
  text: "Your voiceover script here. Keep it natural and conversational.",
  voice_id: "optional-voice-uuid"
})
```

Returns:
```json
{
  "success": true,
  "project_id": "uuid",
  "audio_url": "https://...",
  "duration": 25,
  "word_count": 68,
  "message": "Voiceover generated (25s, 68 words) and attached to project."
}
```

Word timestamps are automatically attached for caption sync.

## Manual Voiceover (pre-recorded audio)

If the user provides their own audio file, use `set_video_voiceover`:

```
set_video_voiceover({
  project_id: "uuid",
  url: "https://path-to-audio.mp3",
  script: "The transcript text",
  word_timestamps: [{"word": "Hello", "start": 0.0, "end": 0.25}, ...]
})
```

## Script Rules

- The voiceover script must follow the SAME narrative as the source content - no invented lines
- Keep it natural and conversational - write for the ear, not the eye
- Match the pacing to the composition: roughly 2-3 words per second
- If the video is 30s, the script should be ~60-90 words
- Captions auto-render when `caption_style` is set and `word_timestamps` are present
