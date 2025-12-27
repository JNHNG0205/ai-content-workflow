import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useGenerateContent() {
  return useMutation({
    mutationFn: async (prompt: string) => {
      const res = await api.generateContent(prompt);
      if (res.error) throw new Error(res.error);
      return res.data?.content || '';
    },
  });
}

