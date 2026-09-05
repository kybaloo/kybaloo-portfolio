/**
 * Racine HTML du Studio, distincte de celle du site.
 *
 * Le Studio n'est pas localisé et ne doit hériter ni du thème ni des polices
 * du site. Next autorise plusieurs racines via les groupes de routes, à
 * condition qu'aucun src/app/layout.tsx n'existe — c'est le cas ici.
 */
export default function StudioRootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="fr">
      <body style={{margin: 0}}>{children}</body>
    </html>
  );
}
