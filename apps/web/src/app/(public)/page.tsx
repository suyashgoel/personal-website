import { AboutPage } from '@/components/about/AboutPage';
import { aboutApi } from '@/lib/api';

export default async function HomePage() {
  try {
    const about = await aboutApi.get();
    return <AboutPage content={about} />;
  } catch (error) {
    console.error('[ERROR] Failed to fetch about page content', {
      error,
      component: 'HomePage',
      timestamp: new Date().toISOString(),
    });
    throw error;
  }
}
