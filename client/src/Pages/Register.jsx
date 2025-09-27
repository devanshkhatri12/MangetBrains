import React, { useState, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('')
  const [role,setRole] = useState('user')
  const { setUser, setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/register', { email, password, name, role });
      setToken(data.token);
      setUser(data.user);
      navigate('/');
    } catch (err) {
        console.log(err)
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form onSubmit={submit} className="bg-white p-8 rounded shadow w-full max-w-md">
        <h2 className="text-2xl mb-4 font-semibold">Sign Up</h2>
        <input required value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border mb-3 rounded" />
        <input required type='text' value={name} onChange={e=>setName(e.target.value)} placeholder='Username' className='w-full p-2 border mb-4 rounded' />
        <input required type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full p-2 border mb-4 rounded" />
        <button className="w-full py-2 bg-indigo-600 text-white rounded">Register</button>
      </form>
    </div>
  );
}
