import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError, apiUrl } from '@/lib/api-client';
import { authService } from '@/services/auth.service';

export function useAuth() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authService.me,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const isUnauthenticated = query.error instanceof ApiError && query.error.status === 401;

  const signIn = () => {
    window.location.assign(`${apiUrl}/auth/google`);
  };

  const signOut = async () => {
    await authService.signout();
    await queryClient.resetQueries({ queryKey: ['auth', 'me'] });
  };

  return {
    user: query.data,
    isLoading: query.isLoading,
    isUnauthenticated,
    isError: query.isError && !isUnauthenticated,
    signIn,
    signOut,
  };
}
