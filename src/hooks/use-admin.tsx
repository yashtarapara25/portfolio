import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export function useAdmin() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        setUser(user);

        if (user) {
          const { data, error } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", user.id)
            .single();

          if (error && error.code !== "PGRST116") {
            throw error;
          }

          setIsAdmin(data?.role === "admin");
        }
      } catch (err) {
        console.error("Error checking admin status:", err);
        setError(
          err instanceof Error ? err.message : "Unknown error occurred"
        );
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === "SIGNED_OUT") {
        setUser(null);
        setIsAdmin(false);
      } else if (event === "SIGNED_IN") {
        checkAdmin();
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return { user, isAdmin, loading, error };
}
