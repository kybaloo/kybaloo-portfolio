import {setRequestLocale} from 'next-intl/server';
import {Hero} from '@/components/home/hero';
import {ImpactStrip} from '@/components/home/impact-strip';
import {SelectedWorks} from '@/components/home/selected-works';
import {ServicesSection} from '@/components/home/services-section';
import {StackLayers} from '@/components/home/stack-layers';
import {PhilosophyReading} from '@/components/home/philosophy-reading';
import {ContactCta} from '@/components/home/contact-cta';

export default async function HomePage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);

  return (
    <div className="flex flex-col">
      <Hero />
      <ImpactStrip />
      <SelectedWorks />
      <ServicesSection />
      <StackLayers />
      <PhilosophyReading />
      <ContactCta />
    </div>
  );
}
