import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, FolderOpen, Users, Badge as BadgeIcon } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabaseClient';

interface ProjectRoleTreeProps {
  onRoleSelect: (roleId: string, projectId: string) => void;
  selectedRoleId?: string;
}

export function ProjectRoleTree({ onRoleSelect, selectedRoleId }: ProjectRoleTreeProps) {
  const { state } = useApp();
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [supabaseProjects, setSupabaseProjects] = useState<Record<string, any>[]>([]);
  const [supabaseRoles, setSupabaseRoles] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch projects and roles from Supabase
  useEffect(() => {
    const fetchData = async () => {
      if (!supabase) return;
      
      try {
        setLoading(true);
        
        // Fetch published projects
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .eq('state', 'Published');
        
        if (projectsError) throw projectsError;
        
        // Fetch contractor roles
        const { data: rolesData, error: rolesError } = await supabase
          .from('ContractorRole')
          .select('*');
        
        if (rolesError) throw rolesError;
        
        setSupabaseProjects(projectsData || []);
        setSupabaseRoles(rolesData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleProject = (projectId: string) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  // Use Supabase data if available, otherwise fall back to context state
  const projectsToShow = supabaseProjects.length > 0 ? supabaseProjects : state.projects;
  
  const filteredProjects = projectsToShow.filter(project => {
    // For Supabase data, check project_name field, for context data check title
    const projectTitle = project.project_name || project.title || '';
    const projectState = project.state || 'Draft';
    
    // Only show published projects
    return projectState === 'Published' && (
      projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      // For now, skip role filtering in Supabase mode as roles are separate
      (supabaseProjects.length === 0 && project.roles?.some(role => 
        role.name.toLowerCase().includes(searchQuery.toLowerCase())
      ))
    );
  });

  const getApplicationCount = (roleId: string) => {
    // Count applications for this role from Supabase data
    if (supabaseProjects.length > 0) {
      // For now, return 0 as we need to implement application counting
      // This would need to query the applications table
      return 0;
    }
    // Fallback to mock data if Supabase not available
    return 0;
  };

  const getRoleStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return '🟡';
      case 'assigned':
        return '🟢';
      case 'filled':
        return '✅';
      default:
        return '⚪';
    }
  };

  return (
    <div className="w-44 sm:w-48 md:w-52 lg:w-56 xl:w-60 border-r border-border/50 bg-card/50 backdrop-blur-sm flex-shrink-0 flex flex-col h-full">
      <div className="p-2 sm:p-3 border-b border-border/50">
        <h2 className="text-sm sm:text-base font-semibold mb-2">Projects & Roles</h2>
        <Input
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="text-xs sm:text-sm"
        />
      </div>

      <div className="p-2 overflow-y-auto min-h-0 max-h-full">
        {loading ? (
          <div className="text-center text-muted-foreground py-6">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-xs sm:text-sm">Loading projects...</p>
          </div>
        ) : (
          <>
            {filteredProjects.map((project) => {
          const isExpanded = expandedProjects.has(project.id);
          const totalApplications = supabaseProjects.length > 0 ? 0 : project.roles?.reduce((sum, role) => 
            sum + getApplicationCount(role.id), 0
          ) || 0;

          return (
            <div key={project.id} className="mb-1">
              <Button
                variant="ghost"
                className="w-full justify-start p-1.5 sm:p-2 h-auto"
                onClick={() => toggleProject(project.id)}
              >
                <div className="flex items-center gap-1.5 sm:gap-2 w-full">
                  {isExpanded ? (
                    <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                  )}
                  <FolderOpen className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                  <div className="flex-1 text-left min-w-0">
                    <div className="font-medium text-xs sm:text-sm truncate">{project.project_name || project.title}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      <span className="hidden sm:inline">{project.state} • </span>
                      {supabaseProjects.length > 0 ? 'Roles loaded separately' : project.roles?.length || 0} roles
                    </div>
                  </div>
                  {totalApplications > 0 && (
                    <Badge variant="secondary" className="text-xs px-1">
                      {totalApplications}
                    </Badge>
                  )}
                </div>
              </Button>

              {isExpanded && supabaseProjects.length === 0 && (
                <div className="ml-3 sm:ml-4 mt-1 space-y-0.5 sm:space-y-1">
                  {project.roles?.map((role) => {
                    const applicationCount = getApplicationCount(role.id);
                    const isSelected = selectedRoleId === role.id;

                    return (
                      <Button
                        key={role.id}
                        variant="ghost"
                        className={cn(
                          "w-full justify-start p-1.5 sm:p-2 h-auto text-xs sm:text-sm",
                          isSelected && "bg-primary/10 border border-primary/20"
                        )}
                        onClick={() => onRoleSelect(role.id, project.id)}
                      >
                        <div className="flex items-center gap-1 sm:gap-2 w-full">
                          <span className="text-sm sm:text-lg">
                            {getRoleStatusIcon(role.status)}
                          </span>
                          <Users className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-muted-foreground" />
                          <div className="flex-1 text-left min-w-0">
                            <div className="font-medium truncate">{role.name}</div>
                            <div className="text-xs text-muted-foreground truncate">
                              <span className="hidden sm:inline">{role.roleType} • </span>{role.status}
                            </div>
                          </div>
                          {applicationCount > 0 && (
                            <Badge variant="default" className="text-xs px-1">
                              {applicationCount}
                            </Badge>
                          )}
                        </div>
                      </Button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {filteredProjects.length === 0 && (
          <div className="text-center text-muted-foreground py-6">
            <FolderOpen className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs sm:text-sm">No projects found</p>
          </div>
        )}
          </>
        )}
      </div>
    </div>
  );
}