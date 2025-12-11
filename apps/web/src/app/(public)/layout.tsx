import { NavBar } from '@/components/layout/NavBar';
import { Providers } from '@/components/providers';
import '../globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="pt-14">
        <NavBar />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
