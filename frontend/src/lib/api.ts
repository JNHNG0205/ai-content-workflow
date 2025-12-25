const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiClient {
  private sessionId: string | null = null;

  setSessionId(sessionId: string | null) {
    this.sessionId = sessionId;
    if (sessionId) {
      localStorage.setItem('sessionId', sessionId);
    } else {
      localStorage.removeItem('sessionId');
    }
  }

  getSessionId(): string | null {
    if (!this.sessionId) {
      this.sessionId = localStorage.getItem('sessionId');
    }
    return this.sessionId;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const sessionId = this.getSessionId();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (sessionId) {
      headers['x-session-id'] = sessionId;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'Request failed' };
      }

      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Network error' };
    }
  }

  // Auth
  async register(email: string, password: string, role?: string) {
    return this.request<{ id: string; email: string; role: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    });
  }

  async login(email: string, password: string) {
    const response = await this.request<{ sessionId: string; user: { id: string; email: string; role: string } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.data) {
      this.setSessionId(response.data.sessionId);
    }

    return response;
  }

  logout() {
    this.setSessionId(null);
  }

  async getCurrentUser() {
    return this.request<{ id: string; email: string; role: string }>('/auth/me');
  }

  // Content
  async createDraft(title: string, body: string) {
    return this.request('/content', {
      method: 'POST',
      body: JSON.stringify({ title, body }),
    });
  }

  async getDrafts() {
    return this.request<any[]>('/content/drafts');
  }

  async getContent(contentId: string) {
    return this.request<any>(`/content/${contentId}`);
  }

  async updateContent(contentId: string, title: string, body: string) {
    return this.request(`/content/${contentId}`, {
      method: 'PUT',
      body: JSON.stringify({ title, body }),
    });
  }

  async submitDraft(contentId: string) {
    return this.request(`/content/${contentId}/submit`, {
      method: 'POST',
    });
  }

  async revertContent(contentId: string) {
    return this.request(`/content/${contentId}/revert`, {
      method: 'PUT',
    });
  }

  async getSubmitted() {
    return this.request<any[]>('/content/submitted');
  }

  async getRejected() {
    return this.request<any[]>('/content/rejected');
  }

  async getApproved() {
    return this.request<any[]>('/content/approved');
  }

  // Review
  async getPendingReviews() {
    return this.request<any[]>('/review/pending');
  }

  async assignReviewer(contentId: string) {
    return this.request(`/review/${contentId}/assign`, {
      method: 'POST',
    });
  }

  async approveContent(contentId: string) {
    return this.request(`/review/${contentId}/approve`, {
      method: 'POST',
    });
  }

  async rejectContent(contentId: string, comment: string) {
    return this.request(`/review/${contentId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ comment }),
    });
  }

  async getReviewed() {
    return this.request<any[]>('/review/reviewed');
  }

  // AI
  async generateContent(prompt: string) {
    return this.request<{ content: string }>('/ai/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });
  }
}

export const api = new ApiClient();

