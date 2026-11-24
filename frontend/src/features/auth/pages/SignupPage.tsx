import React from 'react';
import { SignupForm } from '../components/SignupForm';

export const SignupPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg-subtle flex flex-col justify-center items-center px-4 py-12">
      <SignupForm />
    </div>
  );
};
