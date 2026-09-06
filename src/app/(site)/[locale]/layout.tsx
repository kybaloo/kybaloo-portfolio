import type {Metadata} from 'next';
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {VisualEditing} from 'next-sanity/visual-editing';
import {draftMode} from 'next/headers';
import {notFound} from 'next/navigation';
import {SiteFooter} from '@/components/layout/site-footer';
import {SiteHeader} from '@/components/layout/site-header';
import {SkipLink} from '@/components/layout/skip-link';
import {ThemeProvider} from '@/components/theme-provider';
import {getPathname} from '@/i18n/navigation';
import {routing} from '@/i18n/routing';
import {fontVariables} from '@/lib/fonts';
import {siteUrl} from '@/lib/site';
import {SanityLive} from '@/sanity/lib/live';
import '@/styles/globals.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({locale, namespace: 'meta'});

  return {
    metadataBase: new URL(siteUrl),
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: getPathname({href: '/', locale}),
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, getPathname({href: '/', locale: l})]),
      ),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // Indispensable pour que les pages restent rendues statiquement.
  setRequestLocale(locale);

  const {isEnabled: isDraft} = await draftMode();

  return (
    <html lang={locale} className={fontVariables} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col bg-paper text-ink">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider>
            <SkipLink />
            <SiteHeader />
            <main id="main" className="flex-1">
              {children}
            </main>
            <SiteFooter />
          </NextIntlClientProvider>
        </ThemeProvider>
        {isDraft && (
          <>
            {/*
              `SanityLive` ouvre sa connexion au montage, quelle que soit la
              valeur de `includeDrafts` : ce prop ne filtre que le contenu
              des événements reçus, pas l'établissement de la connexion elle-
              même (voir node_modules/next-sanity/dist/SanityLive.js). Le
              monter inconditionnellement enverrait donc une requête vers
              l'API Sanity et chargerait son bundle client pour chaque
              visiteur anonyme, alors que le site est statique et revalidé
              par webhook — la mise à jour en direct ne sert qu'à la
              prévisualisation.
            */}
            <SanityLive includeDrafts />
            <VisualEditing />
          </>
        )}
      </body>
    </html>
  );
}
