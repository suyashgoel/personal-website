import { NavBar } from '@/components/layout/NavBar';
import { Providers } from '@/components/providers';
import '../globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="pt-14 h-full flex flex-col">
        <NavBar />
        <div className="flex-1 flex flex-col items-center">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
