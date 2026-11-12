import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {ContactForm} from '@/modules/contact/contact-form';
import {SITE} from '@/lib/site';

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'contact'});

  return {
    title: `${t('title')} — Florentin Tchangai`,
    description: t('subtitle'),
  };
}

export default async function ContactPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);

  const t = await getTranslations({locale, namespace: 'contact'});
  const email = 'tchangaiflorentin6@gmail.com';

  return (
    <div className="py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <div className="mb-12 max-w-2xl">
          <div className="mb-2 font-mono text-xs tracking-widest text-accent uppercase">
            {t('tag')}
          </div>
          <h1 className="font-serif text-3xl leading-tight text-ink sm:text-4xl lg:text-5xl">
            {t('title')}
          </h1>
          <p className="mt-3 font-sans text-base leading-relaxed text-muted sm:text-lg">
            {t('subtitle')}
          </p>
        </div>

        {/* 2-Column Content */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

          {/* Direct channels card */}
          <div className="space-y-6 lg:col-span-5">
            <div className="space-y-5 rounded-sm border border-line bg-paper/60 p-6 sm:p-7">
              <div className="flex items-center justify-between border-b border-line/60 pb-3">
                <h3 className="font-serif text-lg text-ink">{t('directCardTitle')}</h3>
                <span className="font-mono text-xs text-accent">● ACTIVE</span>
              </div>

              <div>
                <span className="block font-mono text-xs text-muted uppercase">
                  {t('directEmailLabel')}
                </span>
                <a
                  href={`mailto:${email}`}
                  className="mt-1 block font-mono text-sm text-ink underline decoration-line underline-offset-4 hover:text-accent"
                >
                  {email}
                </a>
              </div>

              <div>
                <span className="block font-mono text-xs text-muted uppercase">
                  {t('directLocationLabel')} & {t('directTimezoneLabel')}
                </span>
                <span className="mt-1 block font-mono text-xs text-ink">
                  {t('directLocationValue')} — {t('directTimezoneValue')}
                </span>
              </div>

              <div>
                <span className="block font-mono text-xs text-muted uppercase">
                  {t('directStatusLabel')}
                </span>
                <span className="mt-1 inline-flex items-center gap-1.5 font-mono text-xs text-emerald-600 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {t('directStatusValue')}
                </span>
              </div>

              <div className="border-t border-line/60 pt-2">
                <span className="mb-2 block font-mono text-xs text-muted uppercase">
                  Réseaux & Code
                </span>
                <div className="flex items-center gap-4 font-mono text-xs text-ink">
                  <a
                    href={SITE.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-line underline-offset-2 hover:text-accent"
                  >
                    GitHub ↗
                  </a>
                  <a
                    href={SITE.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-line underline-offset-2 hover:text-accent"
                  >
                    LinkedIn ↗
                  </a>
                </div>
              </div>
            </div>

            {/* Synchronous call banner */}
            <div className="rounded-sm border border-line/80 bg-paper p-6">
              <h4 className="font-serif text-base text-ink">{t('directMeetingTitle')}</h4>
              <p className="mt-1 font-sans text-xs leading-relaxed text-muted">
                {t('directMeetingDesc')}
              </p>
              <a
                href="https://calendly.com"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center justify-center rounded-sm border border-line px-4 py-2 font-mono text-xs text-ink transition-colors hover:border-accent hover:text-accent"
              >
                {t('directMeetingBtn')} ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
