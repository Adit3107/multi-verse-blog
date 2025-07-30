import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  organizations: Organization[];
}

interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  blogs: Blog[];
}

interface Blog {
  id: string;
  title: string;
  content: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  currentOrganization: Organization | null;
  organizations: Organization[];
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
  createOrganization: (name: string, description?: string) => void;
  setCurrentOrganization: (org: Organization | null) => void;
  createBlog: (title: string, content: string) => void;
  updateBlog: (blogId: string, title: string, content: string) => void;
  deleteBlog: (blogId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('blogApp_user');
    const savedOrgs = localStorage.getItem('blogApp_organizations');
    const savedCurrentOrg = localStorage.getItem('blogApp_currentOrganization');

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedOrgs) {
      setOrganizations(JSON.parse(savedOrgs));
    }
    if (savedCurrentOrg) {
      setCurrentOrganization(JSON.parse(savedCurrentOrg));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('blogApp_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('blogApp_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('blogApp_organizations', JSON.stringify(organizations));
  }, [organizations]);

  useEffect(() => {
    if (currentOrganization) {
      localStorage.setItem('blogApp_currentOrganization', JSON.stringify(currentOrganization));
    } else {
      localStorage.removeItem('blogApp_currentOrganization');
    }
  }, [currentOrganization]);

  const login = async (email: string, password: string) => {
    // Mock authentication
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name: email.split('@')[0],
      organizations: []
    };
    setUser(newUser);
  };

  const signup = async (email: string, password: string) => {
    // Mock registration
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name: email.split('@')[0],
      organizations: []
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
    setCurrentOrganization(null);
    setOrganizations([]);
    localStorage.clear();
  };

  const createOrganization = (name: string, description?: string) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    const newOrg: Organization = {
      id: Date.now().toString(),
      name,
      slug,
      description,
      createdAt: new Date().toISOString(),
      blogs: []
    };
    
    setOrganizations(prev => [...prev, newOrg]);
    setCurrentOrganization(newOrg);
  };

  const createBlog = (title: string, content: string) => {
    if (!currentOrganization) return;

    const newBlog: Blog = {
      id: Date.now().toString(),
      title,
      content,
      organizationId: currentOrganization.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Update organizations list
    setOrganizations(prev => 
      prev.map(org => 
        org.id === currentOrganization.id 
          ? { ...org, blogs: [...org.blogs, newBlog] }
          : org
      )
    );

    // Update current organization
    setCurrentOrganization(prev => 
      prev ? { ...prev, blogs: [...prev.blogs, newBlog] } : null
    );
  };

  const updateBlog = (blogId: string, title: string, content: string) => {
    if (!currentOrganization) return;

    const updatedAt = new Date().toISOString();

    // Update organizations list
    setOrganizations(prev => 
      prev.map(org => 
        org.id === currentOrganization.id 
          ? {
              ...org, 
              blogs: org.blogs.map(blog => 
                blog.id === blogId 
                  ? { ...blog, title, content, updatedAt }
                  : blog
              )
            }
          : org
      )
    );

    // Update current organization
    setCurrentOrganization(prev => 
      prev ? {
        ...prev,
        blogs: prev.blogs.map(blog => 
          blog.id === blogId 
            ? { ...blog, title, content, updatedAt }
            : blog
        )
      } : null
    );
  };

  const deleteBlog = (blogId: string) => {
    if (!currentOrganization) return;

    // Update organizations list
    setOrganizations(prev => 
      prev.map(org => 
        org.id === currentOrganization.id 
          ? { ...org, blogs: org.blogs.filter(blog => blog.id !== blogId) }
          : org
      )
    );

    // Update current organization
    setCurrentOrganization(prev => 
      prev ? { ...prev, blogs: prev.blogs.filter(blog => blog.id !== blogId) } : null
    );
  };

  return (
    <AuthContext.Provider value={{
      user,
      currentOrganization,
      organizations,
      login,
      signup,
      logout,
      createOrganization,
      setCurrentOrganization,
      createBlog,
      updateBlog,
      deleteBlog
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}