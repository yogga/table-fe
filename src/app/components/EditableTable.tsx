"use client";  

import React, { useEffect, useState } from 'react';  
import axios from 'axios';  
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';  
import { faPlus, faSave, faUndo } from '@fortawesome/free-solid-svg-icons';  

type User = {  
  id: number;  
  firstName: string;  
  lastName: string;  
  position: string;  
  phone: string;  
  email: string;  
};  

const EditableTable = () => {  
  const [users, setUsers] = useState<User[]>([]);  
  const [newUser, setNewUser] = useState<User | null>(null);  
  const [sortConfig, setSortConfig] = useState({ key: 'firstName', direction: 'ascending' });  

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

  const handleAddUser = () => {  
    setNewUser({ id: Date.now(), firstName: '', lastName: '', position: '', phone: '', email: '' });  
  };  

  const handleSaveUser = async () => {  
    if (!newUser) return;  

    try {  
      const response = await axios.post('http://localhost:3000/api/users', newUser);  
      setUsers([...users, response.data]);  
      setNewUser(null);  
    } catch (error) {  
      console.error('Error adding user:', error);  
    }  
  };  

  const handleUndo = () => {  
    setNewUser(null);  
  };  

  const requestSort = (key) => {  
    let direction = 'ascending';  
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {  
      direction = 'descending';  
    }  
    setSortConfig({ key, direction });  
  };  

  const getSortIcon = (key) => {  
    if (sortConfig.key === key) {  
      return sortConfig.direction === 'ascending' ? '↑' : '↓';  
    }  
    return '';  
  };  

  const sortedUsers = [...users].sort((a, b) => {  
    if (a[sortConfig.key] < b[sortConfig.key]) {  
      return sortConfig.direction === 'ascending' ? -1 : 1;  
    }  
    if (a[sortConfig.key] > b[sortConfig.key]) {  
      return sortConfig.direction === 'ascending' ? 1 : -1;  
    }  
    return 0;  
  });  

  return (  
    <div>  
      <div className="table-controls">  
        <button onClick={handleAddUser}>  
          <FontAwesomeIcon icon={faPlus} /> Add  
        </button>  
        <button onClick={handleSaveUser} disabled={!newUser}>  
          <FontAwesomeIcon icon={faSave} /> Save  
        </button>  
        <button onClick={handleUndo} disabled={!newUser}>  
          <FontAwesomeIcon icon={faUndo} /> Undo  
        </button>  
      </div>  
      <table>  
        <thead>  
          <tr>  
            <th onClick={() => requestSort('firstName')}>  
              First Name {getSortIcon('firstName')}  
            </th>  
            <th onClick={() => requestSort('lastName')}>  
              Last Name {getSortIcon('lastName')}  
            </th>  
            <th onClick={() => requestSort('position')}>  
              Position {getSortIcon('position')}  
            </th>  
            <th onClick={() => requestSort('phone')}>  
              Phone {getSortIcon('phone')}  
            </th>  
            <th onClick={() => requestSort('email')}>  
              Email {getSortIcon('email')}  
            </th>  
          </tr>  
        </thead>  
        <tbody>  
          {newUser && (  
            <tr style={{ backgroundColor: '#e6ffe6' }}>  
              <td>  
                <input  
                  type="text"  
                  value={newUser.firstName}  
                  onChange={e => setNewUser({ ...newUser, firstName: e.target.value })}  
                  placeholder="First Name"  
                />  
              </td>  
              <td>  
                <input  
                  type="text"  
                  value={newUser.lastName}  
                  onChange={e => setNewUser({ ...newUser, lastName: e.target.value })}  
                  placeholder="Last Name"  
                />  
              </td>  
              <td>  
                <input  
                  type="text"  
                  value={newUser.position}  
                  onChange={e => setNewUser({ ...newUser, position: e.target.value })}  
                  placeholder="Position"  
                />  
              </td>  
              <td>  
                <input  
                  type="text"  
                  value={newUser.phone}  
                  onChange={e => setNewUser({ ...newUser, phone: e.target.value })}  
                  placeholder="Phone"  
                />  
              </td>  
              <td>  
                <input  
                  type="email"  
                  value={newUser.email}  
                  onChange={e => setNewUser({ ...newUser, email: e.target.value })}  
                  placeholder="Email"  
                />  
              </td>  
            </tr>  
          )}  
          {sortedUsers.map(user => (  
            <tr key={user.id}>  
              <td>{user.firstName}</td>  
              <td>{user.lastName}</td>  
              <td>{user.position}</td>  
              <td>{user.phone}</td>  
              <td>{user.email}</td>  
            </tr>  
          ))}  
        </tbody>  
      </table>  
    </div>  
  );  
};  

export default EditableTable;