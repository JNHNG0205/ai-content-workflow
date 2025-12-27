import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface Content {
  id: string;
  title: string;
  body: string;
  status: string;
  rejectionComment?: string;
  createdAt: string;
}

// Query keys
export const contentKeys = {
  all: ['content'] as const,
  drafts: () => [...contentKeys.all, 'drafts'] as const,
  submitted: () => [...contentKeys.all, 'submitted'] as const,
  rejected: () => [...contentKeys.all, 'rejected'] as const,
  approved: () => [...contentKeys.all, 'approved'] as const,
  detail: (id: string) => [...contentKeys.all, 'detail', id] as const,
};

// Hooks for fetching content
export function useDrafts() {
  return useQuery<Content[]>({
    queryKey: contentKeys.drafts(),
    queryFn: async () => {
      const res = await api.getDrafts();
      if (res.error) throw new Error(res.error);
      return res.data || [];
    },
  });
}

export function useSubmitted() {
  return useQuery<Content[]>({
    queryKey: contentKeys.submitted(),
    queryFn: async () => {
      const res = await api.getSubmitted();
      if (res.error) throw new Error(res.error);
      return res.data || [];
    },
  });
}

export function useRejected() {
  return useQuery<Content[]>({
    queryKey: contentKeys.rejected(),
    queryFn: async () => {
      const res = await api.getRejected();
      if (res.error) throw new Error(res.error);
      return res.data || [];
    },
  });
}

export function useApproved() {
  return useQuery<Content[]>({
    queryKey: contentKeys.approved(),
    queryFn: async () => {
      const res = await api.getApproved();
      if (res.error) throw new Error(res.error);
      return res.data || [];
    },
  });
}

export function useContent(contentId: string) {
  return useQuery<Content>({
    queryKey: contentKeys.detail(contentId),
    queryFn: async () => {
      const res = await api.getContent(contentId);
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    enabled: !!contentId,
  });
}

// Mutations for content operations
export function useCreateDraft() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ title, body }: { title: string; body: string }) => {
      const res = await api.createDraft(title, body);
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentKeys.drafts() });
    },
  });
}

export function useUpdateContent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ contentId, title, body }: { contentId: string; title: string; body: string }) => {
      const res = await api.updateContent(contentId, title, body);
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: contentKeys.all });
      queryClient.invalidateQueries({ queryKey: contentKeys.detail(variables.contentId) });
    },
  });
}

export function useSubmitDraft() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (contentId: string) => {
      const res = await api.submitDraft(contentId);
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentKeys.all });
    },
  });
}

export function useRevertContent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (contentId: string) => {
      const res = await api.revertContent(contentId);
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentKeys.all });
    },
  });
}

