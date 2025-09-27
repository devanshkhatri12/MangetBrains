import React from 'react';

export default function Pagination({ page, pages, onChange }) {
  const arr = Array.from({ length: pages }, (_, i) => i + 1);
  if (pages <= 1) return null;
  return (
    <div className="flex gap-2">
      {arr.map(p => (
        <button key={p} onClick={()=>onChange(p)} className={`px-3 py-1 rounded ${p===page ? 'bg-indigo-600 text-white' : 'bg-white border'}`}>{p}</button>
      ))}
    </div>
  );
}
