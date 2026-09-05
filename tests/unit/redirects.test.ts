import {describe, expect, it} from 'vitest';
import {LEGACY_REDIRECTS} from '@/lib/redirects';

describe('redirections des anciennes URLs', () => {
  const expected: Array<[string, string]> = [
    ['/about', '/fr/parcours'],
    ['/projects', '/fr/travaux'],
    ['/blog', '/fr/ecrits'],
    ['/blog/:slug', '/fr/ecrits/:slug'],
    ['/resume', '/fr/parcours'],
    ['/contact', '/fr/contact'],
  ];

  it.each(expected)('redirige %s vers %s de façon permanente', (source, destination) => {
    const rule = LEGACY_REDIRECTS.find((r) => r.source === source);
    expect(rule, `règle manquante pour ${source}`).toBeDefined();
    expect(rule!.destination).toBe(destination);
    expect(rule!.permanent).toBe(true);
  });

  it('couvre les six anciennes URLs, sans doublon', () => {
    expect(LEGACY_REDIRECTS).toHaveLength(6);
    expect(new Set(LEGACY_REDIRECTS.map((r) => r.source)).size).toBe(6);
  });

  it('ne redirige pas /admin — il doit renvoyer 410', () => {
    expect(LEGACY_REDIRECTS.find((r) => r.source === '/admin')).toBeUndefined();
  });
});
