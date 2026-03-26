import { useCurrentUser } from '../features/auth/hooks/useCurrentUser';
import { useLogin } from '../features/auth/hooks/useLogin';
import { useLogout } from '../features/auth/hooks/useLogout';

export const useAuth = () => {
  const { data: user, isLoading, isError, isFetching } = useCurrentUser();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  const token = localStorage.getItem('accessToken');
  const isAuthenticated = !!token && !!user;

  return {
    user,
    token,
    isLoading: isLoading,
    isRefreshing: isFetching,
    isAuthenticated,
    isError,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
  };
};
