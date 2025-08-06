import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Users, Building2, Search, Plus, CheckCircle, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { useState, useEffect } from "react";
import type { Database } from '@/types/supabase';

type Tables = Database['public']['Tables'];
type ProjectRow = Tables['projects']['Row'];

interface Project extends ProjectRow {
  title: string;
  description: string;
}

const Index = () => {
  const { user, isLoading } = useAuth();
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState<string | null>(null);
  
  // Fetch recent projects from Supabase
  useEffect(() => {
    const fetchRecentProjects = async () => {
      if (!supabase) {
        setProjectsLoading(false);
        return;
      }

      try {
        setProjectsLoading(true);
        setProjectsError(null);

        // Fetch recent projects (limit to 6 for the homepage)
        const { data: projectsData, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(6);

        if (error) {
          console.error('Error fetching projects:', error);
          setProjectsError('Failed to load projects');
          return;
        }

        // Transform projects to include computed fields
        const transformedProjects: Project[] = (projectsData || []).map(project => ({
          ...project,
          title: project.project_name || 'Untitled Project',
          description: project.project_description || 'No description available'
        }));

        setRecentProjects(transformedProjects);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setProjectsError('Failed to load projects');
      } finally {
        setProjectsLoading(false);
      }
    };

    fetchRecentProjects();
  }, []);

  const getStatusBadgeVariant = (status: string | null) => {
    switch (status) {
      case 'Draft': return 'secondary';
      case 'Published': return 'default';
      case 'Active': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusDisplayText = (status: string | null) => {
    switch (status) {
      case 'Draft': return 'Draft';
      case 'Published': return 'Published';
      case 'Active': return 'Active';
      default: return 'Unknown';
    }
  };
  
  // Show loading state while auth is initializing
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  const valueProps = [
    {
      icon: Users,
      title: "For Students",
      subtitle: "Gain real experience and build your portfolio with meaningful projects.",
      description: "Build your portfolio through real-world voluntary work experience. Born links students and new grads with real startup projects — no gatekeeping, no endless applications. Browse live opportunities now.",
      perks: [
        "Real-world project experience",
        "Direct startup collaboration", 
        "Portfolio building opportunities"
      ]
    },
    {
      icon: Building2,
      title: "For Companies", 
      subtitle: "Find passionate students for your projects.",
      description: "Find passionate students for your projects.",
      perks: [
        "Access to motivated talent",
        "Zero recruitment fees",
        "Fresh perspectives on projects"
      ]
    }
  ];

  const stats = [
    { number: "500+", label: "Active Students" },
    { number: "150+", label: "Projects Completed" },
    { number: "25+", label: "Partner Companies" },
    { number: "95%", label: "Success Rate" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-hero text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="mb-6">
              <Badge variant="secondary" className="mb-4 bg-primary-foreground/20 text-primary-foreground border-primary-foreground/20">
                Zero fees, real experience
              </Badge>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
              Real Projects. Real Experience. <span className="text-secondary">Start Building Today.</span>
            </h1>
            
            <p className="text-xl mb-8 opacity-90 leading-relaxed">
              Build your portfolio through real-world voluntary work experience. Born links students and new grads with real startup projects — no gatekeeping, no endless applications. Browse live opportunities now.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link to="/find-projects">
                <Button size="lg" variant="secondary" className="gap-2 text-lg px-8">
                  <Search className="h-5 w-5" />
                  Explore Live Projects
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="gap-2 text-lg px-8 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                <Plus className="h-5 w-5" />
                Get Signed up with Google
              </Button>
            </div>
            
            {/* <p className="text-sm opacity-75">
              *Pro Bono Only! - Trusted by 20+ Businesses
            </p> */}
          </div>
        </div>
      </section>

      {/* Value Proposition Cards */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {valueProps.map((prop, index) => (
              <Card key={index} className="bg-gradient-card border-0 shadow-medium hover:shadow-large transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-primary rounded-lg">
                      <prop.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{prop.title}</CardTitle>
                      <CardDescription className="text-primary/70">
                        {prop.subtitle}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {prop.description}
                  </p>
                  <ul className="space-y-2">
                    {prop.perks.map((perk, perkIndex) => (
                      <li key={perkIndex} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span className="text-sm">{perk}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Stats */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Making Real Impact</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Join thousands of students and companies already building the future together
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Projects */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 text-primary border-primary/20">
              Recent Projects
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Explore Our Recent Projects</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Check out the latest projects from our community. Real opportunities for real experience.
            </p>
          </div>

          {projectsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Loading recent projects...</p>
              </div>
            </div>
          ) : projectsError ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{projectsError}</p>
            </div>
          ) : recentProjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No projects available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentProjects.map((project) => (
                <Card key={project.id} className="hover:shadow-medium transition-all duration-300 border-0 shadow-soft">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-primary">Project #{project.id}</span>
                      <Badge variant={getStatusBadgeVariant(project.status)}>
                        {getStatusDisplayText(project.status)}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg leading-tight">
                      {project.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <CardDescription className="leading-relaxed line-clamp-4">
                      {project.description}
                    </CardDescription>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
                    </div>
                    
                    <Link to={`/projects/${project.id}`}>
                      <Button className="w-full gap-2 group">
                        View Project
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link to="/find-projects">
              <Button size="lg" className="gap-2">
                View All Projects
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2024 Born Directory. Connecting talent with opportunity.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
