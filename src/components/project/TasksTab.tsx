import { useState } from 'react';
import { Project, Task, TaskStatus } from '@/types/entities';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AddTaskModal } from './AddTaskModal';
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
  User
} from 'lucide-react';

interface TasksTabProps {
  project: Project;
}

interface TaskColumn {
  id: TaskStatus;
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
  const { state, dispatch } = useApp();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState<{
    isOpen: boolean;
    taskId?: string;
    taskName?: string;
  }>({ isOpen: false });

  const milestoneRoles = project.roles.filter(role => role.type === 'Milestone');
  const currentRole = selectedRole 
    ? milestoneRoles.find(r => r.id === selectedRole)
    : milestoneRoles[0];

  const getContractorById = (id: string) => {
    return state.contractors.find(c => c.id === id);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !currentRole) return;

    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId as TaskStatus;
    const task = currentRole.tasks?.find(t => t.id === taskId);

    // If moving to "Accepted", trigger feedback modal and payment sync
    if (newStatus === 'Accepted' && task) {
      setFeedbackModal({
        isOpen: true,
        taskId: task.id,
        taskName: task.name
      });
      
      // Move task amount to payments section (visual sync)
      dispatch({
        type: 'ADD_PAYMENT',
        payload: {
          id: `payment-${Date.now()}`,
          contractorId: currentRole.assignedContractor!,
          roleId: currentRole.id,
          taskId: task.id,
          amount: task.price,
          currency: 'AUD',
          status: 'Pending',
          auditLog: [],
          createdAt: new Date().toISOString()
        }
      });
    }

    dispatch({
      type: 'UPDATE_TASK_STATUS',
      payload: { id: taskId, status: newStatus }
    });
  };

  const handleFeedbackSubmit = (rating: number, feedback: string) => {
    // Here you would typically save the feedback to your backend
    console.log('Task feedback submitted:', { 
      taskId: feedbackModal.taskId, 
      rating, 
      feedback 
    });
    
    setFeedbackModal({ isOpen: false });
  };

  const renderTaskCard = (task: Task, index: number) => {
    const contractor = currentRole?.assignedContractor 
      ? getContractorById(currentRole.assignedContractor)
      : null;

    return (
      <Draggable key={task.id} draggableId={task.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`glass-card border border-border/50 rounded-lg p-4 mb-3 transition-all ${
              snapshot.isDragging ? 'rotate-3 shadow-lg' : 'hover:shadow-md'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <h4 className="font-medium text-sm line-clamp-2">{task.name}</h4>
                <Badge variant="outline" className="text-xs">
                  ${task.price}
                </Badge>
              </div>

              {task.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {task.description}
                </p>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {contractor && (
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={contractor.profilePicture} />
                      <AvatarFallback className="text-xs">
                        {contractor.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  {task.deliverables && task.deliverables.length > 0 && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Paperclip className="w-3 h-3" />
                      {task.deliverables.length}
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
    const tasks = currentRole?.tasks?.filter(task => task.status === column.id) || [];

    return (
      <div key={column.id} className="flex-1 min-h-[500px]">
        <div className={`${column.color} rounded-lg p-4 h-full`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm">{column.title}</h3>
              <Badge variant="secondary" className="text-xs">
                {tasks.length}
              </Badge>
            </div>
            {column.id === 'Pending' && currentRole?.type === 'Milestone' && 
             currentRole?.status === 'open' && !currentRole?.assignedContractor && (
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
                {tasks.map((task, index) => renderTaskCard(task, index))}
                {provided.placeholder}
                
                {tasks.length === 0 && (
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
          {milestoneRoles.map(role => {
            const contractor = role.assignedContractor ? getContractorById(role.assignedContractor) : null;
            
            return (
              <Button
                key={role.id}
                variant={selectedRole === role.id || (!selectedRole && role === milestoneRoles[0]) ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRole(role.id)}
                className="flex items-center gap-2"
              >
                {contractor && (
                  <Avatar className="w-4 h-4">
                    <AvatarImage src={contractor.profilePicture} />
                    <AvatarFallback className="text-xs">
                      {contractor.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                )}
                {role.name}
                {role.tasks && (
                  <Badge variant="secondary" className="text-xs">
                    {role.tasks.length}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
      )}

      {/* Current Role Info */}
      {currentRole && (
        <Card className="glass-card border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{currentRole.name}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Milestone Role</Badge>
                <span className="text-sm text-muted-foreground">
                  ${currentRole.payRate}/milestone
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {currentRole.description}
              </p>
              {currentRole.assignedContractor && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    {getContractorById(currentRole.assignedContractor)?.name}
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

      {!currentRole?.assignedContractor && (
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
          roleId={currentRole.id}
        />
      )}

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