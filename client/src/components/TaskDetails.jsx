import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function TaskDetails(){
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const nav = useNavigate();
  useEffect(()=> { api.get(`/tasks/${id}`).then(r=>setTask(r.data)).catch(()=>nav('/')); }, [id]);
  if (!task) return <div>Loading...</div>;
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button onClick={()=>nav(-1)} className="mb-4 underline">Back</button>
      <h2 className="text-2xl font-bold">{task.title}</h2>
      <div className="text-sm text-gray-600">Priority: {task.priority} • Status: {task.status}</div>
      <div className="mt-4">{task.description}</div>
      <div className="mt-4 text-gray-700">Due: {task.dueDate ? new Date(task.dueDate).toLocaleString() : '—'}</div>
      <div className="mt-2 text-gray-700">Assigned to: {task.assignedTo?.name || 'Unassigned'}</div>
    </div>
  );
}
