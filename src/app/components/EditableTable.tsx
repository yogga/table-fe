
import React, { useEffect, useState } from 'react';  
import axios from 'axios';  

type User = {  
  id: number;  
  name: string;  
  email: string;  
};  

const EditableTable = () => {  
  const [users, setUsers] = useState<User[]>([]);  
  const [name, setName] = useState<string>('');  
  const [email, setEmail] = useState<string>('');  
  const [editingUser, setEditingUser] = useState<User | null>(null);  

  useEffect(() => {  
    const fetchUsers = async () => {  
      try {  
        const response = await axios.get('http://localhost:3000/api/users');  
        setUsers(response.data);  
      } catch (error) {  
        console.error('Error fetching users:', error);  
      }  
    };  
    fetchUsers();  
  }, []);  

  const handleAddUser = async (e: React.FormEvent) => {  
    e.preventDefault();  
    if (!name || !email) return;  

    const newUser = { name, email };  
    try {  
      const response = await axios.post('http://localhost:3000/api/users', newUser);  
      setUsers([...users, response.data]);  
      setName('');  
      setEmail('');  
    } catch (error) {  
      console.error('Error adding user:', error);  
    }  
  };  

  const handleEditUser = async (id: number) => {  
    if (!editingUser) return;  

    const updatedUser = { ...editingUser, name, email };  
    try {  
      const response = await axios.put(`http://localhost:3000/api/users/${id}`, updatedUser);  
      const updatedUsers = users.map(user =>  
        user.id === id ? response.data : user  
      );  
      setUsers(updatedUsers);  
      setEditingUser(null);  
      setName('');  
      setEmail('');  
    } catch (error) {  
      console.error('Error updating user:', error);  
    }  
  };  

  const handleDeleteUser = async (id: number) => {  
    try {  
      await axios.delete(`http://localhost:3000/api/users/${id}`);  
      setUsers(users.filter(user => user.id !== id));  
    } catch (error) {  
      console.error('Error deleting user:', error);  
    }  
  };  

  return (  
    <div>  
      <form onSubmit={handleAddUser}>  
        <input  
          type="text"  
          value={name}  
          onChange={e => setName(e.target.value)}  
          placeholder="Nama"  
        />  
        <input  
          type="email"  
          value={email}  
          onChange={e => setEmail(e.target.value)}  
          placeholder="Email"  
        />  
        <button type="submit">Tambah Pengguna</button>  
      </form>  
      <table>  
        <thead>  
          <tr>  
            <th>Nama</th>  
            <th>Email</th>  
            <th>Aksi</th>  
          </tr>  
        </thead>  
        <tbody>  
          {users.map(user => (  
            <tr key={user.id}>  
              <td>{user.name}</td>  
              <td>{user.email}</td>  
              <td>  
                <button onClick={() => setEditingUser(user)}>Edit</button>  
                <button onClick={() => handleDeleteUser(user.id)}>Hapus</button>  
              </td>  
            </tr>  
          ))}  
        </tbody>  
      </table>  
    </div>  
  );  
};  

export default EditableTable;