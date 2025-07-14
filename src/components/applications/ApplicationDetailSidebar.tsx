
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  X,
  Send,
  MessageSquare,
  DollarSign,
  Briefcase,
  Clock,
  ExternalLink,
  ClipboardList,
  Plus,
  CheckCircle2, // Kept for statusConfig
  Circle,       // Kept for statusConfig
  AlertCircle   // Kept for statusConfig
} from 'lucide-react';
import { MessageService } from '@/entities/MessageService';
import { TaskService } from '@/entities/TaskService';
import ApplicationProgressStepper from './ApplicationProgressStepper.tsx';


const statusConfig = {
  pending: {
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
    label: "Pending",
    icon: Circle
  },
  delivered: {
    className: "bg-blue-100 text-blue-800 border-blue-200",
    label: "Delivered",
    icon: CheckCircle2
  },
  decision_pending: {
    className: "bg-orange-100 text-orange-800 border-orange-200",
    label: "Decision Pending",
    icon: AlertCircle
  },
  accepted: {
    className: "bg-green-100 text-green-800 border-green-200",
    label: "Accepted",
    icon: CheckCircle2
  },
  rejected: {
    className: "bg-red-100 text-red-800 border-red-200",
    label: "Rejected",
    icon: X
  },
  active: { // Added for 'active' status
    className: "bg-green-100 text-green-800 border-green-200",
    label: "Active",
    icon: CheckCircle2
  }
};

const paymentTypeConfig = {
  hourly: { label: 'Hourly Project', icon: Clock },
  task_based: { label: 'Task-Based Project', icon: ClipboardList }
};

export default function ApplicationDetailSidebar({ application, onClose, isOpen }) {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (application?.id) {
      loadMessages();
      if (application.payment_type === 'task_based') {
        loadTasks();
      }
    }
  }, [application]); // Changed dependency to 'application' as per outline

  const loadMessages = async () => {
    if (!application?.id) return;
    try {
      const messageData = await MessageService.filter({ application_id: application.id });
      setMessages(messageData);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const loadTasks = async () => {
    if (!application?.id) return;
    try {
      const taskData = await TaskService.filter({ application_id: application.id });
      setTasks(taskData);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !application?.id) return;

    setIsSending(true);
    try {
      await MessageService.create({
        application_id: application.id,
        content: newMessage.trim(),
        sender: 'contractor',
        timestamp: new Date().toISOString()
      });
      setNewMessage('');
      await loadMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
    setIsSending(false);
  };

  if (!isOpen || !application) return null;

  const PaymentIcon = paymentTypeConfig[application.payment_type]?.icon || DollarSign;
  const StatusIcon = statusConfig[application.status]?.icon || Circle; // Still needed for the status badge

  const renderPaymentDetails = () => {
    if (application.payment_type === 'hourly') {
      return (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Hourly Rate</p>
            <p className="font-semibold text-gray-900">${application.hourly_rate}/hr</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Est. Weekly Hours</p>
            <p className="font-semibold text-gray-900">{application.estimated_weekly_hours} hrs</p>
          </div>
        </div>
      );
    }
    if (application.payment_type === 'task_based') {
      const completedTasks = tasks.filter(t => t.status === 'approved' || t.status === 'completed'); // Assuming 'approved' or 'completed' tasks contribute to earnings
      const earnings = completedTasks.reduce((sum, task) => sum + task.price, 0);
      return (
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Total Project Value</p>
            <p className="font-semibold text-gray-900">${application.total_task_price}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Earnings to Date</p>
            <p className="font-semibold text-green-600">${earnings.toFixed(2)}</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-500">Tasks</h4>
            {tasks.length === 0 ? (
                <p className="text-sm text-gray-500">No tasks defined yet.</p>
            ) : (
                tasks.map(task => (
                    <div key={task.id} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                        <span className="text-sm text-gray-800">{task.description}</span>
                        <span className="text-sm font-semibold text-gray-900">${task.price.toFixed(2)}</span>
                    </div>
                ))
            )}
             {application.status === 'active' && (
                <Button variant="outline" size="sm" className="w-full mt-2">
                    <Plus className="w-4 h-4 mr-2" /> Submit Task
                </Button>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const renderActionButtons = () => {
    if (application.status === 'active') {
        const buttonText = application.payment_type === 'hourly' ? 'Submit Timesheet' : 'Submit Task for Review';
        return (
            <Button className="w-full bg-green-600 hover:bg-green-700">
                <ClipboardList className="w-4 h-4 mr-2" /> {buttonText}
            </Button>
        );
    }
    return (
        <Button className="w-full" variant="outline">
            <ExternalLink className="w-4 h-4 mr-2" /> View Project Details
        </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40" onClick={onClose}></div>
      {/* Sidebar */}
      <div className="relative w-full max-w-lg bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{application.project_name}</h2>
            <p className="text-gray-600">{application.role} @ {application.company}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Status Badge - Re-added as it's a critical application detail */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <Badge
            variant="outline"
            className={`${statusConfig[application.status]?.className} font-medium text-sm px-3 py-1`}
          >
            <StatusIcon className="w-4 h-4 mr-2" />
            {statusConfig[application.status]?.label}
          </Badge>
          {application.status === 'active' && application.payment_type === 'hourly' && application.hours_per_week && (
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-1 text-gray-500" />
              <span>{application.hours_per_week} hrs/week</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="sticky top-0 bg-white z-10 grid grid-cols-3 w-full rounded-none border-b border-gray-200">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="messages">
                Messages
                {messages.length > 0 && (
                  <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                    {messages.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="p-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <PaymentIcon className="w-5 h-5 text-gray-600" />
                    {paymentTypeConfig[application.payment_type]?.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>{renderPaymentDetails()}</CardContent>
              </Card>

              {application.description && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Briefcase className="w-5 h-5 text-gray-600" />
                        Project Description
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-900 leading-relaxed">{application.description}</p>
                    </CardContent>
                  </Card>
              )}


              <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <MessageSquare className="w-5 h-5 text-gray-600" />
                        Chat
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                     <Textarea
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        rows={3}
                        className="resize-none"
                     />
                     <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || isSending}
                        className="w-full bg-green-600 hover:bg-green-700"
                     >
                        <Send className="w-4 h-4 mr-2" />
                        {isSending ? 'Sending...' : 'Send Message'}
                     </Button>
                </CardContent>
              </Card>

              {renderActionButtons()}
            </TabsContent>

            <TabsContent value="messages" className="p-6 space-y-4">
              {/* Message history */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No messages yet</h3>
                    <p className="text-gray-500">Start a conversation with your client.</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'contractor' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender === 'contractor'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'contractor' ? 'text-green-100' : 'text-gray-500'
                        }`}>
                          {format(new Date(message.timestamp || message.created_date), 'MMM d, h:mm a')}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="timeline" className="p-6">
                <ApplicationProgressStepper currentStatus={application.status} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
