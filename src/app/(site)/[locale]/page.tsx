import {setRequestLocale} from 'next-intl/server';

export default async function HomePage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto max-w-5xl px-6 py-24">
      <h1 className="font-serif text-4xl leading-tight tracking-tight">
        Je conçois, construis et fais évoluer des{' '}
        <em className="text-accent italic">systèmes numériques.</em>
      </h1>
      <p className="mt-6 max-w-prose text-muted">
        Fondations en place. Le contenu arrive au plan 2.
      </p>
    </div>
  );
}
