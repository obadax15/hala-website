'use client';

import { useState, useEffect } from 'react';

export function useScrollSpy(
  ids: string[],
  options: IntersectionObserverInit = { rootMargin: '-20% 0px -70% 0px' }
) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    }, options);

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [ids, options]);

  return activeId;
}
