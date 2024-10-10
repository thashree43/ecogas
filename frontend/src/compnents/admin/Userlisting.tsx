import React, { useState, useMemo, useCallback } from "react";
import { useGetusersQuery, useUpdatestatusMutation } from "../../store/slice/Adminslice";
import { toast } from "react-toastify";
import { User } from "../../interfacetypes/type";
import debounce from 'lodash.debounce';

const UserList: React.FC = () => {
  const [search, setSearch] = useState<string>('');
  const { data: users, isLoading, error } = useGetusersQuery();
  const [updatestatus] = useUpdatestatusMutation();

  // Debounced search function
  const debouncedSearch = useMemo(
    () =>
      debounce((searchTerm: string) => {
        setSearch(searchTerm);
      }, 300),
    []
  );

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      debouncedSearch(e.target.value);
    },
    [debouncedSearch]
  );

  const toggleBlockStatus = async (userId: string, currentStatus: boolean) => {
    if (!userId) {
      console.error("Invalid user ID:", userId);
      toast.error("Invalid user ID. Please try again.");
      return;
    }

    try {
      const newStatus = !currentStatus;
      const result = await updatestatus({ id: userId, is_blocked: newStatus }).unwrap();
      if (result.success) {
        toast.success("User status updated successfully");
      } else {
        toast.error("Failed to update user status");
      }
    } catch (error) {
      console.error("Error while updating status:", error);
      toast.error("An error occurred while updating the status. Please try again.");
    }
  };

  const filteredUsers = useMemo(() => {
    return users?.filter((user: User) =>
      user.username.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  return (
    <div className="user-list-container" style={{ padding: '20px' }}>
      <h2>User List</h2>
      <input
        type="text"
        placeholder="Search by name, email"
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