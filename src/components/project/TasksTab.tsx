import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AddTaskModal } from './AddTaskModal';
import { EditTaskModal } from './EditTaskModal';
import { FeedbackModal } from './FeedbackModal';
import { 
  DragDropContext, 
  Droppable, 
  Draggable,
  DropResult
} from 'react-beautiful-dnd';
import { 
  Plus, 
  Paperclip, 
  MessageSquare, 
  DollarSign,
  Clock,
  User,
  Loader2,
  MoreVertical,
  Edit,
  Trash2
} from 'lucide-react';
import type { Database } from '@/types/supabase';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

type Tables = Database['public']['Tables'];
type ProjectRow = Tables['projects']['Row'];
type ContractorRoleRow = Tables['ContractorRole']['Row'];
type ContractorTaskRow = Tables['ContractorTask']['Row'];

interface TasksTabProps {
  project?: ProjectRow;
}

interface TaskColumn {
  id: string;
  title: string;
  color: string;
}

const columns: TaskColumn[] = [
  { id: 'Pending', title: 'Pending', color: 'bg-muted' },
  { id: 'Submitted', title: 'Submitted', color: 'bg-warning/10' },
  { id: 'Accepted', title: 'Accepted', color: 'bg-success/10' },
  { id: 'Completed', title: 'Completed', color: 'bg-primary/10' }
];

