import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

interface FeatheredScrollProps {
  children: React.ReactNode;
  className?: string;
  direction?: "horizontal" | "vertical";
}

const FeatheredScroll = forwardRef<HTMLDivElement, FeatheredScrollProps>(function FeatheredScroll(
  { children, className, direction = "horizontal" },
  ref,
) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const scrollStartLeftRef = useRef(0);
  const didDragRef = useRef(false);
  const DRAG_THRESHOLD_PX = 4;
  const [isDragging, setIsDragging] = useState(false);

  const [hasOverflow, setHasOverflow] = useState(false);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(true);

  useImperativeHandle(ref, () => scrollRef.current!, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const measure = () => {
      const isHorizontal = direction === "horizontal";
      const scrollSize = isHorizontal ? el.scrollWidth : el.scrollHeight;
      const clientSize = isHorizontal ? el.clientWidth : el.clientHeight;
      const maxScroll = Math.max(0, scrollSize - clientSize);
      const position = isHorizontal ? el.scrollLeft : el.scrollTop;

      const nextHasOverflow = scrollSize > clientSize;
      const nextIsAtStart = position <= 0;
      const nextIsAtEnd = position >= maxScroll - 1; // account for sub-pixel rounding

      // Only update state when values actually change
      setHasOverflow((prev) => (prev !== nextHasOverflow ? nextHasOverflow : prev));
      setIsAtStart((prev) => (prev !== nextIsAtStart ? nextIsAtStart : prev));
      setIsAtEnd((prev) => (prev !== nextIsAtEnd ? nextIsAtEnd : prev));
    };

    const onScroll = () => {
      if (rafIdRef.current != null) return;
      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;
        measure();
      });
    };

    // Initial measure
    measure();

    el.addEventListener("scroll", onScroll, { passive: true });

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => measure());
      ro.observe(el);
    }
    const onWindowResize = () => measure();
    window.addEventListener("resize", onWindowResize, { passive: true } as AddEventListenerOptions);

    return () => {
      el.removeEventListener("scroll", onScroll);
      if (ro) ro.disconnect();
      window.removeEventListener("resize", onWindowResize);
      if (rafIdRef.current != null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [direction]);

  const maskClasses = useMemo(() => {
    if (!hasOverflow) return "";

    if (direction === "horizontal") {
      if (!isAtStart && !isAtEnd) {
        return "[mask-image:linear-gradient(to_right,transparent_0,black_40px,black_calc(100%-40px),transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0,black_40px,black_calc(100%-40px),transparent_100%)]";
      }
      if (!isAtStart) {
        return "[mask-image:linear-gradient(to_right,transparent_0,black_40px)] [-webkit-mask-image:linear-gradient(to_right,transparent_0,black_40px)]";
      }
      if (!isAtEnd) {
        return "[mask-image:linear-gradient(to_left,transparent_0,black_40px)] [-webkit-mask-image:linear-gradient(to_left,transparent_0,black_40px)]";
      }
    } else {
      if (!isAtStart && !isAtEnd) {
        return "[mask-image:linear-gradient(to_bottom,transparent_0,black_40px,black_calc(100%-40px),transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0,black_40px,black_calc(100%-40px),transparent_100%)]";
      }
      if (!isAtStart) {
        return "[mask-image:linear-gradient(to_bottom,transparent_0,black_40px)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0,black_40px)]";
      }
      if (!isAtEnd) {
        return "[mask-image:linear-gradient(to_top,transparent_0,black_40px)] [-webkit-mask-image:linear-gradient(to_top,transparent_0,black_40px)]";
      }
    }

    return "";
  }, [direction, hasOverflow, isAtStart, isAtEnd]);

  // Pointer drag-to-scroll for horizontal direction
  useEffect(() => {
    if (direction !== "horizontal") return;
    const el = scrollRef.current;
    if (!el) return;

    const onPointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const container = scrollRef.current;
      if (!container) return;
      const deltaX = e.clientX - dragStartXRef.current;
      container.scrollLeft = scrollStartLeftRef.current - deltaX;
      if (!didDragRef.current && Math.abs(deltaX) > DRAG_THRESHOLD_PX) {
        didDragRef.current = true;
      }
      // Prevent selecting text/images while dragging
      e.preventDefault();
    };

    const endDrag = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("pointermove", onPointerMove, { passive: false });
      window.addEventListener("pointerup", endDrag, { passive: true } as AddEventListenerOptions);
      window.addEventListener("pointercancel", endDrag, {
        passive: true,
      } as AddEventListenerOptions);
    }

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
    };
  }, [direction, isDragging]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (direction !== "horizontal") return;
    const el = scrollRef.current;
    if (!el || !hasOverflow) return;
    // Only start drag for primary button on mouse, or any touch/pen
    if (e.pointerType === "mouse" && e.button !== 0) return;
    didDragRef.current = false;
    isDraggingRef.current = true;
    setIsDragging(true);
    dragStartXRef.current = e.clientX;
    scrollStartLeftRef.current = el.scrollLeft;
    try {
      (e.target as Element)?.setPointerCapture?.(e.pointerId);
    } catch {}
  };

  const handleClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (direction !== "horizontal") return;
    if (didDragRef.current) {
      e.preventDefault();
      e.stopPropagation();
      didDragRef.current = false;
    }
  };

  return (
    <div
      ref={scrollRef}
      className={twMerge(
        "flex gap-2",
        direction === "horizontal" && "overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
        direction === "horizontal" && hasOverflow && "cursor-grab",
        isDragging && "cursor-grabbing select-none",
        maskClasses,
        className,
      )}
      onPointerDown={handlePointerDown}
      onClickCapture={handleClickCapture}
    >
      {children}
    </div>
  );
});

export default FeatheredScroll;
