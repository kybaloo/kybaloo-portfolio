import {useTranslations} from 'next-intl';

interface Principle {
  num: string;
  titleKey: 'p1Title' | 'p2Title' | 'p3Title';
  descKey: 'p1Desc' | 'p2Desc' | 'p3Desc';
}

interface Book {
  title: string;
  author: string;
  topic: string;
  year: string;
}

export function PhilosophyReading() {
  const t = useTranslations('home');

  const principles: Principle[] = [
    {num: '01', titleKey: 'p1Title', descKey: 'p1Desc'},
    {num: '02', titleKey: 'p2Title', descKey: 'p2Desc'},
    {num: '03', titleKey: 'p3Title', descKey: 'p3Desc'},
  ];

  const books: Book[] = [
    {
      title: 'Designing Data-Intensive Applications',
      author: 'Martin Kleppmann',
      topic: 'Systèmes distribués, stockage & consensus',
      year: '2017',
    },
    {
      title: 'Clean Architecture',
      author: 'Robert C. Martin',
      topic: 'Frontières logicielles, découplage & tests',
      year: '2017',
    },
    {
      title: 'Building Microservices',
      author: 'Sam Newman',
      topic: 'Décomposition modulaire & intégration d’APIs',
      year: '2021',
    },
    {
      title: 'The Pragmatic Programmer',
      author: 'David Thomas & Andrew Hunt',
      topic: 'Artisanat du code, automatisation & rigueur',
      year: '2019',
    },
  ];

  return (
    <section id="philosophie" className="border-b border-line py-20">
      <div className="mx-auto max-w-5xl px-6">
        {/* Section Header */}
        <div className="mb-12">
          <div className="mb-2 font-mono text-xs tracking-widest text-accent uppercase">
            {t('philosophyTag')}
          </div>
          <h2 className="font-serif text-3xl text-ink sm:text-4xl">{t('philosophyTitle')}</h2>
          <p className="mt-2 max-w-2xl text-base text-muted">{t('philosophySubtitle')}</p>
        </div>

        {/* 3 Engineering Principles */}
        <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {principles.map((p) => (
            <div
              key={p.num}
              className="flex flex-col justify-between rounded-sm border border-line bg-paper/50 p-6 transition-colors hover:border-ink/30"
            >
              <div>
                <span className="font-mono text-xs font-semibold text-accent">§ {p.num}</span>
                <h3 className="mt-3 mb-2 font-serif text-lg text-ink">{t(p.titleKey)}</h3>
                <p className="font-sans text-sm leading-relaxed text-muted">{t(p.descKey)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Reading List Header */}
        <div className="border-t border-line/60 pt-6">
          <div className="mb-6 flex items-center gap-3">
            <span className="font-mono text-xs tracking-wider text-muted uppercase">
              {t('readingTitle')}
            </span>
            <div className="h-px flex-1 bg-line/60" />
          </div>

          {/* Reading List Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {books.map((book) => (
              <div
                key={book.title}
                className="group flex items-start justify-between gap-4 rounded-sm border border-line/60 bg-paper/30 p-4 transition-all hover:border-line hover:bg-paper"
              >
                <div>
                  <h4 className="font-serif text-base text-ink transition-colors group-hover:text-accent">
                    {book.title}
                  </h4>
                  <p className="mt-0.5 font-sans text-xs text-muted">
                    {book.author} — <span className="font-mono text-muted/80">{book.topic}</span>
                  </p>
                </div>
                <span className="shrink-0 rounded-xs border border-line/50 px-1.5 py-0.5 font-mono text-[11px] text-muted/70">
                  {book.year}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
