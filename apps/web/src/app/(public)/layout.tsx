import { PublicNavBar } from '@/components/layout/PublicNavBar';
import '../globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PublicNavBar />
      {children}
    </>
  );
}
