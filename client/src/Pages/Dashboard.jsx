import React, { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import TaskModal from '../components/TaskModal';
import TaskCard from '../components/Taskcard';
import Pagination from '../components/Pagination';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useNavigate } from 'react-router-dom';

const priorities = ['High','Medium','Low'];
const colors = { High: 'bg-red-100', Medium: 'bg-amber-100', Low: 'bg-green-100' };

export default function Dashboard() {
  const { user, removeToken, setUser } = useContext(AuthContext);
  const [tasksByPriority, setTasksByPriority] = useState({ High: [], Medium: [], Low: [] });
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const navigate = useNavigate()

  async function loadTasks(p=1) {
    try {
      const res = await api.get('/tasks', { params: { page: p, limit: 50 } }); // get many so columns look full
      const arr = res.data.tasks;
      const grouped = { High: [], Medium: [], Low: [] };
      arr.forEach(t => grouped[t.priority || 'Medium'].push(t));
      setTasksByPriority(grouped);
      setPages(res.data.pages);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => { loadTasks(page); }, [page]);

  // DnD handler: when dropped, update backend priority and update local state
  const onDragEnd = async result => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;
    const from = source.droppableId;
    const to = destination.droppableId;
    if (from === to) return;

    // optimistic update
    const task = tasksByPriority[from].find(t => t._id === draggableId);
    const newFrom = tasksByPriority[from].filter(t => t._id !== draggableId);
    const newTo = [task, ...tasksByPriority[to]];
    setTasksByPriority(prev => ({ ...prev, [from]: newFrom, [to]: newTo }));

    // patch server
    try {
      await api.patch(`/tasks/${draggableId}/priority`, { priority: to });
    } catch (err) {
      alert('Failed to move on server');
      loadTasks(page);
    }
  };

  return (
    <div className="p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <div className="flex items-center gap-3">
          <div>{user?.name} ({user?.role})</div>
          <button onClick={()=>{
            removeToken()
            setUser()
            navigate('/login')
          }}className="px-4 py-2 bg-red-500 text-white rounded">LogOut</button>
          <button onClick={()=>setOpenModal(true)} className="px-4 py-2 bg-indigo-600 text-white rounded">New Task</button>
        </div>
      </header>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-3 gap-4">
          {priorities.map(pr => (
            <div key={pr} className={`p-4 rounded ${colors[pr]}`}>
              <h2 className="font-semibold mb-3">{pr}</h2>
              <Droppable droppableId={pr}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-3 min-h-[200px]">
                    {tasksByPriority[pr].map((task, idx) => (
                      <Draggable key={task._id} draggableId={task._id} index={idx}>
                        {(prov) => (
                          <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps}>
                            <TaskCard task={task} onEdit={(t)=>{ setEditTask(t); setOpenModal(true); }} onChange={()=>loadTasks(page)} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      <div className="mt-6">
        <Pagination page={page} pages={pages} onChange={(p)=>{ setPage(p); }} />
      </div>

      {openModal && <TaskModal onClose={()=>{ setOpenModal(false); setEditTask(null); loadTasks(page); }} editTask={editTask} />}
    </div>
  );
}
