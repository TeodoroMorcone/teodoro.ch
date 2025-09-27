"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type ActiveSectionContextValue = {
  activeId: string | null;
  sectionIds: string[];
};

const ActiveSectionContext = createContext<ActiveSectionContextValue | null>(null);

type ActiveSectionProviderProps = {
  sectionIds: string[];
  children: ReactNode;
  /**
   * Positive values shift the detection window downward to accommodate fixed headers.
   */
  topOffset?: number;
};

export function ActiveSectionProvider({
  sectionIds,
  children,
  topOffset = 96,
}: ActiveSectionProviderProps) {
  const [activeId, setActiveId] = useState<string | null>(sectionIds[0] ?? null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const uniqueSectionIds = useMemo(
    () => Array.from(new Set(sectionIds)).filter(Boolean),
    [sectionIds],
  );

  useEffect(() => {
    if (uniqueSectionIds.length === 0) {
      return;
    }

    const handleIntersect: IntersectionObserverCallback = (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visible[0]?.target.id) {
        setActiveId(visible[0].target.id);
      }
    };

    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin: `-${topOffset}px 0px -55% 0px`,
      threshold: [0.1, 0.25, 0.5, 0.75],
    });

    observerRef.current = observer;

    uniqueSectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, [topOffset, uniqueSectionIds]);

  const value = useMemo<ActiveSectionContextValue>(
    () => ({
      activeId,
      sectionIds: uniqueSectionIds,
    }),
    [activeId, uniqueSectionIds],
  );

  return <ActiveSectionContext.Provider value={value}>{children}</ActiveSectionContext.Provider>;
}

export function useActiveSection() {
  const context = useContext(ActiveSectionContext);

  if (!context) {
    throw new Error("useActiveSection must be used within an ActiveSectionProvider");
  }

  return context;
}