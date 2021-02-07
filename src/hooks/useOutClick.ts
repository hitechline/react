import { useRef, useEffect, useCallback, RefObject } from 'react';

import { hasNodeInDOM } from '@/utilities/hasNodeInDOM';
import { logger } from '@/utilities/internal/logger';
import { isElement } from '@/utilities/isElement';

import type { ListenerType } from '@/shared/types';

export interface UseOutClickManager<T> {
  ref: RefObject<T>;
  addListener(listener: ListenerType): void;
  removeListener(listener: ListenerType): void;
}

export function useOutClick<T extends HTMLElement>(): UseOutClickManager<T> {
  const ref = useRef<T>(null);
  const listeners = useRef<ListenerType[]>([]);

  const addListener = useCallback((listener: ListenerType): void => {
    listeners.current.push(listener);
  }, []);

  const removeListener = useCallback((listener: ListenerType): void => {
    const listenersFiltered = listeners.current.filter(
      currentListener => currentListener !== listener,
    );

    listeners.current.splice(0);
    listeners.current.push(...listenersFiltered);
  }, []);

  const handleClick = useCallback(
    (event: MouseEvent): void => {
      const content = ref.current;
      const targetNode = event.target as Node;

      if (!isElement(content)) {
        logger.error('The referenced element is not valid.');
        return;
      }

      if (!hasNodeInDOM(targetNode) || content.contains(targetNode)) {
        return;
      }

      listeners.current.forEach(listener => {
        listener();
      });
    },
    [ref, listeners],
  );

  useEffect(() => {
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, [handleClick]);

  return {
    ref,
    addListener,
    removeListener,
  };
}
