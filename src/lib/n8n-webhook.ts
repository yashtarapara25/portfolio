/**
 * n8n Webhook Helper
 * ------------------
 * This module lets your Portfolio admin panel trigger n8n workflows.
 *
 * SETUP:
 *   1. In n8n, create a workflow with a "Webhook" trigger node
 *   2. Copy the webhook URL from n8n  (e.g. https://your-n8n.cloud/webhook/abc123)
 *   3. Add to your .env:
 *        VITE_N8N_WEBHOOK_URL=https://your-n8n.cloud/webhook/abc123
 *
 * USAGE (from admin panel buttons):
 *   import { triggerN8nWebhook } from "@/lib/n8n-webhook";
 *   await triggerN8nWebhook("sync-github-projects", { username: "yashtarapara25" });
 */

export type N8nEvent =
    | "sync-github-projects"   // Pull latest GitHub repos → update projects table
    | "sync-skills"            // Update skills from any data source
    | "send-notification"      // Send email / Slack / WhatsApp alert
    | "refresh-portfolio"      // General refresh trigger
    | string;                  // Custom event names

export interface N8nWebhookPayload {
    event: N8nEvent;
    data?: Record<string, unknown>;
    timestamp?: string;
    source?: string;
}

export interface N8nWebhookResult {
    success: boolean;
    status: number;
    body?: unknown;
    error?: string;
}

/**
 * Sends a POST to your n8n webhook URL with a typed payload.
 * Returns { success, status, body } — never throws.
 */
export async function triggerN8nWebhook(
    event: N8nEvent,
    data?: Record<string, unknown>
): Promise<N8nWebhookResult> {
    const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL as string | undefined;

    if (!webhookUrl) {
        console.warn(
            "[n8n] VITE_N8N_WEBHOOK_URL is not set. Add it to your .env file.\n" +
            "Example: VITE_N8N_WEBHOOK_URL=https://your-n8n.cloud/webhook/abc123"
        );
        return { success: false, status: 0, error: "VITE_N8N_WEBHOOK_URL not configured" };
    }

    const payload: N8nWebhookPayload = {
        event,
        data,
        timestamp: new Date().toISOString(),
        source: "portfolio-admin",
    };

    try {
        const response = await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const body = await response.json().catch(() => null);
        return { success: response.ok, status: response.status, body };
    } catch (err) {
        const error = err instanceof Error ? err.message : "Network error";
        console.error("[n8n] Webhook call failed:", error);
        return { success: false, status: 0, error };
    }
}
