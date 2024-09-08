import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLoading } from "../context/LoadingContext";
import Loader from "./Loader";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const { loading, showLoading, hideLoading } = useLoading();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = JSON.parse(localStorage.getItem("token"));
    showLoading();

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
      hideLoading();
    }
  };

  const deleteUser = async (userId) => {
    showLoading(); // Show loader when performing the delete operation
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/admin/deleteUser/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      hideLoading(); // Hide loader after operation completes
    }
  };

  if (loading) return <Loader />; // Show loader while loading

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 dark:text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <div className="bg-white dark:bg-gray-800 dark:border-gray-700 shadow-md rounded-lg p-4 mb-4">
        <h2 className="text-xl font-semibold mb-2">Manage Users</h2>
        {users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Profile
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Premium
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <img
                        src={
                          user.profileLink || "https://via.placeholder.com/50"
                        }
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {user.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {user.premiumSubscription ? (
                        <span className="bg-green-100 dark:bg-green-500 text-green-800 dark:text-white py-1 px-2 rounded-full text-xs font-semibold">
                          Yes
                        </span>
                      ) : (
                        <span className="bg-red-100 dark:bg-red-500 text-red-800 dark:text-white py-1 px-2 rounded-full text-xs font-semibold">
                          No
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {user.isActive ? (
                        <span className="bg-green-100 dark:bg-green-500 text-green-800 dark:text-white py-1 px-2 rounded-full text-xs font-semibold">
                          Active
                        </span>
                      ) : (
                        <span className="bg-gray-100 dark:bg-gray-500 text-gray-800 dark:text-white py-1 px-2 rounded-full text-xs font-semibold">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => deleteUser(user._id)}
                        className="bg-red-500 dark:bg-red-700 text-white py-1 px-3 rounded hover:bg-red-600 dark:hover:bg-red-800"
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
      {loading && <Loader />}
    </div>
  );
};

export default Admin;
