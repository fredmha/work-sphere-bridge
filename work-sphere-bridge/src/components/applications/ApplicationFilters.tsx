import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, X } from 'lucide-react';

const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'interview', label: 'Interview' },
  { value: 'offer', label: 'Offer' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'rejected', label: 'Rejected' },
];

const paymentTypeOptions = [
  { value: 'all', label: 'All Payment Types' },
  { value: 'hourly', label: 'Hourly' },
  { value: 'task_based', label: 'Task-Based' },
];

export default function ApplicationFilters({ filters, onFilterChange, onResetFilters }) {
  const handleValueChange = (type, value) => {
    onFilterChange(type, value === 'all' ? null : value);
  };

  const isFiltered = filters.status || filters.paymentType;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3">
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Filters:</span>
      </div>
      <Select value={filters.status || 'all'} onValueChange={(value) => handleValueChange('status', value)}>
        <SelectTrigger className="w-full sm:w-[180px] bg-white">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={filters.paymentType || 'all'} onValueChange={(value) => handleValueChange('paymentType', value)}>
        <SelectTrigger className="w-full sm:w-[180px] bg-white">
          <SelectValue placeholder="Filter by payment type" />
        </SelectTrigger>
        <SelectContent>
          {paymentTypeOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isFiltered && (
        <Button variant="ghost" size="sm" onClick={onResetFilters} className="text-gray-600 hover:text-gray-900">
          <X className="w-4 h-4 mr-1" />
          Reset
        </Button>
      )}
    </div>
  );
}