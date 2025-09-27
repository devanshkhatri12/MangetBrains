import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const priorities = ['High','Medium','Low'];

export default function TaskModal({ onClose, editTask }) {
  const [title, setTitle] = useState(editTask?.title || '');
  const [description, setDescription] = useState(editTask?.description || '');
  const [dueDate, setDueDate] = useState(editTask?.dueDate ? new Date(editTask.dueDate).toISOString().slice(0,10) : '');
  const [priority, setPriority] = useState(editTask?.priority || 'Medium');
  const [users, setUsers] = useState([]);
  const [assignedTo, setAssignedTo] = useState(editTask?.assignedTo?._id || '');

  useEffect(()=> {
    // if admin, fetch users to assign (fail silently if not)
    api.get('/users').then(r=>setUsers(r.data)).catch(()=>{});
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editTask) {
        await api.put(`/tasks/${editTask._id}`, { title, description, dueDate, priority, assignedTo });
      } else {
        await api.post('/tasks', { title, description, dueDate, priority, assignedTo });
      }
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <form onSubmit={submit} className="bg-white p-6 rounded w-full max-w-lg">
        <h3 className="text-xl mb-3">{editTask ? 'Edit Task' : 'Create Task'}</h3>
        <input required value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="w-full p-2 border mb-2 rounded" />
        <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Description" className="w-full p-2 border mb-2 rounded" />
        <div className="flex gap-2 mb-2">
          <input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} className="p-2 border rounded" />
          <select value={priority} onChange={e=>setPriority(e.target.value)} className="p-2 border rounded">
            {priorities.map(p => <option value={p} key={p}>{p}</option>)}
          </select>
          <select value={assignedTo} onChange={e=>setAssignedTo(e.target.value)} className="p-2 border rounded">
            <option value=''>Assign to (me)</option>
            {users.map(u => <option value={u._id} key={u._id}>{u.name}</option>)}
          </select>
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-3 py-1">Cancel</button>
          <button className="px-3 py-1 bg-indigo-600 text-white rounded">{editTask ? 'Update' : 'Create'}</button>
        </div>
      </form>
    </div>
  );
}
