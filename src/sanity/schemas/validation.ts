/**
 * `options.list` ne contraint que le menu déroulant du Studio, jamais
 * l'API : une écriture par jeton (script d'import, migration) peut poser
 * n'importe quelle chaîne dans un champ. Or `sanity.types.ts` dérive de
 * cette même `options.list` une union fermée — le type généré mentirait
 * alors au consommateur. Ce validateur referme l'écart.
 *
 * Il reçoit la liste elle-même, jamais une copie de ses valeurs : dupliquer
 * l'énumération à la main reproduirait exactement le défaut que la
 * validation prétend fermer.
 *
 * Le brief de correction proposait `Rule.valid([...])`, qui existe bien à
 * l'exécution mais n'est pas exposé par les constructeurs de règles typés
 * de `@sanity/types` 6.12 : `StringRule` (celui que `defineField` passe à
 * `validation`) déclare `min`, `max`, `regex`, `email`… et pas `valid`,
 * réservé à l'interface `Rule` héritée. L'employer aurait exigé une
 * assertion de type pour atteindre une API que le typage n'expose pas.
 * `custom` est publique, typée, et son message nomme les valeurs attendues.
 */
export function isOneOf(options: ReadonlyArray<{value: string}>) {
  const values = options.map((option) => option.value);

  return (value: unknown): true | string => {
    // `required()` signale déjà l'absence : la dupliquer ici afficherait
    // deux erreurs pour un seul champ vide.
    if (value === undefined || value === null) return true;

    return values.includes(value as string)
      ? true
      : `Valeur inconnue : « ${String(value)} ». Attendu : ${values.join(', ')}.`;
  };
}
