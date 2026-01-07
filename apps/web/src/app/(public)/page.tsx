import { AboutPage } from '@/components/about/AboutPage';
import { aboutApi } from '@/lib/api';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const about = await aboutApi.get();
  return <AboutPage content={about} />;
}
