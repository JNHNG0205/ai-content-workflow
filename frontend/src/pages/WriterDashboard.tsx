import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  useDrafts,
  useSubmitted,
  useRejected,
  useApproved,
  useCreateDraft,
  useUpdateContent,
  useSubmitDraft,
  useRevertContent,
  type Content,
} from '@/hooks/useContent';
import { useGenerateContent, useRefineContent } from '@/hooks/useAI';

export function WriterDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'drafts' | 'submitted' | 'rejected' | 'approved' | 'create'>('drafts');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [refineInstruction, setRefineInstruction] = useState('');
  const [refinedContent, setRefinedContent] = useState<string | null>(null);
  const [editingContentId, setEditingContentId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');

  // React Query hooks
  const { data: drafts = [], isLoading: draftsLoading } = useDrafts();
  const { data: submitted = [], isLoading: submittedLoading } = useSubmitted();
  const { data: rejected = [], isLoading: rejectedLoading } = useRejected();
  const { data: approved = [], isLoading: approvedLoading } = useApproved();

  const createDraft = useCreateDraft();
  const updateContent = useUpdateContent();
  const submitDraft = useSubmitDraft();
  const revertContent = useRevertContent();
  const generateContent = useGenerateContent();
  const refineContent = useRefineContent();

  const handleCreate = async () => {
    if (!title || !body) return;
    try {
      await createDraft.mutateAsync({ title, body });
      setTitle('');
      setBody('');
      setGeneratedContent(null);
      setAiPrompt('');
      setActiveTab('drafts');
    } catch (error) {
      console.error('Failed to create draft:', error);
    }
  };

  const handleGenerate = async () => {
    if (!aiPrompt) return;
    try {
      const content = await generateContent.mutateAsync(aiPrompt);
      setGeneratedContent(content);
    } catch (error) {
      console.error('Failed to generate content:', error);
    }
  };

  const handleKeepGenerated = () => {
    if (generatedContent) {
      setBody(generatedContent);
      setGeneratedContent(null);
    }
  };

  const handleRegenerate = () => {
    if (aiPrompt) {
      handleGenerate();
    }
  };

  const handleDiscardGenerated = () => {
    setGeneratedContent(null);
  };

  const handleRefine = async () => {
    const contentToRefine = editingContentId ? editBody : body;
    if (!contentToRefine || contentToRefine.trim().length === 0) {
      alert('Please add content to the body field before refining');
      return;
    }
    try {
      const refined = await refineContent.mutateAsync({ 
        content: contentToRefine, 
        instruction: refineInstruction || undefined 
      });
      setRefinedContent(refined);
    } catch (error) {
      console.error('Failed to refine content:', error);
    }
  };

  const handleKeepRefined = () => {
    if (refinedContent) {
      if (editingContentId) {
        setEditBody(refinedContent);
      } else {
        setBody(refinedContent);
      }
      setRefinedContent(null);
      setRefineInstruction('');
    }
  };

  const handleRegenerateRefined = () => {
    if (editingContentId ? editBody : body) {
      handleRefine();
    }
  };

  const handleDiscardRefined = () => {
    setRefinedContent(null);
    setRefineInstruction('');
  };

  const handleSubmit = async (id: string) => {
    try {
      await submitDraft.mutateAsync(id);
    } catch (error) {
      console.error('Failed to submit draft:', error);
    }
  };

  const handleRevert = async (id: string) => {
    try {
      await revertContent.mutateAsync(id);
      setActiveTab('drafts');
    } catch (error) {
      console.error('Failed to revert content:', error);
    }
  };

  const handleEdit = (content: Content) => {
    setEditingContentId(content.id);
    setEditTitle(content.title);
    setEditBody(content.body);
    setActiveTab('create');
  };

  const handleCancelEdit = () => {
    setEditingContentId(null);
    setEditTitle('');
    setEditBody('');
    setTitle('');
    setBody('');
    setGeneratedContent(null);
    setAiPrompt('');
  };

  const handleUpdate = async () => {
    if (!editingContentId || !editTitle || !editBody) return;
    try {
      await updateContent.mutateAsync({ contentId: editingContentId, title: editTitle, body: editBody });
      setEditingContentId(null);
      setEditTitle('');
      setEditBody('');
      setTitle('');
      setBody('');
      setActiveTab('drafts');
    } catch (error) {
      console.error('Failed to update content:', error);
    }
  };

  const tabs = [
    { id: 'create', label: 'Create' },
    { id: 'drafts', label: 'Drafts' },
    { id: 'submitted', label: 'Submitted' },
    { id: 'rejected', label: 'Rejected' },
    { id: 'approved', label: 'Approved' },
  ];

  const isLoading = 
    activeTab === 'drafts' ? draftsLoading :
    activeTab === 'submitted' ? submittedLoading :
    activeTab === 'rejected' ? rejectedLoading :
    activeTab === 'approved' ? approvedLoading : false;

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
              <CardTitle>{editingContentId ? 'Edit Draft' : 'Create New Draft'}</CardTitle>
              <CardDescription>
                {editingContentId ? 'Update your draft content' : 'Create content manually or use AI to generate'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!editingContentId && (
                <div className="space-y-2">
                  <Label>AI Generation (Optional)</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter prompt for AI generation..."
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      disabled={generateContent.isPending}
                    />
                    <Button onClick={handleGenerate} disabled={generateContent.isPending || !aiPrompt}>
                      {generateContent.isPending ? 'Generating...' : 'Generate'}
                    </Button>
                  </div>
                </div>
              )}

              {!editingContentId && generatedContent && (
                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-lg">Generated Content Preview</CardTitle>
                    <CardDescription>Review the AI-generated content before adding it to your draft</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-white rounded-md border border-blue-200">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{generatedContent}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleKeepGenerated} variant="default">
                        Keep
                      </Button>
                      <Button onClick={handleRegenerate} variant="outline" disabled={generateContent.isPending}>
                        {generateContent.isPending ? 'Regenerating...' : 'Regenerate'}
                      </Button>
                      <Button onClick={handleDiscardGenerated} variant="ghost">
                        Discard
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={editingContentId ? editTitle : title}
                  onChange={(e) => {
                    if (editingContentId) {
                      setEditTitle(e.target.value);
                    } else {
                      setTitle(e.target.value);
                    }
                  }}
                  placeholder="Content title"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="body">Body</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRefine}
                    disabled={refineContent.isPending || !(editingContentId ? editBody : body) || ((editingContentId ? editBody : body)?.trim().length === 0)}
                  >
                    {refineContent.isPending ? 'Refining...' : 'Refine with AI'}
                  </Button>
                </div>
                <Textarea
                  id="body"
                  value={editingContentId ? editBody : body}
                  onChange={(e) => {
                    if (editingContentId) {
                      setEditBody(e.target.value);
                      // Clear refined content preview if user manually edits
                      if (refinedContent) {
                        setRefinedContent(null);
                      }
                    } else {
                      setBody(e.target.value);
                      // Clear generated/refined content preview if user manually edits
                      if (generatedContent) {
                        setGeneratedContent(null);
                      }
                      if (refinedContent) {
                        setRefinedContent(null);
                      }
                    }
                  }}
                  placeholder="Content body"
                  rows={10}
                />
                <div className="space-y-2">
                  <Label htmlFor="refine-instruction" className="text-sm text-gray-500">
                    Refinement Instruction (Optional)
                  </Label>
                  <Input
                    id="refine-instruction"
                    placeholder="e.g., Make it more engaging, add more details, improve clarity..."
                    value={refineInstruction}
                    onChange={(e) => setRefineInstruction(e.target.value)}
                    disabled={refineContent.isPending}
                  />
                </div>
              </div>

              {refinedContent && (
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-lg">Refined Content Preview</CardTitle>
                    <CardDescription>Review the AI-refined content before applying it to your draft</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-white rounded-md border border-green-200">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{refinedContent}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleKeepRefined} variant="default">
                        Keep Refined
                      </Button>
                      <Button onClick={handleRegenerateRefined} variant="outline" disabled={refineContent.isPending}>
                        {refineContent.isPending ? 'Refining...' : 'Refine Again'}
                      </Button>
                      <Button onClick={handleDiscardRefined} variant="ghost">
                        Discard
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
              <div className="flex gap-2">
                {editingContentId ? (
                  <>
                    <Button onClick={handleUpdate} disabled={updateContent.isPending || !editTitle || !editBody}>
                      {updateContent.isPending ? 'Updating...' : 'Update Draft'}
                    </Button>
                    <Button onClick={handleCancelEdit} variant="outline" disabled={updateContent.isPending}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleCreate} disabled={createDraft.isPending || !title || !body}>
                    {createDraft.isPending ? 'Creating...' : 'Create Draft'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab !== 'create' && (
          <div className="space-y-4">
            {isLoading ? (
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
                        <>
                          <Button onClick={() => handleEdit(content)} variant="outline">
                            Edit
                          </Button>
                          <Button onClick={() => handleSubmit(content.id)}>Submit</Button>
                        </>
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

