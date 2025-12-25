import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface Content {
  id: string;
  title: string;
  body: string;
  status: string;
  authorId: string;
  reviewerId?: string;
  createdAt: string;
}

export function ReviewerDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'pending' | 'reviewed'>('pending');
  const [pending, setPending] = useState<Content[]>([]);
  const [reviewed, setReviewed] = useState<Content[]>([]);
  const [loading, setLoading] = useState(false);
  const [rejectComment, setRejectComment] = useState('');
  const [selectedContent, setSelectedContent] = useState<string | null>(null);

  useEffect(() => {
    loadContent();
  }, [activeTab]);

  const loadContent = async () => {
    setLoading(true);
    try {
      if (activeTab === 'pending') {
        const res = await api.getPendingReviews();
        if (res.data) setPending(res.data);
      } else {
        const res = await api.getReviewed();
        if (res.data) setReviewed(res.data);
      }
    } catch (error) {
      console.error('Failed to load content:', error);
    }
    setLoading(false);
  };

  const handleAssign = async (id: string) => {
    setLoading(true);
    await api.assignReviewer(id);
    loadContent();
  };

  const handleApprove = async (id: string) => {
    setLoading(true);
    await api.approveContent(id);
    setActiveTab('reviewed');
    loadContent();
  };

  const handleReject = async (id: string) => {
    if (!rejectComment.trim()) {
      alert('Please provide a rejection comment');
      return;
    }
    setLoading(true);
    await api.rejectContent(id, rejectComment);
    setRejectComment('');
    setSelectedContent(null);
    setActiveTab('reviewed');
    loadContent();
  };

  const currentContent = activeTab === 'pending' ? pending : reviewed;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">AI Content Workflow - Reviewer</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user?.email}</span>
              <Button variant="outline" onClick={logout}>Logout</Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-4 mb-6 border-b">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === 'pending'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Pending Reviews
          </button>
          <button
            onClick={() => setActiveTab('reviewed')}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === 'reviewed'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Reviewed
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : currentContent.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              No {activeTab} content found
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {currentContent.map((content) => (
              <Card key={content.id}>
                <CardHeader>
                  <CardTitle>{content.title}</CardTitle>
                  <CardDescription>
                    Status: {content.status} • Created: {new Date(content.createdAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 mb-4 whitespace-pre-wrap">{content.body}</p>
                  {activeTab === 'pending' && (
                    <div className="space-y-4">
                      {!content.reviewerId && (
                        <Button onClick={() => handleAssign(content.id)}>Assign to Me</Button>
                      )}
                      {content.reviewerId && (
                        <div className="flex gap-2">
                          <Button onClick={() => handleApprove(content.id)} variant="default">
                            Approve
                          </Button>
                          <Button
                            onClick={() => setSelectedContent(selectedContent === content.id ? null : content.id)}
                            variant="destructive"
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                      {selectedContent === content.id && (
                        <div className="mt-4 space-y-2">
                          <Label>Rejection Comment</Label>
                          <Textarea
                            value={rejectComment}
                            onChange={(e) => setRejectComment(e.target.value)}
                            placeholder="Provide feedback for the writer..."
                            rows={3}
                          />
                          <div className="flex gap-2">
                            <Button onClick={() => handleReject(content.id)} variant="destructive">
                              Confirm Reject
                            </Button>
                            <Button variant="outline" onClick={() => {
                              setSelectedContent(null);
                              setRejectComment('');
                            }}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

