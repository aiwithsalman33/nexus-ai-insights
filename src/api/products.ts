export const API_URL =
  "https://script.google.com/macros/s/AKfycbyvMo7Qg8lZcAwb-i62ANx1jxdiB_MOreffTTps72gDTdehwMuseRCfeDWiF5bZ51km/exec";

export type ProductStatus =
  | "processing"
  | "pending"
  | "approved"
  | "published"
  | "rejected"
  | "failed";

export interface Product {
  id: string;
  name: string;
  features: string;
  price: number;
  category: string;
  status: ProductStatus;
  ai_description?: string;
  final_description?: string;
  approved_description?: string;
  description?: string;
  seo_keywords?: string[] | string;
  created_at?: string;
  createdAt?: string;
  [key: string]: unknown;
}

/** Pulls the best available AI/final description from any known column name. */
export function getDescription(p: Product): string {
  const directCandidates = [
    p.ai_description,
    p.final_description,
    p.approved_description,
    p.description,
    (p as Record<string, unknown>)["Final Description"],
    (p as Record<string, unknown>)["AI Description"],
  ];
  for (const c of directCandidates) {
    if (typeof c === "string" && c.trim()) return c.trim();
  }

  for (const [key, value] of Object.entries(p)) {
    const normalizedKey = key.toLowerCase().replace(/[^a-z]/g, "");
    const isDescriptionField =
      normalizedKey.includes("description") &&
      (normalizedKey.includes("final") || normalizedKey.includes("approved") || normalizedKey.includes("ai"));
    if (isDescriptionField && typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function normalizeProduct(product: Product): Product {
  const description = getDescription(product);
  const status = product.status?.toLowerCase?.() as ProductStatus | undefined;
  return {
    ...product,
    status: description && (status === "processing" || status === "pending") ? "published" : status ?? "failed",
  };
}

function withCacheBuster(url: string): string {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}_=${Date.now()}`;
}

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(withCacheBuster(API_URL), { method: "GET", cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load products");
  const data = await res.json();
  if (Array.isArray(data)) return data.map(normalizeProduct);
  if (Array.isArray(data?.products)) return data.products.map(normalizeProduct);
  return [];
}

export async function fetchProduct(id: string): Promise<Product> {
  const res = await fetch(
    withCacheBuster(`${API_URL}?action=getProduct&id=${encodeURIComponent(id)}`),
    { cache: "no-store" },
  );
  if (!res.ok) throw new Error("Failed to load product");
  const data = await res.json();
  return normalizeProduct(data?.product ?? data);
}

export async function addProduct(payload: {
  name: string;
  features: string;
  price: number;
  category: string;
}): Promise<void> {
  // Apps Script often requires no-cors for POST; we send text/plain to avoid preflight
  await fetch(API_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  });
}

export function normalizeKeywords(k: Product["seo_keywords"]): string[] {
  if (!k) return [];
  if (Array.isArray(k)) return k;
  return String(k)
    .split(/[,;\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function formatDate(iso?: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
