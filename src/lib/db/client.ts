/**
 * Cloudflare D1 HTTP API client via Drizzle ORM
 *
 * Supports VPS / Node.js deployment using Cloudflare D1 HTTP REST API.
 */

import { drizzle } from "drizzle-orm/sqlite-proxy";
import { AsyncLocalStorage } from "node:async_hooks";
import * as schema from "./schema";

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID;
const apiToken = process.env.CLOUDFLARE_API_TOKEN;

const D1_API_URL = accountId && databaseId
  ? `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`
  : null;

export const dbContext = new AsyncLocalStorage<{ noStore?: boolean }>();

export function withNoStore<T>(fn: () => Promise<T>): Promise<T> {
  return dbContext.run({ noStore: true }, fn);
}

/**
 * Execute a SQL query against Cloudflare D1 via HTTP API.
 */
async function d1Fetch(
  sql: string,
  params: unknown[],
  method: "run" | "all" | "values"
): Promise<{ rows: unknown[][] }> {
  if (!D1_API_URL || !apiToken) {
    throw new Error("Cloudflare D1 credentials missing (CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_D1_DATABASE_ID, CLOUDFLARE_API_TOKEN)");
  }

  const isMutation = /^(insert|update|delete)\b/i.test(sql.trim());
  const context = dbContext.getStore();
  const useNoStore = isMutation || !!context?.noStore;

  const res = await fetch(D1_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sql, params }),
    ...(useNoStore
      ? { cache: "no-store" }
      : { next: { revalidate: 3600, tags: ["d1-db"] } }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`D1 HTTP API error: ${res.status} – ${err}`);
  }

  const json = (await res.json()) as {
    success: boolean;
    errors: { message: string }[];
    result: { results: Record<string, unknown>[]; success: boolean }[];
  };

  if (!json.success || json.errors?.length > 0) {
    throw new Error(
      `D1 query error: ${json.errors?.map((e) => e.message).join(", ")}`
    );
  }

  const result = json.result?.[0];
  if (!result) return { rows: [] };

  if (method === "run") return { rows: [] };

  const rows = result.results ?? [];
  if (rows.length === 0) return { rows: [] };

  const keys = Object.keys(rows[0]);
  return {
    rows: rows.map((row) => keys.map((k) => row[k])),
  };
}

export const db = drizzle(
  async (sql, params, method) => {
    return d1Fetch(sql, params, method as "run" | "all" | "values");
  },
  { schema }
);

export type DB = typeof db;
