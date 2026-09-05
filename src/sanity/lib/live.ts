// `defineLive` est exposé sous `next-sanity/live` (pas la racine du paquet)
// dans next-sanity 13.3.4 : l'export racine ne le réexporte plus.
import {defineLive} from 'next-sanity/live';
import {client} from './client';
import {readToken} from '../env';

const token = readToken();

export const {sanityFetch, SanityLive} = defineLive({
  client,
  serverToken: token,
  browserToken: token,
  // `strict` fait échouer une requête mal formée au lieu de renvoyer null.
  strict: true,
});
