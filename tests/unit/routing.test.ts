import {describe, expect, it} from 'vitest';
import {routing} from '@/i18n/routing';
import fr from '../../messages/fr.json';
import en from '../../messages/en.json';

describe('routage i18n', () => {
  it('sert le français par défaut et toujours avec préfixe', () => {
    expect(routing.locales).toEqual(['fr', 'en']);
    expect(routing.defaultLocale).toBe('fr');
    // `localePrefix` accepts either the short string form or the verbose
    // `{mode: ...}` object; normalise before comparing so the test doesn't
    // depend on which shape `defineRouting` happens to preserve.
    const localePrefix = routing.localePrefix;
    const prefix =
      localePrefix == null
        ? undefined
        : typeof localePrefix === 'string'
          ? localePrefix
          : localePrefix.mode;
    expect(prefix).toBe('always');
  });

  it('localise les slugs des pages de contenu', () => {
    const p = routing.pathnames as Record<string, unknown>;
    expect(p['/work']).toEqual({fr: '/travaux', en: '/work'});
    expect(p['/work/[slug]']).toEqual({fr: '/travaux/[slug]', en: '/work/[slug]'});
    expect(p['/about']).toEqual({fr: '/parcours', en: '/about'});
    expect(p['/writing']).toEqual({fr: '/ecrits', en: '/writing'});
    expect(p['/writing/[slug]']).toEqual({fr: '/ecrits/[slug]', en: '/writing/[slug]'});
  });

  it('partage le même slug quand il fonctionne dans les deux langues', () => {
    const p = routing.pathnames as Record<string, unknown>;
    expect(p['/']).toBe('/');
    expect(p['/expertise']).toBe('/expertise');
    expect(p['/contact']).toBe('/contact');
  });
});

describe('messages', () => {
  /** Aplatit un objet imbriqué en paires [chemin pointé, valeur]. */
  function entries(value: unknown, prefix = ''): Array<[string, string]> {
    if (typeof value !== 'object' || value === null) return [[prefix, String(value)]];
    return Object.entries(value).flatMap(([k, v]) => entries(v, prefix ? `${prefix}.${k}` : k));
  }

  it('expose exactement les mêmes clés en français et en anglais', () => {
    const keys = (o: unknown) =>
      entries(o)
        .map(([k]) => k)
        .sort();
    expect(keys(fr)).toEqual(keys(en));
  });

  it('ne laisse aucune valeur vide dans les deux langues', () => {
    for (const messages of [fr, en]) {
      expect(entries(messages).filter(([, v]) => v.trim() === '')).toEqual([]);
    }
  });
});
