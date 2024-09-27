import React, { useState } from "react";
import { useGetusersQuery, useUpdatestatusMutation } from "../../store/slice/Userapislice";
import { toast } from "react-toastify";

interface User {
  _id: string;
  username: string;
  email: string;
  is_blocked: boolean;
}

const UserList: React.FC = () => {
  const [search, setSearch] = useState<string>('');
  const { data: users, isLoading, error, refetch } = useGetusersQuery();
  const [updatestatus] = useUpdatestatusMutation();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const toggleBlockStatus = async (userId: string, currentStatus: boolean) => {
    if (!userId) {
      console.error("Invalid user ID:", userId);
      alert("Invalid user ID. Please try again.");
      return;
    }

    try {
      const newStatus = !currentStatus;
      console.log(`Updating status for user ${userId} to ${newStatus}`);

      const response = await updatestatus({ id: userId, is_blocked: newStatus }).unwrap();
      console.log("The response in the frontend", response);

      if (response && response.success) {
        console.log("Status updated successfully");
        refetch(); // Refetch the user list to ensure we have the latest data
      } else {
        console.error("Failed to update status: Unexpected response format");
        toast.error("Failed to update status. Please try again.");
        refetch(); // Refetch to ensure UI is in sync with server state
      }
    } catch (error) {
      console.error("Error while updating status:", error);
      alert("An error occurred while updating the status. Please check your network and try again.");
      refetch(); // Refetch to ensure UI is in sync with server state
    }
  };

  const filteredUsers = users?.filter((user: User) =>
    user.username.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="user-list-container" style={{ padding: '20px' }}>
      <h2>User List</h2>
      <input
        type="text"
        placeholder="Search by name, email"
        value={search}
        onChange={handleSearch}
        style={{
          marginBottom: '20px',
          padding: '10px',
          width: '300px',
          borderRadius: '5px',
          border: '1px solid #ddd'
        }}
      />
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error loading users</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '10px', textAlign: 'center' }}>No</th>
              <th style={{ padding: '10px' }}>Name</th>
              <th style={{ padding: '10px' }}>Email</th>
              <th style={{ padding: '10px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers?.map((user: User, index: number) => (
              <tr key={user._id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '10px', textAlign: 'center' }}>{index + 1}</td>
                <td style={{ padding: '10px' }}>{user.username}</td>
                <td style={{ padding: '10px' }}>{user.email}</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>
                  <button
                    onClick={() => toggleBlockStatus(user._id, user.is_blocked)}
                    style={{
                      padding: '5px 15px',
                      backgroundColor: user.is_blocked ? '#dc3545' : '#007bff',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    {user.is_blocked ? 'Unblock' : 'Block'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserList;