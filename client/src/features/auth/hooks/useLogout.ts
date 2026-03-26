import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => Promise.resolve(),
    onSuccess: () => {
      localStorage.removeItem('accessToken');
      queryClient.clear();
      navigate('/login', { replace: true });
    },
  });
};
