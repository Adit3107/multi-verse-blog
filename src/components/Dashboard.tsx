import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Building2, Calendar, Edit, FileText, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";

export function Dashboard() {
  const { currentOrganization, organizations, createOrganization, createBlog, updateBlog, deleteBlog } = useAuth();
  const [showOrgDialog, setShowOrgDialog] = useState(false);
  const [showBlogDialog, setShowBlogDialog] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any>(null);
  
  // Organization form
  const [orgName, setOrgName] = useState("");
  const [orgDescription, setOrgDescription] = useState("");
  
  // Blog form
  const [blogTitle, setBlogTitle] = useState("");
  const [blogContent, setBlogContent] = useState("");

  const handleCreateOrganization = () => {
    if (orgName.trim()) {
      createOrganization(orgName.trim(), orgDescription.trim() || undefined);
      setOrgName("");
      setOrgDescription("");
      setShowOrgDialog(false);
    }
  };

  const handleCreateBlog = () => {
    if (blogTitle.trim() && blogContent.trim()) {
      if (editingBlog) {
        updateBlog(editingBlog.id, blogTitle.trim(), blogContent.trim());
        setEditingBlog(null);
      } else {
        createBlog(blogTitle.trim(), blogContent.trim());
      }
      setBlogTitle("");
      setBlogContent("");
      setShowBlogDialog(false);
    }
  };

  const handleEditBlog = (blog: any) => {
    setEditingBlog(blog);
    setBlogTitle(blog.title);
    setBlogContent(blog.content);
    setShowBlogDialog(true);
  };

  const handleDeleteBlog = (blogId: string) => {
    if (confirm("Are you sure you want to delete this blog?")) {
      deleteBlog(blogId);
    }
  };

  // If no organizations exist
  if (organizations.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto shadow-glow">
                <Building2 className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="text-4xl font-bold">Welcome to BlogSpace</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Create your first organization to start building amazing content. 
                Each organization can have multiple blogs and team members.
              </p>
            </div>
            
            <Dialog open={showOrgDialog} onOpenChange={setShowOrgDialog}>
              <DialogTrigger asChild>
                <Button variant="hero" size="lg" className="shadow-glow">
                  <Plus className="mr-2 h-5 w-5" />
                  Create Your First Organization
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gradient-card border-0 shadow-elegant">
                <DialogHeader>
                  <DialogTitle>Create Organization</DialogTitle>
                  <DialogDescription>
                    Start your multi-tenant blog journey by creating your first organization.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="org-name">Organization Name</Label>
                    <Input
                      id="org-name"
                      placeholder="Acme Inc"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="org-description">Description (Optional)</Label>
                    <Textarea
                      id="org-description"
                      placeholder="Tell us about your organization..."
                      value={orgDescription}
                      onChange={(e) => setOrgDescription(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowOrgDialog(false)}>
                    Cancel
                  </Button>
                  <Button variant="hero" onClick={handleCreateOrganization}>
                    Create Organization
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    );
  }

  // If no organization is selected
  if (!currentOrganization) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Select an Organization</h1>
            <p className="text-muted-foreground">Choose an organization to manage its blogs and content.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizations.map((org) => (
              <Card key={org.id} className="bg-gradient-card border-0 shadow-card hover:shadow-elegant transition-smooth cursor-pointer">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{org.name}</CardTitle>
                      <CardDescription>{org.description || "No description"}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      {org.blogs.length} blog{org.blogs.length !== 1 ? 's' : ''}
                    </Badge>
                    <div className="text-xs text-muted-foreground">
                      Created {format(new Date(org.createdAt), "MMM d, yyyy")}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Main dashboard with selected organization
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{currentOrganization.name}</h1>
            <p className="text-muted-foreground">
              {currentOrganization.description || "Manage your organization's blogs and content"}
            </p>
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0">
            <Dialog open={showOrgDialog} onOpenChange={setShowOrgDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  New Organization
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gradient-card border-0 shadow-elegant">
                <DialogHeader>
                  <DialogTitle>Create Organization</DialogTitle>
                  <DialogDescription>
                    Create a new organization to manage separate content and teams.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="org-name">Organization Name</Label>
                    <Input
                      id="org-name"
                      placeholder="Acme Inc"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="org-description">Description (Optional)</Label>
                    <Textarea
                      id="org-description"
                      placeholder="Tell us about your organization..."
                      value={orgDescription}
                      onChange={(e) => setOrgDescription(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowOrgDialog(false)}>
                    Cancel
                  </Button>
                  <Button variant="hero" onClick={handleCreateOrganization}>
                    Create Organization
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog open={showBlogDialog} onOpenChange={(open) => {
              setShowBlogDialog(open);
              if (!open) {
                setEditingBlog(null);
                setBlogTitle("");
                setBlogContent("");
              }
            }}>
              <DialogTrigger asChild>
                <Button variant="hero">
                  <Plus className="mr-2 h-4 w-4" />
                  New Blog Post
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gradient-card border-0 shadow-elegant max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingBlog ? "Edit Blog Post" : "Create Blog Post"}</DialogTitle>
                  <DialogDescription>
                    {editingBlog ? "Update your blog post content." : "Write a new blog post for your organization."}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="blog-title">Title</Label>
                    <Input
                      id="blog-title"
                      placeholder="Enter blog post title"
                      value={blogTitle}
                      onChange={(e) => setBlogTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="blog-content">Content</Label>
                    <Textarea
                      id="blog-content"
                      placeholder="Write your blog post content..."
                      className="min-h-[200px]"
                      value={blogContent}
                      onChange={(e) => setBlogContent(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowBlogDialog(false)}>
                    Cancel
                  </Button>
                  <Button variant="hero" onClick={handleCreateBlog}>
                    {editingBlog ? "Update Post" : "Create Post"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-card border-0 shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentOrganization.blogs.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card border-0 shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Organization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentOrganization.name}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card border-0 shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Created</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {format(new Date(currentOrganization.createdAt), "MMM yyyy")}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Blog Posts */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Blog Posts</h2>
          
          {currentOrganization.blogs.length === 0 ? (
            <Card className="bg-gradient-card border-0 shadow-card">
              <CardContent className="text-center py-16">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No blog posts yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first blog post to get started with content creation.
                </p>
                <Button variant="hero" onClick={() => setShowBlogDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Post
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentOrganization.blogs.map((blog) => (
                <Card key={blog.id} className="bg-gradient-card border-0 shadow-card hover:shadow-elegant transition-smooth">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg line-clamp-2">{blog.title}</CardTitle>
                      <div className="flex space-x-1 ml-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEditBlog(blog)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteBlog(blog.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                      {blog.content}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3 mr-1" />
                      {format(new Date(blog.createdAt), "MMM d, yyyy")}
                      {blog.updatedAt !== blog.createdAt && (
                        <span className="ml-2">(edited)</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}