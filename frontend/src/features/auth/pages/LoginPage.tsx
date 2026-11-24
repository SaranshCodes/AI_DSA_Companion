import React from 'react';
import { LoginForm } from '../components/LoginForm';

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg-subtle flex flex-col justify-center items-center px-4 py-12">
      <LoginForm />
    </div>
  );
};
