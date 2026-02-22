// New hook: usePortfolioCounts – fetches real counts from Supabase
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase";

type Project = Tables<"projects">;
type Skill = Tables<"skills">;
type Education = Tables<"education">;

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("sort_order", { ascending: true });

        if (error) throw error;
        setProjects(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return { projects, loading, error };
}

export function useSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const { data, error } = await supabase
          .from("skills")
          .select("*")
          .order("category", { ascending: true })
          .order("sort_order", { ascending: true });

        if (error) throw error;
        setSkills(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching skills");
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  return { skills, loading, error };
}

export function useEducation() {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const { data, error } = await supabase
          .from("education")
          .select("*")
          .order("sort_order", { ascending: true });

        if (error) throw error;
        setEducation(data || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error fetching education"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, []);

  return { education, loading, error };
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("key, value");

        if (error) throw error;

        const settingsMap: Record<string, string> = {};
        data?.forEach(({ key, value }) => {
          settingsMap[key] = value || "";
        });

        setSettings(settingsMap);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching settings");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading, error };
}

/** Fetches the real counts of projects, skills, and education entries from Supabase */
export function usePortfolioCounts() {
  const [counts, setCounts] = useState({ projects: 0, skills: 0, education: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [
          { count: projectCount },
          { count: skillCount },
          { count: educationCount },
        ] = await Promise.all([
          supabase.from("projects").select("*", { count: "exact", head: true }),
          supabase.from("skills").select("*", { count: "exact", head: true }),
          supabase.from("education").select("*", { count: "exact", head: true }),
        ]);

        setCounts({
          projects: projectCount ?? 0,
          skills: skillCount ?? 0,
          education: educationCount ?? 0,
        });
      } catch (err) {
        console.error("Error fetching portfolio counts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();

    // Real-time subscription to update counts automatically
    const channel = supabase
      .channel("portfolio-counts")
      .on("postgres_changes", { event: "*", schema: "public", table: "projects" }, fetchCounts)
      .on("postgres_changes", { event: "*", schema: "public", table: "skills" }, fetchCounts)
      .on("postgres_changes", { event: "*", schema: "public", table: "education" }, fetchCounts)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return { counts, loading };
}
