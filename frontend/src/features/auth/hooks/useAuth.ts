import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authApi } from '@/api/endpoints/auth';
import {
  useAuthStore,
  clearLeftoverSessionKeys,
  parseJwtUser,
} from '../store/useAuthStore';
import { useActiveSessionStore } from '@/features/session/store/useActiveSessionStore';
import { useToast } from '@/components/ui/useToast';
import { AppError } from '@/api/errors';

export function useAuth() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { token, user, email, setAuth, setUser, logout } = useAuthStore();
  const { showToast } = useToast();

  const meQuery = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authApi.getMe,
    enabled: Boolean(token),
    staleTime: Infinity,
  });

  // Synchronize verified user_id from /api/auth/me
  React.useEffect(() => {
    if (meQuery.data?.user_id) {
      const currentUser = useAuthStore.getState().user;
      if (currentUser?.id !== meQuery.data.user_id) {
        setUser({
          id: meQuery.data.user_id,
          email: meQuery.data.email,
        });
      }
    }
  }, [meQuery.data, setUser]);

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login(email, password),
    onSuccess: async (data, variables) => {
      // 1. In login(), clear leftover session keys from previous users
      clearLeftoverSessionKeys();
      useActiveSessionStore.getState().resetSession();

      // 2. Decode user from access token (if available) or create initial user object
      const jwtUser = parseJwtUser(data.access_token);
      const initialUser = jwtUser || { id: '', email: variables.email };

      // 3. Set the new token and user object
      setAuth(data.access_token, initialUser, variables.email);

      // 4. Fetch verified profile
      try {
        const me = await authApi.getMe();
        if (me.user_id) {
          const verifiedUser = { id: me.user_id, email: me.email };
          setAuth(data.access_token, verifiedUser, me.email);
          useActiveSessionStore.getState().loadForUser(me.user_id);
        } else if (jwtUser?.id) {
          useActiveSessionStore.getState().loadForUser(jwtUser.id);
        }
      } catch {
        if (jwtUser?.id) {
          useActiveSessionStore.getState().loadForUser(jwtUser.id);
        }
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
        // 1. In signup(), clear leftover session keys from previous users
        clearLeftoverSessionKeys();
        useActiveSessionStore.getState().resetSession();

        // 2. Decode user from access token
        const jwtUser = parseJwtUser(data.access_token);
        const initialUser = jwtUser || { id: '', email: variables.email };

        // 3. Set the new token and user object
        setAuth(data.access_token, initialUser, variables.email);

        // 4. Fetch verified profile
        try {
          const me = await authApi.getMe();
          if (me.user_id) {
            const verifiedUser = { id: me.user_id, email: me.email };
            setAuth(data.access_token, verifiedUser, me.email);
            useActiveSessionStore.getState().loadForUser(me.user_id);
          } else if (jwtUser?.id) {
            useActiveSessionStore.getState().loadForUser(jwtUser.id);
          }
        } catch {
          if (jwtUser?.id) {
            useActiveSessionStore.getState().loadForUser(jwtUser.id);
          }
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
    // In logout(), call localStorage.clear() and reset active session to null
    useActiveSessionStore.getState().resetSession();
    logout();
    queryClient.clear();
    navigate('/login', { replace: true });
  };

  return {
    isAuthenticated: Boolean(token),
    user,
    userId: user?.id || null,
    email: email || user?.email || meQuery.data?.email || null,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error as AppError | null,
    signup: signupMutation.mutateAsync,
    isSigningUp: signupMutation.isPending,
    signupError: signupMutation.error as AppError | null,
    logout: handleLogout,
  };
}
