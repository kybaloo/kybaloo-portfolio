import {useTranslations} from 'next-intl';

export function ImpactStrip() {
  const t = useTranslations('home');

  const stats = [
    {value: t('statsExperience'), label: t('statsExperienceLabel')},
    {value: t('statsVolume'), label: t('statsVolumeLabel')},
    {value: t('statsProjects'), label: t('statsProjectsLabel')},
    {value: t('statsDelivery'), label: t('statsDeliveryLabel')},
  ];

  return (
    <section className="border-b border-line bg-paper/50">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="grid grid-cols-2 gap-6 divide-y divide-line md:grid-cols-4 md:gap-8 md:divide-x md:divide-y-0">
          {stats.map((stat, i) => (
            <div key={i} className={i !== 0 ? 'pt-4 md:pt-0 md:pl-6' : ''}>
              <div className="font-mono text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                {stat.value}
              </div>
              <div className="mt-1 font-sans text-xs leading-snug text-muted sm:text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
