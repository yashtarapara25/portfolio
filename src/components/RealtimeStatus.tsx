/**
 * RealtimeStatus — floating "● LIVE" badge (DEV ONLY)
 * This component is intentionally hidden in production.
 * It was causing "Connecting…" / "Reconnecting…" to appear for all visitors
 * because the Supabase WebSocket was being used just to power this badge,
 * and any connection delay (e.g. Supabase free-tier cold start) showed the
 * grey "Reconnecting…" state to visitors for the entire session.
 *
 * To re-enable in development: pass devOnly={false} explicitly.
 */
export default function RealtimeStatus() {
  // Always hidden — remove this component from the rendered tree.
  // The Realtime WebSocket connection it relied on has been removed from
  // public-facing hooks. The admin panel (AdminMessages) still uses Realtime.
  return null;
}
