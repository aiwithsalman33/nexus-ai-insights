import { Sparkles, Calendar, Tag, DollarSign } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StatusBadge } from "./StatusBadge";
import { AiPlaceholder } from "./LoadingSkeleton";
import { formatDate, getDescription, normalizeKeywords, type Product } from "@/api/products";

export function ProductDialog({
  product,
  open,
  onOpenChange,
}: {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!product) return null;
  const keywords = normalizeKeywords(product.seo_keywords);
  const created = product.created_at || product.createdAt;
  const isWorking = product.status === "processing" || product.status === "pending";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <div className="flex flex-wrap items-start justify-between gap-3 pr-6">
            <DialogTitle className="text-2xl">{product.name}</DialogTitle>
            <StatusBadge status={product.status} />
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
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
        </DialogHeader>

        <section className="mt-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Features
          </h3>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground/90">
            {product.features}
          </p>
        </section>

        <section className="mt-5">
          <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Final Approved AI Description
          </h3>
          {product.status === "approved" && product.ai_description ? (
            <p className="mt-2 whitespace-pre-line text-base leading-relaxed text-foreground/90">
              {product.ai_description}
            </p>
          ) : isWorking ? (
            <AiPlaceholder />
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">
              No approved AI content yet.
            </p>
          )}
        </section>

        {keywords.length > 0 && (
          <section className="mt-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              SEO Keywords
            </h3>
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
      </DialogContent>
    </Dialog>
  );
}
