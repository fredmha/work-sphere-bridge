import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  FileText,
  Clock,
  CheckCircle2,
  TrendingUp,
  Inbox
} from 'lucide-react';

const statIcons = {
  total: FileText,
  pending: Clock,
  accepted: CheckCircle2,
  rate: TrendingUp
};

export default function ApplicationStats({ applications, onStatClick }) {
  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending' || app.status === 'interview').length,
    accepted: applications.filter(app => app.status === 'active' || app.status === 'completed').length,
  };
  const successRate = stats.total > 0 ? Math.round((stats.accepted / stats.total) * 100) : 0;

  const statCards = [
    { title: 'Total Applications', value: stats.total, key: 'all' },
    { title: 'Pending Review', value: stats.pending, key: 'pending' },
    { title: 'Accepted', value: stats.accepted, key: 'active' },
    { title: 'Success Rate', value: `${successRate}%`, key: 'rate' }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards.map((stat) => {
        const Icon = statIcons[stat.key] || Inbox;
        return (
          <Card
            key={stat.key}
            className={`border-0 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer ${stat.key !== 'rate' ? '' : 'cursor-default'}`}
            onClick={() => stat.key !== 'rate' && onStatClick(stat.key)}
          >
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Icon className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}