'use client';

import { Button } from '@/components/ui/button';
import { useLogout } from '@/lib/query/auth';
import { useRouter } from 'next/navigation';

export function AdminNavBar() {
  const { mutate: logout, isPending } = useLogout();
  const router = useRouter();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        router.push('/login');
      },
    });
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b border-hairline bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-3xl justify-center items-center gap-12 px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          onClick={handleLogout}
          disabled={isPending}
          className="text-sm font-light tracking-tight text-foreground/70 transition-all duration-200 hover:text-foreground hover:bg-transparent h-auto"
        >
          Logout
        </Button>
      </nav>
    </header>
  );
}
