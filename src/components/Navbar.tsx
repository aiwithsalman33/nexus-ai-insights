import { Link } from "@tanstack/react-router";
import { Sparkles, Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const linkCls =
    "px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground transition-colors";
  const activeCls = "text-foreground bg-accent";

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            Nexus Product AI
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          <Link to="/" className={linkCls} activeProps={{ className: `${linkCls} ${activeCls}` }} activeOptions={{ exact: true }}>
            Add Product
          </Link>
          <Link to="/products" className={linkCls} activeProps={{ className: `${linkCls} ${activeCls}` }}>
            View Products
          </Link>
          <div className="ml-3 flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            Live Updates On
          </div>
        </div>

        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-border md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
            <Link to="/" className={linkCls} onClick={() => setOpen(false)}>
              Add Product
            </Link>
            <Link to="/products" className={linkCls} onClick={() => setOpen(false)}>
              View Products
            </Link>
            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              Live Updates On
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
