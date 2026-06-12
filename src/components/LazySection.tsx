import { useEffect, useRef, useState, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  /**
   * rootMargin: how far before the section enters the viewport to start loading.
   * "300px" means the section starts rendering 300px before it's visible → zero pop-in.
   */
  rootMargin?: string;
  /** Minimum height placeholder to maintain scroll space before content loads */
  minHeight?: string;
  id?: string;
}

/**
 * LazySection — renders a lightweight placeholder until the section is near the viewport.
 *
 * Why this helps:
 * - React renders the full tree on mount, even for off-screen sections.
 * - Below-fold sections with Framer whileInView + Supabase data hooks all activate
 *   their IntersectionObservers and subscriptions eagerly.
 * - This wrapper defers that work until the section actually approaches the viewport.
 * - Once revealed, the section stays rendered (no thrashing).
 */
export default function LazySection({
  children,
  rootMargin = "300px",
  minHeight = "400px",
  id,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // IntersectionObserver: fire once, then disconnect — minimal overhead
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} id={id}>
      {visible ? (
        children
      ) : (
        // Placeholder: preserves scroll height so layout doesn't shift when content loads
        <div style={{ minHeight }} aria-hidden="true" />
      )}
    </div>
  );
}
