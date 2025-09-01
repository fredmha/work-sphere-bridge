import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, FolderOpen, Users, Badge as BadgeIcon } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
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
  const { user } = useAuth();
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [userProjects, setUserProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch projects owned by the current user
  useEffect(() => {
    const fetchUserProjects = async () => {
      if (!supabase || !user?.id) return;
      
      try {
        setLoading(true);
        
        // Get all projects where owner_id matches current user's UUID
        const { data: projects, error } = await supabase
          .from('projects')
          .select('*')
          .eq('owner_id', user.id);
        
        if (error) throw error;
        
        setUserProjects(projects || []);
      } catch (error) {
        console.error('Error fetching user projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProjects();
  }, [user?.id]);

  const toggleProject = (projectId: string) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  // Filter projects based on search query
  const filteredProjects = userProjects.filter(project => {
    const projectName = project.project_name || project.title || '';
    return projectName.toLowerCase().includes(searchQuery.toLowerCase());
  });

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
        <h2 className="text-sm sm:text-base font-semibold mb-2">My Projects & Roles</h2>
        <Input
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="text-xs sm:text-sm"
        />
      </div>

      <div className="p-2 overflow-y-auto min-h-0 max-h-full">
        {!user ? (
          <div className="text-center text-muted-foreground py-6">
            <Users className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs sm:text-sm">Please sign in to view your projects</p>
          </div>
        ) : loading ? (
          <div className="text-center text-muted-foreground py-6">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-xs sm:text-sm">Loading your projects...</p>
          </div>
        ) : (
          <>
            {filteredProjects.map((project) => {
              const isExpanded = expandedProjects.has(project.id);
              const roles = project.contractor_roles || [];
              const totalRoles = roles.length;

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
                        <div className="font-medium text-xs sm:text-sm truncate">
                          {project.project_name || project.title || 'Unnamed Project'}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {totalRoles} role{totalRoles !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                  </Button>

                  {isExpanded && (
                    <div className="ml-3 sm:ml-4 mt-1 space-y-0.5 sm:space-y-1">
                      {roles.map((role: any, index: number) => {
                        const isSelected = selectedRoleId === (role.id || index.toString());

                        return (
                          <Button
                            key={role.id || index}
                            variant="ghost"
                            className={cn(
                              "w-full justify-start p-1.5 sm:p-2 h-auto text-xs sm:text-sm",
                              isSelected && "bg-primary/10 border border-primary/20"
                            )}
                            onClick={() => onRoleSelect(role.id || index.toString(), project.id)}
                          >
                            <div className="flex items-center gap-1 sm:gap-2 w-full">
                              <span className="text-sm sm:text-lg">
                                {getRoleStatusIcon(role.status || 'open')}
                              </span>
                              <Users className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-muted-foreground" />
                              <div className="flex-1 text-left min-w-0">
                                <div className="font-medium truncate">
                                  {role.name || role.role || `Role ${index + 1}`}
                                </div>
                                <div className="text-xs text-muted-foreground truncate">
                                  {role.type || role.roleType || 'Unknown'} • {role.status || 'open'}
                                </div>
                              </div>
                            </div>
                          </Button>
                        );
                      })}
                      
                      {roles.length === 0 && (
                        <div className="text-center text-muted-foreground py-2">
                          <p className="text-xs">No roles defined</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {filteredProjects.length === 0 && user && (
              <div className="text-center text-muted-foreground py-6">
                <FolderOpen className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs sm:text-sm">No projects found</p>
                <p className="text-xs text-muted-foreground mt-1">Create your first project to get started</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}