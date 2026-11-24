import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authApi } from '@/api/endpoints/auth';
import { useAuthStore } from '../store/useAuthStore';
import { useToast } from '@/components/ui/useToast';
import { AppError } from '@/api/errors';

export function useAuth() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { token, email, setAuth, logout } = useAuthStore();
  const { showToast } = useToast();

  const meQuery = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authApi.getMe,
    enabled: Boolean(token),
    staleTime: Infinity,
  });

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login(email, password),
    onSuccess: async (data, variables) => {
      setAuth(data.access_token, variables.email);
      try {
        const me = await authApi.getMe();
        if (me.email) {
          setAuth(data.access_token, me.email);
        }
      } catch {
        // Fallback email from form
      }
      queryClient.invalidateQueries();
      showToast('Logged in successfully', 'success');
      const next = searchParams.get('next') || '/';
      navigate(next, { replace: true });
    },
    onError: (err: AppError) => {
      showToast(err.message || 'Login failed', 'error');
    },
  });

  const signupMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.signup(email, password),
    onSuccess: async (data, variables) => {
      if (data.access_token) {
        setAuth(data.access_token, variables.email);
        try {
          const me = await authApi.getMe();
          if (me.email) {
            setAuth(data.access_token, me.email);
          }
        } catch {
          // Fallback email
        }
        queryClient.invalidateQueries();
        showToast('Account created and logged in!', 'success');
        navigate('/', { replace: true });
      } else {
        showToast('Account created! Please check your email or log in.', 'success');
        navigate('/login', { replace: true });
      }
    },
    onError: (err: AppError) => {
      showToast(err.message || 'Registration failed', 'error');
    },
  });

  const handleLogout = () => {
    logout();
    queryClient.clear();
    navigate('/login', { replace: true });
  };

  return {
    isAuthenticated: Boolean(token),
    email: email || meQuery.data?.email || null,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error as AppError | null,
    signup: signupMutation.mutateAsync,
    isSigningUp: signupMutation.isPending,
    signupError: signupMutation.error as AppError | null,
    logout: handleLogout,
  };
}
