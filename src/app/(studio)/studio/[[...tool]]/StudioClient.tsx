'use client';

/**
 * Isole le rendu du Studio dans un Composant Client.
 *
 * `sanity.config.ts` retourne un objet truffé de fonctions (structure,
 * resolvers, plugins). Si `page.tsx` (Composant Serveur) l'importait
 * lui-même pour le passer en prop à `<NextStudio>`, React RSC refuserait de
 * sérialiser ces fonctions à travers la frontière serveur/client — l'appel
 * échoue avec « Functions cannot be passed directly to Client Components ».
 * En important `config` ici, dans un module déjà côté client, aucune
 * frontière n'est traversée.
 *
 * `NextStudio` est en plus chargé avec `ssr: false` : ses composants
 * internes (`@sanity/ui`) sont pré-compilés par le React Compiler et
 * appellent `useMemoCache`, un hook interne qui suppose un dispatcher React
 * client. Rendu côté serveur (même dans un Composant Client, Next.js
 * pré-rend son HTML initial côté serveur), le dispatcher actif n'est pas le
 * bon et l'appel échoue par `null.useMemoCache`. Désactiver le SSR pour ce
 * composant précis évite qu'il s'exécute ailleurs que dans le navigateur.
 */
import dynamic from 'next/dynamic';
import config from '../../../../../sanity.config';

const NextStudio = dynamic(() => import('next-sanity/studio').then((mod) => mod.NextStudio), {
  ssr: false,
});

export function StudioClient() {
  return <NextStudio config={config} />;
}
