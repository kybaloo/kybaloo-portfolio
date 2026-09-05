import {StudioClient} from './StudioClient';

export {viewport} from 'next-sanity/studio';

export const dynamic = 'force-static';

export const metadata = {
  title: 'Studio — Portfolio',
  robots: {index: false, follow: false},
};

export default function StudioPage() {
  return <StudioClient />;
}