export function TasksTab({ project }: TasksTabProps) {
  const { id: projectId } = useParams<{ id: string }>();
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState<{
    isOpen: boolean;
    taskId?: number;
    taskName?: string;
  }>({ isOpen: false });
  
  // Data states
  const [roles, setRoles] = useState<ContractorRoleRow[]>([]);
  const [tasks, setTasks] = useState<ContractorTaskRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<ContractorTaskRow | null>(null);

  // Fetch roles and tasks for the project
  useEffect(() => {
    const fetchProjectData = async () => {
      if (!projectId) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch contractor roles for this project
        const { data: rolesData, error: rolesError } = await supabase
          .from('ContractorRole')
          .select('*')
          .eq('project_id', parseInt(projectId))
          .eq('type', 'milestone');

        if (rolesError) throw rolesError;

        setRoles(rolesData || []);
        
        // Set first role as selected if available
        if (rolesData && rolesData.length > 0 && !selectedRole) {
          setSelectedRole(rolesData[0].id);
        }

        // Fetch tasks for this project
        const { data: tasksData, error: tasksError } = await supabase
          .from('ContractorTask')
          .select('*')
          .eq('Project', parseInt(projectId));

        if (tasksError) throw tasksError;

        setTasks(tasksData || []);

      } catch (err) {
        console.error('Error fetching project data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load project data');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId, selectedRole]);

  // Function to refresh tasks
  const refreshTasks = async () => {
    if (!projectId) return;

    try {
      const { data: tasksData, error: tasksError } = await supabase
        .from('ContractorTask')
        .select('*')
        .eq('Project', parseInt(projectId));

      if (tasksError) throw tasksError;

      setTasks(tasksData || []);
    } catch (err) {
      console.error('Error refreshing tasks:', err);
    }
  };

  // Function to delete a task
  const handleDeleteTask = async (taskId: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      const { error } = await supabase
        .from('ContractorTask')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      // Refresh tasks after deletion
      await refreshTasks();
    } catch (err) {
      console.error('Error deleting task:', err);
      alert('Failed to delete task. Please try again.');
    }
  };

  const currentRole = selectedRole 
    ? roles.find(r => r.id === selectedRole)
    : roles[0];

  const getTasksForRole = (roleId: number) => {
    return tasks.filter(task => task.role === roleId);
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination || !currentRole) return;

    const taskId = parseInt(result.draggableId);
    const newStatus = result.destination.droppableId;
    const task = tasks.find(t => t.id === taskId);

    if (!task) return;

    // If moving to "Accepted", trigger feedback modal
    if (newStatus === 'Accepted') {
      setFeedbackModal({
        isOpen: true,
        taskId: task.id,
        taskName: task.name || 'Unknown Task'
      });
    }

    // Update task status in database
    try {
      const { error } = await supabase
        .from('ContractorTask')
        .update({ status: newStatus })
        .eq('id', taskId);

      if (error) throw error;

      // Update local state
      setTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, status: newStatus } : t
      ));

    } catch (err) {
      console.error('Error updating task status:', err);
    }
  };

  const handleFeedbackSubmit = async (rating: number, feedback: string) => {
    if (!feedbackModal.taskId) return;

    try {
      const { error } = await supabase
        .from('ContractorTask')
        .update({ 
          score: rating,
          feedback: feedback
        })
        .eq('id', feedbackModal.taskId);

      if (error) throw error;

      // Update local state
      setTasks(prev => prev.map(t => 
        t.id === feedbackModal.taskId 
          ? { ...t, score: rating, feedback: feedback }
          : t
      ));

    } catch (err) {
      console.error('Error updating task feedback:', err);
    }
    
    setFeedbackModal({ isOpen: false });
  };

  const renderTaskCard = (task: ContractorTaskRow, index: number) => {
    return (
      <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`bg-white border border-border/50 rounded-lg p-4 mb-3 transition-all shadow-sm group hover:shadow-lg ${
              snapshot.isDragging ? 'rotate-3 shadow-lg' : ''
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">{task.name}</h4>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={task.priority === 'High' ? 'destructive' : task.priority === 'Medium' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {task.priority}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    ${task.price}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
                      >
                        <MoreVertical className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => {
                        setEditingTask(task);
                      }}>
                        <Edit className="w-3 h-3 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        handleDeleteTask(task.id);
                      }}>
                        <Trash2 className="w-3 h-3 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {task.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {task.description}
                </p>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {task.deliverables && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Paperclip className="w-3 h-3" />
                      Deliverables
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MessageSquare className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Draggable>
    );
  };

  const renderColumn = (column: TaskColumn) => {
    const roleTasks = currentRole ? getTasksForRole(currentRole.id) : [];
    const tasksInColumn = roleTasks.filter(task => task.status === column.id);

    return (
      <div key={column.id} className="flex-1 min-h-[500px]">
        <div className={`${column.color} rounded-lg p-4 h-full`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm">{column.title}</h3>
              <Badge variant="secondary" className="text-xs">
                {tasksInColumn.length}
              </Badge>
            </div>
            {column.id === 'Pending' && currentRole?.type === 'milestone' && 
             currentRole?.status === 'open' && !currentRole?.contractor_id && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0"
                onClick={() => setShowAddTaskModal(true)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            )}
          </div>

          <Droppable droppableId={column.id}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`min-h-[400px] transition-colors ${
                  snapshot.isDraggingOver ? 'bg-primary/5 rounded-lg' : ''
                }`}
              >
                {tasksInColumn.map((task, index) => renderTaskCard(task, index))}
                {provided.placeholder}
                
                {tasksInColumn.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-xs">No {column.title.toLowerCase()} tasks</p>
                  </div>
                )}
              </div>
            )}
          </Droppable>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading tasks...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  const milestoneRoles = roles.filter(role => role.type === 'milestone');

  if (milestoneRoles.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Milestone Roles</h3>
        <p className="text-muted-foreground">
          This project only has timesheet-based roles. Tasks are only available for milestone roles.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Role Selector */}
      {milestoneRoles.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {milestoneRoles.map(role => (
            <Button
              key={role.id}
              variant={selectedRole === role.id || (!selectedRole && role === milestoneRoles[0]) ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedRole(role.id)}
              className="flex items-center gap-2"
            >
              {role.role}
              {getTasksForRole(role.id).length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {getTasksForRole(role.id).length}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      )}

      {/* Current Role Info */}
      {currentRole && (
        <Card className="glass-card border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{currentRole.role}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Milestone Role</Badge>
                {/* <span className="text-sm text-muted-foreground">
                  ${currentRole.pay}/milestone
                </span> */}
                <Button
                  size="sm"
                  onClick={() => setShowAddTaskModal(true)}
                  className="ml-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {currentRole.description}
              </p>
              {currentRole.contractor_id && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    Contractor Assigned
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Kanban Board */}
      {currentRole && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {columns.map(renderColumn)}
          </div>
        </DragDropContext>
      )}

      {!currentRole?.contractor_id && (
        <div className="text-center py-8 glass-card rounded-lg border border-border/50">
          <User className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Contractor Assigned</h3>
          <p className="text-muted-foreground">
            Assign a contractor to this role to start managing tasks.
          </p>
        </div>
      )}

      {/* Add Task Modal */}
      {currentRole && (
        <AddTaskModal
          isOpen={showAddTaskModal}
          onClose={() => setShowAddTaskModal(false)}
          roleId={currentRole.id.toString()}
          onTaskAdded={refreshTasks}
        />
      )}

      {/* Edit Task Modal */}
      <EditTaskModal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        task={editingTask}
        onTaskUpdated={refreshTasks}
      />

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={feedbackModal.isOpen}
        onClose={() => setFeedbackModal({ isOpen: false })}
        onSubmit={handleFeedbackSubmit}
        title="Rate Task Completion"
        description={`Please rate the quality of work for "${feedbackModal.taskName}" and provide feedback.`}
      />
    </div>
  );
}