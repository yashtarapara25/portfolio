// Portfolio data hooks — simple one-time fetches with a timeout + static fallback.
// Realtime WebSocket subscriptions have been intentionally removed from public hooks:
//  • They caused persistent "Connecting…" / "Reconnecting…" badges visible to all visitors.
//  • They're not needed for a portfolio — visitors don't need live updates.
//  • Supabase free tier pauses after inactivity; WebSocket connections fail silently.
// The admin panel still uses realtime (AdminMessages); public pages just fetch once.

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

// ── Static fallback data ─────────────────────────────────────────────────────
// Shown immediately if Supabase doesn't respond within FETCH_TIMEOUT_MS.
import {
  projects  as staticProjects,
  skills    as staticSkills,
  education as staticEducation,
} from "@/lib/data";

type Project     = Tables<"projects">;
type Skill       = Tables<"skills">;
type Education   = Tables<"education">;
type Achievement = Tables<"achievements">;

/** How long (ms) to wait before falling back to static data. */
const FETCH_TIMEOUT_MS = 5_000;

/**
 * Wraps a promise with a timeout. Rejects with Error("timeout") if the
 * promise doesn't resolve within `ms` milliseconds.
 */
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), ms);
    promise.then(
      (v) => { clearTimeout(timer); resolve(v); },
      (e) => { clearTimeout(timer); reject(e); }
    );
  });
}

// ── Public hooks (no Realtime — just a single fetch with timeout) ────────────

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const { data, error: err } = await withTimeout(
          supabase.from("projects").select("*").order("sort_order", { ascending: true }),
          FETCH_TIMEOUT_MS
        );
        if (cancelled) return;
        if (err) throw err;
        setProjects(data || []);
      } catch {
        if (cancelled) return;
        // Supabase unreachable — map static data to the DB shape
        setProjects(
          staticProjects.map((p, i) => ({
            id: p.id,
            title: p.title,
            slug: p.slug,
            short_desc: p.shortDesc,
            tech: p.tech as string[],
            image_url: p.image,
            demo_url: p.demoUrl ?? null,
            repo_url: p.repoUrl ?? null,
            featured: p.featured ?? false,
            sort_order: i,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            content_mdx: null,
            images: null,
          })) as Project[]
        );
        setError(null); // don't show an error — fallback data is valid
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => { cancelled = true; };
  }, []);

  return { projects, loading, error };
}

export function useSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const { data, error: err } = await withTimeout(
          supabase
            .from("skills")
            .select("*")
            .order("category", { ascending: true })
            .order("sort_order", { ascending: true }),
          FETCH_TIMEOUT_MS
        );
        if (cancelled) return;
        if (err) throw err;
        setSkills(data || []);
      } catch {
        if (cancelled) return;
        setSkills(
          staticSkills.map((s, i) => ({
            id: String(i + 1),
            name: s.name,
            level: s.level,
            category: s.category,
            sort_order: i,
            created_at: new Date().toISOString(),
          })) as Skill[]
        );
        setError(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => { cancelled = true; };
  }, []);

  return { skills, loading, error };
}

export function useEducation() {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const { data, error: err } = await withTimeout(
          supabase.from("education").select("*").order("sort_order", { ascending: true }),
          FETCH_TIMEOUT_MS
        );
        if (cancelled) return;
        if (err) throw err;
        setEducation(data || []);
      } catch {
        if (cancelled) return;
        setEducation(
          staticEducation.map((e, i) => ({
            id: String(i + 1),
            institution: e.institution,
            degree: e.degree,
            summary: e.summary,
            year: e.year,
            sort_order: i,
            created_at: new Date().toISOString(),
          })) as Education[]
        );
        setError(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => { cancelled = true; };
  }, []);

  return { education, loading, error };
}

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const { data, error: err } = await withTimeout(
          supabase.from("achievements").select("*").order("sort_order", { ascending: true }),
          FETCH_TIMEOUT_MS
        );
        if (cancelled) return;
        if (err) throw err;
        setAchievements(data || []);
      } catch {
        if (cancelled) return;
        // No static fallback for achievements — render empty list gracefully
        setAchievements([]);
        setError(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => { cancelled = true; };
  }, []);

  return { achievements, loading, error };
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const { data, error: err } = await withTimeout(
          supabase.from("site_settings").select("key, value"),
          FETCH_TIMEOUT_MS
        );
        if (cancelled) return;
        if (err) throw err;

        const settingsMap: Record<string, string> = {};
        data?.forEach(({ key, value }) => {
          settingsMap[key] = value || "";
        });
        setSettings(settingsMap);
      } catch {
        if (cancelled) return;
        // Fallback: return empty settings — components already fall back to static values
        setSettings({});
        setError(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => { cancelled = true; };
  }, []);

  return { settings, loading, error };
}

/** Fetches the real counts of projects, skills, education, and achievements entries from Supabase */
export function usePortfolioCounts() {
  const [counts, setCounts] = useState({ projects: 0, skills: 0, education: 0, achievements: 0 });
  const [loading, setLoading] = useState(true);

  const fetchCounts = useCallback(async () => {
    try {
      const [
        { count: projectCount },
        { count: skillCount },
        { count: educationCount },
        { count: achievementCount },
      ] = await withTimeout(
        Promise.all([
          supabase.from("projects").select("*", { count: "exact", head: true }),
          supabase.from("skills").select("*", { count: "exact", head: true }),
          supabase.from("education").select("*", { count: "exact", head: true }),
          supabase.from("achievements").select("*", { count: "exact", head: true }),
        ]),
        FETCH_TIMEOUT_MS
      );

      setCounts({
        projects:     projectCount     ?? 0,
        skills:       skillCount       ?? 0,
        education:    educationCount   ?? 0,
        achievements: achievementCount ?? 0,
      });
    } catch {
      // Fallback to static data lengths
      setCounts({
        projects:     staticProjects.length,
        skills:       staticSkills.length,
        education:    staticEducation.length,
        achievements: 0,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  return { counts, loading };
}
