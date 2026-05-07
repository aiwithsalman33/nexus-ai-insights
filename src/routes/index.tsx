import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Sparkles, AlertCircle } from "lucide-react";
import { addProduct } from "@/api/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Add Product — Nexus Product AI" },
      {
        name: "description",
        content: "Add a new product and let AI generate descriptions and SEO content.",
      },
    ],
  }),
  component: AddProductPage,
});

const CATEGORIES = [
  "Electronics",
  "Clothing",
  "Home & Garden",
  "Sports",
  "Beauty",
  "Food",
  "Books",
  "Other",
];

type Errors = Partial<Record<"name" | "features" | "price" | "category", string>>;

function AddProductPage() {
  const [name, setName] = useState("");
  const [features, setFeatures] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e: Errors = {};
    if (!name.trim()) e.name = "Product name is required";
    if (!features.trim()) e.features = "Features are required";
    const priceNum = Number(price);
    if (price === "" || isNaN(priceNum)) e.price = "Price is required";
    else if (priceNum < 0) e.price = "Price must be 0 or greater";
    if (!category) e.category = "Please select a category";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await addProduct({
        name: name.trim(),
        features: features.trim(),
        price: Number(price),
        category,
      });
      toast.success("Product added! AI is generating content...");
      setName("");
      setFeatures("");
      setPrice("");
      setCategory("");
      setErrors({});
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls =
    "w-full rounded-lg border border-border bg-input/40 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition";
  const labelCls = "mb-1.5 block text-sm font-medium text-foreground";
  const errCls = "mt-1 flex items-center gap-1 text-xs text-destructive";

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 md:py-16">
      <div className="mb-8 text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          AI-powered product intake
        </div>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Add a new product
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Submit your product details — our AI generates the description and SEO
          keywords automatically.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-border bg-card p-6 shadow-xl shadow-primary/5 md:p-8"
      >
        <div className="space-y-5">
          <div>
            <label htmlFor="name" className={labelCls}>
              Product Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputCls}
              placeholder="e.g. Wireless Noise-Cancelling Headphones"
            />
            {errors.name && (
              <p className={errCls}>
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="features" className={labelCls}>
              Features
            </label>
            <textarea
              id="features"
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              rows={5}
              className={`${inputCls} resize-none`}
              placeholder="List key features..."
            />
            {errors.features && (
              <p className={errCls}>
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.features}
              </p>
            )}
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="price" className={labelCls}>
                Price (USD)
              </label>
              <input
                id="price"
                type="number"
                min={0}
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={inputCls}
                placeholder="99.99"
              />
              {errors.price && (
                <p className={errCls}>
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.price}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="category" className={labelCls}>
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={inputCls}
              >
                <option value="">Select category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className={errCls}>
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.category}
                </p>
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Adding product and triggering AI...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Add Product & Generate AI Content
            </>
          )}
        </button>
      </form>
    </main>
  );
}
