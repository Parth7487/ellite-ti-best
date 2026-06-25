import * as React from "react";

export interface StackedSectionsProps {
  children?: React.ReactNode;
  withDramaEffect?: boolean;
  stackOffset?: number;
  paneGap?: false | string;
  scrollRunway?: string;
  className?: string;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

function getScrollParent(node: HTMLElement | null): HTMLElement | null {
  let element = node?.parentElement ?? null;
  while (element && element !== document.body && element !== document.documentElement) {
    const overflowY = getComputedStyle(element).overflowY;
    if (overflowY === "auto" || overflowY === "scroll") {
      return element;
    }
    element = element.parentElement;
  }
  return null;
}

export default function StackedSections({
  children,
  withDramaEffect = true,
  stackOffset = 48,
  paneGap = "gap-4",
  scrollRunway = "0px",
  className,
}: StackedSectionsProps) {
  const deckRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const contentRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  const items = React.Children.toArray(children);
  const total = items.length;
  cardRefs.current.length = total;
  contentRefs.current.length = total;

  const scaleAtDepth = React.useCallback(
    (cardIndex: number) => {
      const reverseIndex = total - (cardIndex - 1);
      return 1.1 - 0.05 * reverseIndex; // slightly softer scaling to look more premium
    },
    [total],
  );

  React.useEffect(() => {
    if (!withDramaEffect || total === 0) {
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const deck = deckRef.current;
    if (!deck) {
      return;
    }

    const scroller = getScrollParent(deck);
    let frame = 0;

    const isNextCardPinned = (cardIndex: number, containerTop: number) => {
      const nextCard = cardRefs.current[cardIndex + 1];
      if (!nextCard) {
        return false;
      }
      return (
        nextCard.getBoundingClientRect().top - containerTop <= (cardIndex + 1) * stackOffset + 1
      );
    };

    const update = () => {
      frame = 0;
      const containerTop = scroller ? scroller.getBoundingClientRect().top : 0;

      for (let i = 0; i < total; i++) {
        const card = cardRefs.current[i];
        const content = contentRefs.current[i];
        if (!card || !content) {
          continue;
        }

        const endScale = scaleAtDepth(i + 1);
        const covered = isNextCardPinned(i, containerTop);

        if (covered) {
          content.setAttribute("data-stacked-covered", "");
          content.style.transform = `scale(${endScale})`;
          continue;
        }

        content.removeAttribute("data-stacked-covered");

        const nextCard = cardRefs.current[i + 1];
        if (!nextCard) {
          content.style.transform = "";
          continue;
        }

        const pinnedTop = (i + 1) * stackOffset;
        const offset = nextCard.getBoundingClientRect().top - containerTop - pinnedTop;
        const rowH = card.offsetHeight > 0 ? card.offsetHeight : 1;
        const distance = Math.max(rowH - pinnedTop, 1);
        const progress = clamp(1 - offset / distance, 0, 1);
        const scale = 1 + (endScale - 1) * progress;
        content.style.transform = progress <= 0.001 ? "" : `scale(${scale})`;
      }
    };

    const onScroll = () => {
      if (!frame) {
        frame = requestAnimationFrame(update);
      }
    };

    update();
    const target: Window | HTMLElement = scroller ?? window;
    target.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      target.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) {
        cancelAnimationFrame(frame);
      }
      for (const content of contentRefs.current) {
        if (content) {
          content.removeAttribute("data-stacked-covered");
          content.style.transform = "";
        }
      }
    };
  }, [total, stackOffset, withDramaEffect, scaleAtDepth]);

  if (total === 0) {
    return null;
  }

  const gapClass = paneGap === false ? undefined : paneGap;

  return (
    <div
      ref={deckRef}
      className={`flex w-full flex-col ${gapClass ?? ""} ${className ?? ""}`}
      style={
        {
          "--numcards": total,
          "--stacked-top-offset": `${stackOffset}px`,
          paddingBottom: `calc(${total} * ${stackOffset}px)`,
        } as React.CSSProperties
      }
    >
      {items.map((child, index) => {
        const key =
          React.isValidElement(child) && child.key != null ? child.key : `pane-${index}`;
        const cardIndex = index + 1;

        return (
          <div
            key={key}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            className="sticky top-0 w-full"
            style={
              {
                "--index": cardIndex,
                zIndex: cardIndex,
                paddingTop: `calc(${cardIndex} * var(--stacked-top-offset))`,
              } as React.CSSProperties
            }
          >
            <div
              ref={(el) => {
                contentRefs.current[index] = el;
              }}
              data-stacked-content=""
              className="min-h-0 origin-[50%_0%]"
            >
              {child}
            </div>
          </div>
        );
      })}
      {scrollRunway !== "0px" && (
        <div
          aria-hidden
          className="w-full shrink-0"
          style={{ height: scrollRunway }}
        />
      )}
    </div>
  );
}
