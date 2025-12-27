import { AboutPage } from '@/components/about/AboutPage';
import { aboutApi } from '@/lib/api';

export default async function HomePage() {
  const about = await aboutApi.get();
  return <AboutPage content={about} />;
}
