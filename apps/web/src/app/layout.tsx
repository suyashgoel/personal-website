import { Providers } from '@/components/providers';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="pt-16 min-h-screen flex flex-col">
        <Providers>
          <main className="flex-1 flex flex-col w-full">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
