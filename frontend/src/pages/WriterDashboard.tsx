import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Content {
  id: string;
  title: string;
  body: string;
  status: string;
  rejectionComment?: string;
  createdAt: string;
}

export function WriterDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'drafts' | 'submitted' | 'rejected' | 'approved' | 'create'>('drafts');
  const [drafts, setDrafts] = useState<Content[]>([]);
  const [submitted, setSubmitted] = useState<Content[]>([]);
  const [rejected, setRejected] = useState<Content[]>([]);
  const [approved, setApproved] = useState<Content[]>([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadContent();
  }, [activeTab]);

  const loadContent = async () => {
    setLoading(true);
    try {
      if (activeTab === 'drafts') {
        const res = await api.getDrafts();
        if (res.data) setDrafts(res.data);
      } else if (activeTab === 'submitted') {
        const res = await api.getSubmitted();
        if (res.data) setSubmitted(res.data);
      } else if (activeTab === 'rejected') {
        const res = await api.getRejected();
        if (res.data) setRejected(res.data);
      } else if (activeTab === 'approved') {
        const res = await api.getApproved();
        if (res.data) setApproved(res.data);
      }
    } catch (error) {
      console.error('Failed to load content:', error);
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!title || !body) return;
    setLoading(true);
    const res = await api.createDraft(title, body);
    if (res.data) {
      setTitle('');
      setBody('');
      setActiveTab('drafts');
      loadContent();
    }
    setLoading(false);
  };

  const handleGenerate = async () => {
    if (!aiPrompt) return;
    setGenerating(true);
    const res = await api.generateContent(aiPrompt);
    if (res.data) {
      setBody(res.data.content);
    }
    setGenerating(false);
  };

  const handleSubmit = async (id: string) => {
    setLoading(true);
    await api.submitDraft(id);
    loadContent();
  };

  const handleRevert = async (id: string) => {
    setLoading(true);
    await api.revertContent(id);
    setActiveTab('drafts');
    loadContent();
  };

  const tabs = [
    { id: 'drafts', label: 'Drafts' },
    { id: 'submitted', label: 'Submitted' },
    { id: 'rejected', label: 'Rejected' },
    { id: 'approved', label: 'Approved' },
    { id: 'create', label: 'Create' },
  ];

  const currentContent = 
    activeTab === 'drafts' ? drafts :
    activeTab === 'submitted' ? submitted :
    activeTab === 'rejected' ? rejected :
    activeTab === 'approved' ? approved : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">AI Content Workflow</h1>
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
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'create' && (
          <Card>
            <CardHeader>
              <CardTitle>Create New Draft</CardTitle>
              <CardDescription>Create content manually or use AI to generate</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>AI Generation (Optional)</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter prompt for AI generation..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                  />
                  <Button onClick={handleGenerate} disabled={generating}>
                    {generating ? 'Generating...' : 'Generate'}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Content title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="body">Body</Label>
                <Textarea
                  id="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Content body"
                  rows={10}
                />
              </div>
              <Button onClick={handleCreate} disabled={loading || !title || !body}>
                Create Draft
              </Button>
            </CardContent>
          </Card>
        )}

        {activeTab !== 'create' && (
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : currentContent.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-gray-500">
                  No {activeTab} content found
                </CardContent>
              </Card>
            ) : (
              currentContent.map((content) => (
                <Card key={content.id}>
                  <CardHeader>
                    <CardTitle>{content.title}</CardTitle>
                    <CardDescription>
                      Status: {content.status} • Created: {new Date(content.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 mb-4 whitespace-pre-wrap">{content.body}</p>
                    {content.rejectionComment && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-md mb-4">
                        <p className="text-sm font-semibold text-red-800">Rejection Comment:</p>
                        <p className="text-sm text-red-700">{content.rejectionComment}</p>
                      </div>
                    )}
                    <div className="flex gap-2">
                      {content.status === 'DRAFT' && (
                        <Button onClick={() => handleSubmit(content.id)}>Submit</Button>
                      )}
                      {content.status === 'REJECTED' && (
                        <Button onClick={() => handleRevert(content.id)}>Edit</Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

