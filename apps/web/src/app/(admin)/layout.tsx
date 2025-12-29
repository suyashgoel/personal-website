'use client';

import { AddButton } from '@/components/admin/AddButton';
import { AdminNavBar } from '@/components/layout/AdminNavBar';
import { useCurrentUser } from '@/lib/query/auth';
import { isDialogOpenAtom } from '@/lib/state';
import { useAtomValue } from 'jotai';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: user, isLoading } = useCurrentUser();
  const router = useRouter();
  const isDialogOpen = useAtomValue(isDialogOpenAtom);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      {isDialogOpen && (
        <div className="fixed inset-0 z-[50] bg-black/40 backdrop-blur-md" />
      )}

      {!isDialogOpen && <AdminNavBar />}
      <AddButton />
      {children}
    </>
  );
}
