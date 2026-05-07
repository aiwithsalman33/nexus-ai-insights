import { CheckCircle2, Clock, Loader2, XCircle, AlertTriangle, Rocket } from "lucide-react";
import type { ProductStatus } from "@/api/products";

const map: Record<
  ProductStatus,
  { label: string; cls: string; Icon: React.ComponentType<{ className?: string }>; spin?: boolean }
> = {
  processing: {
    label: "Processing",
    cls: "bg-warning/15 text-warning border-warning/30",
    Icon: Loader2,
    spin: true,
  },
  pending: {
    label: "Pending",
    cls: "bg-info/15 text-info border-info/30",
    Icon: Clock,
  },
  approved: {
    label: "Approved",
    cls: "bg-success/15 text-success border-success/30",
    Icon: CheckCircle2,
  },
  published: {
    label: "Published",
    cls: "bg-success/15 text-success border-success/30",
    Icon: Rocket,
  },
  rejected: {
    label: "Rejected",
    cls: "bg-destructive/15 text-destructive border-destructive/30",
    Icon: XCircle,
  },
  failed: {
    label: "Failed",
    cls: "bg-muted text-muted-foreground border-border",
    Icon: AlertTriangle,
  },
};

export function StatusBadge({ status }: { status: ProductStatus }) {
  const cfg = map[status] ?? map.failed;
  const Icon = cfg.Icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${cfg.cls}`}
    >
      <Icon className={`h-3.5 w-3.5 ${cfg.spin ? "animate-spin" : ""}`} />
      {cfg.label}
    </span>
  );
}
