import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Puzzle, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { APP_NAME, APP_SUBTITLE } from '@/lib/constants';

export const LoginForm: React.FC = () => {
  const { login, isLoggingIn, loginError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    await login({ email, password });
  };

  return (
    <Card className="w-full max-w-md p-8 shadow-md border border-border">
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-12 h-12 rounded-xl bg-surface-inverse text-on-inverse flex items-center justify-center shadow-md mb-3">
          <Puzzle className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-text">
          {APP_NAME}
        </h1>
        <p className="text-xs text-text-muted mt-1 uppercase tracking-wider font-medium">
          {APP_SUBTITLE}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email address"
          type="email"
          required
          autoComplete="email"
          placeholder="developer@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {loginError && (
          <div
            role="alert"
            className="p-3 rounded-control bg-danger-bg border border-danger/20 text-xs text-danger font-medium leading-relaxed"
          >
            {loginError.message}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-2"
          isLoading={isLoggingIn}
        >
          Sign in
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>

        <div className="text-center pt-2">
          <p className="text-xs text-text-muted">
            Don&apos;t have an account?{' '}
            <NavLink
              to="/signup"
              className="font-semibold text-text hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text rounded"
            >
              Sign up
            </NavLink>
          </p>
        </div>
      </form>
    </Card>
  );
};
