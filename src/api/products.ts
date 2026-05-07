export const API_URL =
  "https://script.google.com/macros/s/AKfycbyvMo7Qg8lZcAwb-i62ANx1jxdiB_MOreffTTps72gDTdehwMuseRCfeDWiF5bZ51km/exec";

export type ProductStatus =
  | "processing"
  | "pending"
  | "approved"
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
  seo_keywords?: string[] | string;
  created_at?: string;
  createdAt?: string;
}

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(API_URL, { method: "GET" });
  if (!res.ok) throw new Error("Failed to load products");
  const data = await res.json();
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.products)) return data.products;
  return [];
}

export async function fetchProduct(id: string): Promise<Product> {
  const res = await fetch(`${API_URL}?action=getProduct&id=${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error("Failed to load product");
  const data = await res.json();
  return data?.product ?? data;
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
