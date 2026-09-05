import {createNavigation} from 'next-intl/navigation';
import {routing} from './routing';

// Tout composant qui navigue importe Link d'ici, jamais de next/link :
// c'est ce qui applique les slugs localisés.
export const {Link, redirect, usePathname, useRouter, getPathname} = createNavigation(routing);
