import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return () => {
    localStorage.removeItem('accessToken');
    queryClient.removeQueries({ queryKey: ['me'] });
    navigate('/login');
  };
}
