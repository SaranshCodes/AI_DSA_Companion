import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Puzzle, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { APP_NAME, APP_SUBTITLE } from '@/lib/constants';

export const SignupForm: React.FC = () => {
  const { signup, isSigningUp, signupError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!email || !password) {
      setValidationError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match.');
      return;
    }

    await signup({ email, password });
  };

  return (
    <Card className="w-full max-w-md p-8 shadow-md border border-border">
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-12 h-12 rounded-xl bg-surface-inverse text-on-inverse flex items-center justify-center shadow-md mb-3">
          <Puzzle className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-text">
          Create an Account
        </h1>
        <p className="text-xs text-text-muted mt-1 uppercase tracking-wider font-medium">
          {APP_NAME} · {APP_SUBTITLE}
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
          autoComplete="new-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Input
          label="Confirm Password"
          type="password"
          required
          autoComplete="new-password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {(validationError || signupError) && (
          <div
            role="alert"
            className="p-3 rounded-control bg-danger-bg border border-danger/20 text-xs text-danger font-medium leading-relaxed"
          >
            {validationError || signupError?.message}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-2"
          isLoading={isSigningUp}
        >
          Sign up
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>

        <div className="text-center pt-2">
          <p className="text-xs text-text-muted">
            Already have an account?{' '}
            <NavLink
              to="/login"
              className="font-semibold text-text hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text rounded"
            >
              Sign in
            </NavLink>
          </p>
        </div>
      </form>
    </Card>
  );
};
