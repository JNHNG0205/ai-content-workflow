import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

// Query keys
export const reviewKeys = {
  all: ['review'] as const,
  pending: () => [...reviewKeys.all, 'pending'] as const,
  reviewed: () => [...reviewKeys.all, 'reviewed'] as const,
};

// Hooks for fetching reviews
export function usePendingReviews() {
  return useQuery({
    queryKey: reviewKeys.pending(),
    queryFn: async () => {
      const res = await api.getPendingReviews();
      if (res.error) throw new Error(res.error);
      return res.data || [];
    },
  });
}

export function useReviewed() {
  return useQuery({
    queryKey: reviewKeys.reviewed(),
    queryFn: async () => {
      const res = await api.getReviewed();
      if (res.error) throw new Error(res.error);
      return res.data || [];
    },
  });
}

// Mutations for review operations
export function useAssignReviewer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (contentId: string) => {
      const res = await api.assignReviewer(contentId);
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.pending() });
    },
  });
}

export function useApproveContent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (contentId: string) => {
      const res = await api.approveContent(contentId);
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
      queryClient.invalidateQueries({ queryKey: ['content'] });
    },
  });
}

export function useRejectContent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ contentId, comment }: { contentId: string; comment: string }) => {
      const res = await api.rejectContent(contentId, comment);
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
      queryClient.invalidateQueries({ queryKey: ['content'] });
    },
  });
}

