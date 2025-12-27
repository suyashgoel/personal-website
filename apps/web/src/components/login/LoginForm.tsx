'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLogin } from '@/lib/query/auth';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useState } from 'react';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const { mutate: login, isPending } = useLogin();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    login(
      { email, password },
      {
        onSuccess: () => {
          router.push('/admin');
        },
        onError: error => {
          console.error('[ERROR] Login failed', {
            error,
            component: 'LoginForm',
            timestamp: new Date().toISOString(),
          });
          setErrorMessage('Invalid email or password');
        },
      }
    );
  };

  return (
    <>
      <header className="mb-10">
        <h1 className="mb-2 text-5xl font-light tracking-tight text-primary md:text-6xl">
          Sign in
        </h1>
        <p className="text-base text-muted-foreground sm:text-lg">
          Access the admin panel
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            className="h-12 px-4 text-base font-light border-border transition-colors placeholder:text-muted-foreground/50 w-full"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={isPending}
            autoFocus
            required
          />

          <Input
            type="password"
            placeholder="Password"
            className="h-12 px-4 text-base font-light border-border transition-colors placeholder:text-muted-foreground/50 w-full"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={isPending}
            required
          />
        </div>

        <Button
          type="submit"
          variant="outline"
          disabled={isPending}
          className="w-full py-2.5 text-sm font-light tracking-tight text-primary border-border rounded-lg transition-all hover:bg-accent"
        >
          {isPending ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>

      {errorMessage && (
        <p className="m-2 text-sm text-destructive">{errorMessage}</p>
      )}
    </>
  );
}
