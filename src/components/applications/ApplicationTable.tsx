import React from 'react';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Building2, User, ChevronRight, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

const statusConfig = {
  pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  interview: { label: "Interview", className: "bg-orange-100 text-orange-800 border-orange-200" },
  offer: { label: "Offer", className: "bg-purple-100 text-purple-800 border-purple-200" },
  active: { label: "Active", className: "bg-green-100 text-green-800 border-green-200" },
  completed: { label: "Completed", className: "bg-blue-100 text-blue-800 border-blue-200" },
  rejected: { label: "Rejected", className: "bg-red-100 text-red-800 border-red-200" },
};

const paymentTypeConfig = {
  hourly: { label: 'Hourly', className: 'border-blue-300 text-blue-700 bg-blue-50' },
  task_based: { label: 'Task-Based', className: 'border-purple-300 text-purple-700 bg-purple-50' }
};

export default function ApplicationTable({ applications, onSelectApplication, selectedApplicationId }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <Card className="overflow-hidden border-0 shadow-sm">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <div className="min-w-full">
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50/50 border-b border-gray-100 text-sm font-medium text-gray-600">
            <div className="col-span-1">Status</div>
            <div className="col-span-4">Project</div>
            <div className="col-span-2">Role</div>
            <div className="col-span-2">Payment</div>
            <div className="col-span-2">Company</div>
            <div className="col-span-1">Submitted</div>
          </div>
          
          {/* Rows */}
          <motion.div
            className="divide-y divide-gray-100"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {applications.map((app) => (
              <motion.div
                key={app.id}
                variants={itemVariants}
                onClick={() => onSelectApplication(app)}
                className={`grid grid-cols-12 gap-4 px-6 py-4 cursor-pointer transition-all duration-200 hover:bg-gray-50/50 ${
                  selectedApplicationId === app.id ? 'bg-green-50/50 border-l-4 border-l-green-500' : ''
                }`}
              >
                <div className="col-span-1 flex items-center">
                  <Badge 
                    variant="outline" 
                    className={`${statusConfig[app.status]?.className || ''} font-medium`}
                  >
                    {statusConfig[app.status]?.label || 'Unknown'}
                  </Badge>
                </div>
                
                <div className="col-span-4 flex items-center">
                  <div>
                    <p className="font-semibold text-gray-900 line-clamp-1">{app.project_name}</p>
                    {app.description && (
                      <p className="text-sm text-gray-500 line-clamp-1 mt-1">{app.description}</p>
                    )}
                  </div>
                </div>
                
                <div className="col-span-2 flex items-center">
                  <span className="font-medium text-gray-900">{app.role}</span>
                </div>
                
                <div className="col-span-2 flex items-center">
                  <Badge 
                    variant="outline" 
                    className={paymentTypeConfig[app.payment_type]?.className || ''}
                  >
                    {paymentTypeConfig[app.payment_type]?.label}
                  </Badge>
                </div>
                
                <div className="col-span-2 flex items-center">
                  <span className="text-gray-700">{app.company}</span>
                </div>
                
                <div className="col-span-1 flex items-center">
                  <span className="text-gray-700">
                    {format(new Date(app.submitted_date || app.created_date), 'M/d/yy')}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Mobile Card View */}
      <motion.div
        className="lg:hidden divide-y divide-gray-100"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {applications.map((app) => (
          <motion.div
            key={app.id}
            variants={itemVariants}
            onClick={() => onSelectApplication(app)}
            className={`p-4 cursor-pointer transition-all duration-200 hover:bg-gray-50/50 ${
              selectedApplicationId === app.id ? 'bg-green-50/50 border-l-4 border-l-green-500' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{app.project_name}</h3>
                <p className="text-sm text-gray-600 mt-1">{app.role} @ {app.company}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
            </div>
            
            <div className="flex items-center justify-between mb-3">
              <Badge 
                variant="outline" 
                className={`${statusConfig[app.status]?.className || ''} font-medium`}
              >
                {statusConfig[app.status]?.label || 'Unknown'}
              </Badge>
              <Badge 
                variant="outline" 
                className={paymentTypeConfig[app.payment_type]?.className || ''}
              >
                {paymentTypeConfig[app.payment_type]?.label}
              </Badge>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(app.submitted_date || app.created_date), 'MMM d, yyyy')}</span>
              </div>
              {app.payment_type === 'hourly' && app.hourly_rate && (
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  <span>${app.hourly_rate}/hr</span>
                </div>
              )}
              {app.payment_type === 'task_based' && app.total_task_price && (
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  <span>${app.total_task_price}</span>
                </div>
              )}
            </div>

            {app.description && (
              <p className="text-sm text-gray-500 mt-2 line-clamp-2">{app.description}</p>
            )}
          </motion.div>
        ))}
      </motion.div>
      
      {applications.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications found</h3>
          <p className="text-gray-500">Try adjusting your filters or creating a new application.</p>
        </div>
      )}
    </Card>
  );
}