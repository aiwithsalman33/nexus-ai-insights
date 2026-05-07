import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PackageOpen, RefreshCw, Plus } from "lucide-react";
import { fetchProducts, fetchProduct, type Product } from "@/api/products";
import { ProductCard } from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/LoadingSkeleton";
import { ProductDialog } from "@/components/ProductDialog";
import { toast } from "sonner";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products — Nexus Product AI" },
      {
        name: "description",
        content: "Browse all products with live AI-generated descriptions and SEO.",
      },
    ],
  }),
  component: ProductListPage,
});

function ProductListPage() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async (silent = false) => {
    try {
      const data = await fetchProducts();
      // newest first if dates exist
      data.sort((a, b) => {
        const da = new Date(a.created_at || a.createdAt || 0).getTime();
        const db = new Date(b.created_at || b.createdAt || 0).getTime();
        return db - da;
      });
      setProducts(data);
      setError(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load products";
      if (!silent) toast.error(msg);
      setError(msg);
    }
  };

  useEffect(() => {
    load();
    const id = setInterval(() => load(true), 12000);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Products
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Live view — refreshes every 12 seconds.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => load()}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-medium text-foreground transition hover:border-primary/40"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
        </div>
      </div>

      {products === null ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState error={error} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </main>
  );
}

function EmptyState({ error }: { error: string | null }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 px-6 py-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <PackageOpen className="h-8 w-8" />
      </div>
      <h2 className="text-xl font-semibold">
        {error ? "Couldn't load products" : "No products yet"}
      </h2>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
        {error ?? "Once you add a product, it will show up here with AI-generated content."}
      </p>
      <Link
        to="/"
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:bg-primary/90"
      >
        <Plus className="h-4 w-4" />
        Add your first product
      </Link>
    </div>
  );
}
