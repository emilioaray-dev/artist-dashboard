# WebMCP Tools for Artist Dashboard

Complete mapping of existing API surface to WebMCP tools.

## Architecture

```
src/components/webmcp/
├── WebMCPProvider.tsx      # Mounts all tool components (client component)
├── tools/
│   ├── ReleasesTool.tsx    # get_releases, get_release_by_id, search_releases
│   ├── SalesTool.tsx       # get_sales, get_revenue_summary
│   ├── EngagementTool.tsx  # get_engagement, get_fan_growth, get_top_fans
│   └── PlayerTool.tsx      # play_track, control_player, get_player_state
└── types/
    └── webmcp.d.ts         # TypeScript declarations for form attributes
```

Mount in dashboard layout:

```typescript
// src/app/[locale]/(dashboard)/layout.tsx
import { WebMCPProvider } from '@/components/webmcp/WebMCPProvider';

// Add <WebMCPProvider /> alongside existing providers
```

## Tool Definitions

### 1. get_releases (read-only)

```typescript
useWebMCP({
  name: 'get_releases',
  description: 'Get all music releases from the artist dashboard. Returns title, type (single/ep/album/drop/bundle), status (draft/scheduled/live/archived), release date, total sales, and revenue data by channel.',
  inputSchema: {},
  handler: async () => {
    const res = await fetch('/api/releases');
    return await res.json();
  },
  annotations: { readOnlyHint: true },
});
```

**Maps to**: `GET /api/releases` → `Release[]`

### 2. get_release_by_id (read-only)

```typescript
useWebMCP({
  name: 'get_release_by_id',
  description: 'Get a specific music release by its ID. Returns full details including sales breakdown by channel (direct_to_fan, digital, physical, bundles).',
  inputSchema: {
    id: z.string().describe('Release ID (e.g., rel_001, rel_002)'),
  },
  handler: async ({ id }) => {
    const res = await fetch('/api/releases');
    const data = await res.json();
    const release = data.data?.find((r: any) => r.id === id);
    return release || { error: 'Release not found' };
  },
  annotations: { readOnlyHint: true },
});
```

**Maps to**: `getCachedReleaseById(id)` server action

### 3. get_sales (read-only)

```typescript
useWebMCP({
  name: 'get_sales',
  description: 'Get sales analytics for a time range. Returns total revenue, total units sold, gross/net revenue, daily breakdown, and revenue by channel (direct_to_fan, digital, physical, bundles). Revenue values are in cents.',
  inputSchema: {
    range: z.enum(['7d', '30d', '90d']).describe('Time range: 7d (week), 30d (month), or 90d (quarter)'),
  },
  handler: async ({ range }) => {
    const res = await fetch(`/api/sales?range=${range}`);
    return await res.json();
  },
  annotations: { readOnlyHint: true },
});
```

**Maps to**: `GET /api/sales?range=<7d|30d|90d>` → `SalesSummary`

### 4. get_engagement (read-only)

```typescript
useWebMCP({
  name: 'get_engagement',
  description: 'Get fan engagement metrics. Returns total fans, active fans, total buyers, fan growth (absolute + percentage + trend), engagement rate, purchase rate, and 90 days of fan count history.',
  inputSchema: {},
  handler: async () => {
    const res = await fetch('/api/engagement');
    return await res.json();
  },
  annotations: { readOnlyHint: true },
});
```

**Maps to**: `GET /api/engagement` → `EngagementMetrics`

### 5. get_top_fans (read-only)

```typescript
useWebMCP({
  name: 'get_top_fans',
  description: 'Get top fans ranked by total spending. Returns display name, total amount spent (in cents), purchase count, and avatar URL.',
  inputSchema: {
    limit: z.number().min(1).max(20).optional().describe('Number of fans to return (default 5, max 20)'),
  },
  handler: async ({ limit = 5 }) => {
    const res = await fetch('/api/engagement');
    const data = await res.json();
    return (data.data?.topFans || []).slice(0, limit);
  },
  annotations: { readOnlyHint: true },
});
```

**Maps to**: `getCachedTopFans(limit)` server action

### 6. get_revenue_summary (read-only)

