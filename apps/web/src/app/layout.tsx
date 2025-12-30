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
        <div className="flex-1 flex flex-col items-center w-full">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
