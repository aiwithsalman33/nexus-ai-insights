import { ArrowRight } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { AiPlaceholder } from "./LoadingSkeleton";
import { formatDate, getDescription, normalizeKeywords, type Product } from "@/api/products";

export function ProductCard({
  product,
  onClick,
}: {
  product: Product;
  onClick: (p: Product) => void;
}) {
  const keywords = normalizeKeywords(product.seo_keywords);
  const created = product.created_at || product.createdAt;
  const description = getDescription(product);
  const isWorking =
    !description && (product.status === "processing" || product.status === "pending");

  return (
    <button
      type="button"
      onClick={() => onClick(product)}
      className="group block w-full rounded-xl border border-border bg-card p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold leading-tight text-foreground">
            {product.name}
          </h3>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground">
              {product.category}
            </span>
            <span className="text-sm font-medium text-primary">
              ${Number(product.price).toFixed(2)}
            </span>
            <span className="text-xs text-muted-foreground">
              · {formatDate(created)}
            </span>
          </div>
        </div>
        <StatusBadge status={product.status} />
      </div>

      {product.status === "approved" && product.ai_description ? (
        <div className="mt-4 space-y-3">
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {product.ai_description}
          </p>
          {keywords.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {keywords.slice(0, 5).map((k) => (
                <span
                  key={k}
                  className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary"
                >
                  {k}
                </span>
              ))}
            </div>
          )}
        </div>
      ) : isWorking ? (
        <AiPlaceholder />
      ) : (
        <p className="mt-4 line-clamp-2 text-sm text-muted-foreground">
          {product.features}
        </p>
      )}

      <div className="mt-4 flex items-center text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
        View details <ArrowRight className="ml-1 h-4 w-4" />
      </div>
    </button>
  );
}