```typescript
useWebMCP({
  name: 'get_revenue_summary',
  description: 'Get a formatted revenue summary comparing different time periods. Returns revenue, change percentage, and trend for 7-day, 30-day, and 90-day windows.',
  inputSchema: {},
  handler: async () => {
    const [week, month, quarter] = await Promise.all([
      fetch('/api/sales?range=7d').then(r => r.json()),
      fetch('/api/sales?range=30d').then(r => r.json()),
      fetch('/api/sales?range=90d').then(r => r.json()),
    ]);
    return {
      '7d': { revenue: week.data?.totalRevenue, change: week.data?.revenueChange },
      '30d': { revenue: month.data?.totalRevenue, change: month.data?.revenueChange },
      '90d': { revenue: quarter.data?.totalRevenue, change: quarter.data?.revenueChange },
    };
  },
  annotations: { readOnlyHint: true },
});
```

**Maps to**: Multiple `GET /api/sales` calls

### 7. play_track (side effect — needs confirmation)

```typescript
useWebMCP({
  name: 'play_track',
  description: 'Play a music track from the dashboard audio player. Provide a release ID to start playback.',
  inputSchema: {
    releaseId: z.string().describe('Release ID (e.g., rel_001)'),
  },
  handler: async ({ releaseId }, client) => {
    const { usePlayerStore } = await import('@/store/player-store');
    await client.requestUserInteraction(async () => {
      usePlayerStore.getState().play(`/api/audio/${releaseId}`, releaseId);
    });
    return { success: true, playing: releaseId };
  },
});
```

**Maps to**: `usePlayerStore.play()` Zustand action

### 8. control_player (side effect)

```typescript
useWebMCP({
  name: 'control_player',
  description: 'Control the audio player. Actions: play, pause, next, previous, stop, toggle_shuffle, set_volume.',
  inputSchema: {
    action: z.enum(['play', 'pause', 'next', 'previous', 'stop', 'toggle_shuffle']).describe('Player action'),
    volume: z.number().min(0).max(1).optional().describe('Volume level 0-1 (only for set_volume)'),
  },
  handler: async ({ action, volume }) => {
    const { usePlayerStore } = await import('@/store/player-store');
    const store = usePlayerStore.getState();
    switch (action) {
      case 'play': store.togglePlayPause(); break;
      case 'pause': store.pause(); break;
      case 'next': store.next(); break;
      case 'previous': store.previous(); break;
      case 'stop': store.stop(); break;
      case 'toggle_shuffle': store.toggleShuffle(); break;
    }
    if (volume !== undefined) store.setVolume(volume);
    return { success: true, action, isPlaying: store.isPlaying };
  },
});
```

**Maps to**: `usePlayerStore` Zustand actions

### 9. get_player_state (read-only)

```typescript
useWebMCP({
  name: 'get_player_state',
  description: 'Get current state of the audio player. Returns current track, playback status, volume, position, duration, playlist, repeat mode, and shuffle state.',
  inputSchema: {},
  handler: async () => {
    const { usePlayerStore } = await import('@/store/player-store');
    const s = usePlayerStore.getState();
    return {
      currentTrack: s.currentTrack,
      currentTrackTitle: s.currentTrackTitle,
      isPlaying: s.isPlaying,
      currentTime: s.currentTime,
      duration: s.duration,
      volume: s.volume,
      playbackRate: s.playbackRate,
      repeatMode: s.repeatMode,
      shuffle: s.shuffle,
      playlistLength: s.playlist.length,
    };
  },
  annotations: { readOnlyHint: true },
});
```

**Maps to**: `usePlayerStore.getState()` snapshot

## Tool Summary

| Tool | Type | Annotations | Maps To |
|------|------|------------|---------|
| `get_releases` | Read | readOnly | GET /api/releases |
| `get_release_by_id` | Read | readOnly | getCachedReleaseById() |
| `get_sales` | Read | readOnly | GET /api/sales?range= |
| `get_engagement` | Read | readOnly | GET /api/engagement |
| `get_top_fans` | Read | readOnly | getCachedTopFans() |
| `get_revenue_summary` | Read | readOnly | GET /api/sales (x3) |
| `play_track` | Write | requestUserInteraction | playerStore.play() |
| `control_player` | Write | — | playerStore actions |
| `get_player_state` | Read | readOnly | playerStore.getState() |

**Total: 9 tools** (6 read-only, 3 with side effects) — well within the 50-tool recommendation.

## Context Providers (Optional)

Use `useWebMCPContext` for reactive state the agent can read:

```typescript
// Expose current dashboard locale
useWebMCPContext('dashboard_locale', 'Current UI language', () => locale);

// Expose current time range selection
useWebMCPContext('selected_time_range', 'Currently selected sales time range', () => selectedRange);
```
