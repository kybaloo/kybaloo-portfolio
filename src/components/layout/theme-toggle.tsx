'use client';

import {useTranslations} from 'next-intl';
import {useTheme} from 'next-themes';
import {useSyncExternalStore} from 'react';

const emptySubscribe = () => () => {};

// Équivalent du couple useEffect+useState('mounted') du brief original, sans
// déclencher la règle react-hooks/set-state-in-effect : useSyncExternalStore
// est le mécanisme documenté pour distinguer l'instantané serveur (false) de
// l'instantané client (true) sans provoquer d'avertissement d'hydratation.
function useHasMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export function ThemeToggle() {
  const t = useTranslations('theme');
  const {resolvedTheme, setTheme} = useTheme();
  const mounted = useHasMounted();

  // Avant montage, le thème résolu est inconnu côté serveur : on réserve la
  // place pour éviter tout décalage de mise en page.
  if (!mounted) return <span className="block size-8" aria-hidden />;

  const next = resolvedTheme === 'dark' ? 'light' : 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={t('toggle')}
      className="rounded-sm border border-line px-2 py-1 font-mono text-xs tracking-widest uppercase hover:border-accent"
    >
      {resolvedTheme === 'dark' ? t('light') : t('dark')}
    </button>
  );
}
