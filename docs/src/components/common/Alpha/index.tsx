import { mergeClassNames } from '@hitechline/react';

import { useUI } from '@resources/hooks/useUI';

import styles from './styles.module.css';

export const Alpha = () => {
  const { sidebarOpened } = useUI();

  return (
    <div
      className={mergeClassNames(styles.container, {
        active: sidebarOpened,
      })}
    />
  );
};