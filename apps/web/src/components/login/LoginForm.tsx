'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLogin } from '@/lib/query/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import type React from 'react';
import { useEffect, useState } from 'react';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const isUnauthorized = searchParams.get('unauthorized') === 'true';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(
    isUnauthorized ? 'Log in to access the admin panel' : null
  );

  const { mutate: login, isPending } = useLogin();

  useEffect(() => {
    if (isUnauthorized) {
      router.replace('/login', { scroll: false });
    }
  }, [isUnauthorized, router]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setInfoMessage(null);
    setErrorMessage(null);

    login(
      { email, password },
      {
        onSuccess: user => {
          if (!user) {
            setErrorMessage('Invalid email or password');
            return;
          }
          router.push('/admin');
        },
        onError: error => {
          console.error('[ERROR] Login failed', {
            error,
            component: 'LoginForm',
            timestamp: new Date().toISOString(),
          });
        },
      }
    );
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (e.target.value.trim()) {
      setInfoMessage(null);
      setErrorMessage(null);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (e.target.value.trim()) {
      setInfoMessage(null);
      setErrorMessage(null);
    }
  };

  return (
    <>
      <header className="mb-16">
        <h1 className="mb-4 text-6xl font-light tracking-tight text-foreground leading-tight md:text-7xl">
          Sign in
        </h1>
        <p className="text-lg font-light text-foreground/60">
          Access the admin panel
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-5">
          <Input
            type="email"
            placeholder="Email"
            className="h-14 px-4 text-lg font-light border-hairline transition-all duration-200 placeholder:text-foreground/40 w-full focus:border-foreground/30"
            value={email}
            onChange={handleEmailChange}
            disabled={isPending}
            autoFocus
            required
          />

          <Input
            type="password"
            placeholder="Password"
            className="h-14 px-4 text-lg font-light border-hairline transition-all duration-200 placeholder:text-foreground/40 w-full focus:border-foreground/30"
            value={password}
            onChange={handlePasswordChange}
            disabled={isPending}
            required
          />
        </div>

        <Button
          type="submit"
          variant="outline"
          disabled={isPending}
          className="w-full h-12 text-sm font-light tracking-tight text-foreground border-hairline rounded-md transition-all duration-200 hover:bg-accent hover:border-foreground/30"
        >
          {isPending ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>

      {infoMessage && (
        <p className="mt-6 text-sm font-light text-destructive">
          {infoMessage}
        </p>
      )}

      {errorMessage && (
        <p className="mt-6 text-sm font-light text-destructive">
          {errorMessage}
        </p>
      )}
    </>
  );
}
