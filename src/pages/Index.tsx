import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Users, Building2, Search, Plus, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";

const Index = () => {
  const { user, isLoading } = useAuth();
  
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

  const currentOpportunities = [
    {
      id: 123,
      title: "Data Analysis and Visualization Tool",
      company: "Born",
      description: "This project involves developing a comprehensive data analysis and visualization tool aimed at enhancing decision-making processes for businesses. The tool will allow users to input raw data and receive insightful visual representations, making complex data more accessible and understandable. The project requires skills in data science...",
      roles: ["Data Scientist", "Software Developer"],
      type: "Pay per Task"
    },
    {
      id: 124,
      title: "Automated Testing Framework Development",
      company: "TechTest",
      description: "This project involves creating a robust automated testing framework to enhance software quality and reduce manual testing efforts. The framework will integrate with existing development workflows and provide comprehensive reporting capabilities.",
      roles: ["QA Engineer", "DevOps Engineer"],
      type: "Pay per Hour"
    },
    {
      id: 125,
      title: "Mapping of skills to create an industry-based framework",
      company: "AUKUS Jobs",
      description: "This project is an innovative initiative designed to map out and identify essential skills within the chosen sector. These skills frameworks will provide valuable insights for workforce development and strategic planning.",
      roles: ["Research Analyst", "Data Scientist"],
      type: "Pay per Task"
    }
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

      {/* Current Opportunities */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 text-primary border-primary/20">
              Projects You Could Join Today
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Explore Our Current Opportunities</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              These hand-picked projects from innovative companies help you build real-world experience while making a meaningful impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentOpportunities.map((opportunity) => (
              <Card key={opportunity.id} className="hover:shadow-medium transition-all duration-300 border-0 shadow-soft">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-primary">{opportunity.company}</span>
                  </div>
                  <CardTitle className="text-lg leading-tight">
                    {opportunity.id}: {opportunity.title}
                  </CardTitle>
                  <Badge variant={opportunity.type === "Pay per Task" ? "default" : "secondary"} className="w-fit">
                    {opportunity.type}
                  </Badge>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <CardDescription className="leading-relaxed line-clamp-4">
                    {opportunity.description}
                  </CardDescription>
                  
                  {/* <div>
                    <h4 className="font-semibold mb-2 text-sm">Available Roles:</h4>
                    <div className="flex flex-wrap gap-1">
                      {opportunity.roles.map((role, roleIndex) => (
                        <Badge key={roleIndex} variant="outline" className="text-xs">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div> */}
                  
                  <Link to={`/projects/${opportunity.id}`}>
                    <Button className="w-full gap-2 group">
                      View Project
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          
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
