import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Sparkles, Calendar, Tag, DollarSign } from "lucide-react";
import {
  fetchProduct,
  formatDate,
  getDescription,
  normalizeKeywords,
  type Product,
} from "@/api/products";
import { StatusBadge } from "@/components/StatusBadge";
import { AiPlaceholder } from "@/components/LoadingSkeleton";

export const Route = createFileRoute("/products/$id")({
  head: () => ({
    meta: [
      { title: "Product — Nexus Product AI" },
      { name: "description", content: "Product details and AI-generated content." },
    ],
  }),
  component: ProductDetailPage,
  errorComponent: ({ error, reset }) => {
    const router = useRouter();
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">Couldn't load product</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="mt-5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          Try again
        </button>
      </main>
    );
  },
  notFoundComponent: () => (
    <main className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold">Product not found</h1>
      <Link to="/products" className="mt-5 inline-block text-primary underline">
        Back to products
      </Link>
    </main>
  ),
});

function ProductDetailPage() {
  const { id } = Route.useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const p = await fetchProduct(id);
        if (alive) setProduct(p);
      } catch (err) {
        if (alive) setError(err instanceof Error ? err.message : "Failed to load");
      }
    };
    load();
    const t = setInterval(load, 12000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [id]);

  if (error) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">Couldn't load product</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error}</p>
        <Link to="/products" className="mt-5 inline-block text-primary underline">
          Back to products
        </Link>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="h-8 w-40 animate-pulse rounded bg-muted" />
        <div className="mt-8 h-72 animate-pulse rounded-2xl bg-card" />
      </main>
    );
  }

  const keywords = normalizeKeywords(product.seo_keywords);
  const created = product.created_at || product.createdAt;
  const isWorking = product.status === "processing" || product.status === "pending";

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      <Link
        to="/products"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>

      <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-xl shadow-primary/5 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Tag className="h-4 w-4 text-primary" />
                {product.category}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <DollarSign className="h-4 w-4 text-primary" />
                {Number(product.price).toFixed(2)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-primary" />
                {formatDate(created)}
              </span>
            </div>
          </div>
          <StatusBadge status={product.status} />
        </div>

        <section className="mt-8">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Features
          </h2>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground/90">
            {product.features}
          </p>
        </section>

        <section className="mt-8">
          <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            AI Description
          </h2>
          {product.status === "approved" && product.ai_description ? (
            <p className="mt-2 whitespace-pre-line text-base leading-relaxed text-foreground/90">
              {product.ai_description}
            </p>
          ) : isWorking ? (
            <AiPlaceholder />
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">
              No AI content available for this product.
            </p>
          )}
        </section>

        {keywords.length > 0 && (
          <section className="mt-8">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              SEO Keywords
            </h2>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {keywords.map((k) => (
                <span
                  key={k}
                  className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                >
                  {k}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
