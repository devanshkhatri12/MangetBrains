import React from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function TaskCard({ task, onEdit, onChange }) {
  const nav = useNavigate();
  const markComplete = async () => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    await api.patch(`/tasks/${task._id}/status`, { status: newStatus });
    onChange();
  };
  const remove = async () => {
    if (!confirm('Delete this task?')) return;
    await api.delete(`/tasks/${task._id}`);
    onChange();
  };

  return (
    <div className="bg-white p-3 rounded shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">{task.title}</h3>
          <div className="text-sm text-gray-600">Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}</div>
          <div className="text-sm text-gray-600">Assigned: {task.assignedTo?.name || 'Unassigned'}</div>
        </div>
        <div className="text-sm">
          <div className={`px-2 py-1 rounded text-xs ${task.status === 'completed' ? 'bg-green-200' : 'bg-yellow-100'}`}>
            {task.status}
          </div>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <button onClick={()=>nav(`/task/${task._id}`)} className="text-sm underline">View</button>
        <button onClick={()=>onEdit(task)} className="text-sm underline">Edit</button>
        <button onClick={markComplete} className="text-sm underline">{task.status === 'completed' ? 'Mark Pending' : 'Mark Complete'}</button>
        <button onClick={remove} className="text-sm text-red-600">Delete</button>
      </div>
    </div>
  );
}
