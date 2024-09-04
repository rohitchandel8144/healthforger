import React, { useState, useEffect } from "react";
import axios from "axios";
import { json } from "react-router-dom";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
   
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = JSON.parse(localStorage.getItem("token"));

    try {
      const usersResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/getUsers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(usersResponse.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  const deleteUser = async (userId) => {
    
    try {
      const token= JSON.parse(localStorage.getItem('token'));
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/deleteUser/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6">Error: {error}</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <div className="bg-white shadow-md rounded-lg p-4 mb-4">
        <h2 className="text-xl font-semibold mb-2">Manage Users</h2>
        {users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Premium</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <img src={user.profileLink || 'https://via.placeholder.com/50'} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.premiumSubscription ? (
                        <span className="bg-green-100 text-green-800 py-1 px-2 rounded-full text-xs font-semibold">Yes</span>
                      ) : (
                        <span className="bg-red-100 text-red-800 py-1 px-2 rounded-full text-xs font-semibold">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {user.isActive ? (
                        <span className="bg-green-100 text-green-800 py-1 px-2 rounded-full text-xs font-semibold">Active</span>
                      ) : (
                        <span className="bg-gray-100 text-gray-800 py-1 px-2 rounded-full text-xs font-semibold">Inactive</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => deleteUser(user._id)}
                        className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No users found.</p>
        )}
      </div>
    </div>
  );
};

export default Admin;
