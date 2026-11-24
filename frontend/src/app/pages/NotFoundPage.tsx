import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <span className="text-6xl font-black text-text tracking-tighter tabular-nums">
        404
      </span>
      <h2 className="mt-3 text-xl font-bold text-text">Page Not Found</h2>
      <p className="mt-1 text-sm text-text-muted max-w-sm">
        The page you are looking for does not exist or has been moved.
      </p>
      <Button
        variant="primary"
        size="md"
        onClick={() => navigate('/')}
        className="mt-6 gap-2"
      >
        <Home className="w-4 h-4" />
        Return to Dashboard
      </Button>
    </div>
  );
};
