/**
 * Supabase Edge Function: n8n-update
 * -----------------------------------
 * This is the secure backend gateway that n8n calls to write data into your
 * Supabase database. It validates the Authorization header, then performs
 * the requested database operation.
 *
 * DEPLOY:
 *   npx supabase functions deploy n8n-update --project-ref qnbbjehbgadiroscfttj
 *
 * n8n SETUP (in your n8n workflow):
 *   Node: HTTP Request
 *   Method: POST
 *   URL: https://qnbbjehbgadiroscfttj.supabase.co/functions/v1/n8n-update
 *   Headers:
 *     Authorization: Bearer <your service_role key>
 *     Content-Type: application/json
 *   Body (JSON):
 *     {
 *       "table": "projects",
 *       "action": "upsert",
 *       "data": {
 *         "slug": "my-project",
 *         "title": "My New Project",
 *         "short_desc": "Built with n8n automation",
 *         "tech": ["n8n", "Supabase"],
 *         "featured": true
 *       }
 *     }
 *
 * SUPPORTED ACTIONS:
 *   "upsert" — insert or update a row (match on `slug` for projects, `id` for others)
 *   "delete" — delete by `id` field in data
 *   "update_settings" — update a site_settings key/value pair
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const ALLOWED_TABLES = ["projects", "skills", "education", "site_settings"] as const;
type AllowedTable = typeof ALLOWED_TABLES[number];

interface RequestBody {
    table: AllowedTable;
    action: "upsert" | "delete" | "update_settings";
    data: Record<string, unknown>;
}

Deno.serve(async (req: Request) => {
    // CORS preflight
    if (req.method === "OPTIONS") {
        return new Response(null, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Authorization, Content-Type",
            },
        });
    }

    // Only accept POST
    if (req.method !== "POST") {
        return json({ error: "Method not allowed" }, 405);
    }

    // Validate Authorization header — must be the service_role key
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || authHeader !== `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`) {
        return json({ error: "Unauthorized" }, 401);
    }

    let body: RequestBody;
    try {
        body = await req.json();
    } catch {
        return json({ error: "Invalid JSON body" }, 400);
    }

    const { table, action, data } = body;

    // Validate table name (security: only allow known tables)
    if (!ALLOWED_TABLES.includes(table)) {
        return json({ error: `Table '${table}' is not allowed. Allowed: ${ALLOWED_TABLES.join(", ")}` }, 400);
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    try {
        if (action === "upsert") {
            const conflictColumn = table === "projects" ? "slug" : table === "site_settings" ? "key" : "id";
            const { error } = await supabase
                .from(table)
                .upsert(data, { onConflict: conflictColumn });
            if (error) throw error;
            return json({ success: true, table, action, message: `Row upserted in ${table}` });
        }

        if (action === "delete") {
            if (!data.id) return json({ error: "data.id is required for delete" }, 400);
            const { error } = await supabase.from(table).delete().eq("id", data.id);
            if (error) throw error;
            return json({ success: true, table, action, message: `Row deleted from ${table}` });
        }

        if (action === "update_settings") {
            if (!data.key || data.value === undefined) {
                return json({ error: "data.key and data.value are required for update_settings" }, 400);
            }
            const { error } = await supabase
                .from("site_settings")
                .upsert({ key: data.key, value: data.value }, { onConflict: "key" });
            if (error) throw error;
            return json({ success: true, table: "site_settings", action, key: data.key });
        }

        return json({ error: `Unknown action '${action}'. Use: upsert, delete, update_settings` }, 400);
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error("[n8n-update] DB error:", message);
        return json({ error: message }, 500);
    }
});

function json(body: unknown, status = 200): Response {
    return new Response(JSON.stringify(body), {
        status,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
    });
}
