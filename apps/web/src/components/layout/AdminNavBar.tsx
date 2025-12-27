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
    <header className="fixed top-0 z-50 w-full border-b border-border bg-background">
      <nav className="mx-auto flex h-14 max-w-3xl justify-center items-center gap-8 px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          onClick={handleLogout}
          disabled={isPending}
          className="text-lg font-light tracking-tight text-primary transition-colors hover:text-accent hover:bg-transparent h-auto"
        >
          {isPending ? 'Logging out...' : 'Logout'}
        </Button>
      </nav>
    </header>
  );
}
