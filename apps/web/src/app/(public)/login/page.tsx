'use client';

import { LoginForm } from '@/components/login/LoginForm';
import { LoginLoader } from '@/components/login/LoginLoader';
import { useCurrentUser } from '@/lib/query/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const router = useRouter();

  const { data: user, isLoading } = useCurrentUser();

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/admin');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <LoginLoader />;
  }

  if (user) {
    return null;
  }

  return (
    <div className="w-full mx-auto max-w-3xl px-4 pt-6 pb-12 sm:px-6 sm:pt-8 sm:pb-16 md:pt-12 md:pb-24 lg:px-8 flex-1 flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
