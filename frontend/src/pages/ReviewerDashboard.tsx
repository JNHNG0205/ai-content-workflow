import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  usePendingReviews,
  useReviewed,
  useAssignReviewer,
  useApproveContent,
  useRejectContent,
} from '@/hooks/useReview';

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
  const [rejectComment, setRejectComment] = useState('');
  const [selectedContent, setSelectedContent] = useState<string | null>(null);

  // React Query hooks
  const { data: pending = [], isLoading: pendingLoading } = usePendingReviews();
  const { data: reviewed = [], isLoading: reviewedLoading } = useReviewed();

  const assignReviewer = useAssignReviewer();
  const approveContent = useApproveContent();
  const rejectContent = useRejectContent();

  const handleAssign = async (id: string) => {
    try {
      await assignReviewer.mutateAsync(id);
    } catch (error) {
      console.error('Failed to assign reviewer:', error);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await approveContent.mutateAsync(id);
      setActiveTab('reviewed');
    } catch (error) {
      console.error('Failed to approve content:', error);
    }
  };

  const handleReject = async (id: string) => {
    if (!rejectComment.trim()) {
      alert('Please provide a rejection comment');
      return;
    }
    try {
      await rejectContent.mutateAsync({ contentId: id, comment: rejectComment });
      setRejectComment('');
      setSelectedContent(null);
      setActiveTab('reviewed');
    } catch (error) {
      console.error('Failed to reject content:', error);
    }
  };

  const isLoading = activeTab === 'pending' ? pendingLoading : reviewedLoading;
  const currentContent = activeTab === 'pending' ? pending : reviewed;
  const isMutating = assignReviewer.isPending || approveContent.isPending || rejectContent.isPending;

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

        {isLoading ? (
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
                        <Button 
                          onClick={() => handleAssign(content.id)} 
                          disabled={assignReviewer.isPending}
                        >
                          {assignReviewer.isPending ? 'Assigning...' : 'Assign to Me'}
                        </Button>
                      )}
                      {content.reviewerId && (
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => handleApprove(content.id)} 
                            variant="default"
                            disabled={approveContent.isPending || rejectContent.isPending}
                          >
                            {approveContent.isPending ? 'Approving...' : 'Approve'}
                          </Button>
                          <Button
                            onClick={() => setSelectedContent(selectedContent === content.id ? null : content.id)}
                            variant="destructive"
                            disabled={approveContent.isPending || rejectContent.isPending}
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
                            <Button 
                              onClick={() => handleReject(content.id)} 
                              variant="destructive"
                              disabled={rejectContent.isPending}
                            >
                              {rejectContent.isPending ? 'Rejecting...' : 'Confirm Reject'}
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => {
                                setSelectedContent(null);
                                setRejectComment('');
                              }}
                              disabled={rejectContent.isPending}
                            >
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

