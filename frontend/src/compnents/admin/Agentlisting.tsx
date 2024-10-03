import React, { useCallback, useMemo, useState } from "react";
import { useGetallagentQuery, useUpdateapprovalMutation } from "../../store/slice/Adminslice";
import { toast } from "react-toastify";
import {Agent} from "../../interfacetypes/type"
import debounce from 'lodash.debounce';



const AgentList: React.FC = () => {
  const [search, setSearch] = useState<string>('');
  const { data, isLoading, error } = useGetallagentQuery();
  const [updateApproval] = useUpdateapprovalMutation();

  const agents = data?.agents as Agent[] | undefined;
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

  const filteredUsers =useMemo(()=>{
   return  agents?.filter((agent: Agent) =>
      agent.agentname.toLowerCase().includes(search.toLowerCase()) ||
      agent.email.toLowerCase().includes(search.toLowerCase())
);
  },[agents,search]) ;
  

  const handleActionClick = async (agent: Agent) => {
    if (!agent._id) {
      console.error("Invalid agent Id", agent._id);
      toast.error("Invalid agent Id");
      return;
    }

    try {
      const newStatus = !agent.is_Approved;
      const response = await updateApproval({ id: agent._id, is_Approved: newStatus }).unwrap();
      if (response.success) {
        toast.success("Approval status updated successfully");
      } else {
        toast.error("Failed to update approval status");
      }
    } catch (error) {
      console.error("Error while updating the status", error);
      toast.error("An error occurred while updating the status");
    }
  };

  return (
    <div className="user-list-container" style={{ padding: '20px' }}>
      <h2>Agent List</h2>
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
        <p>Error loading agents</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '10px', textAlign: 'center' }}>No</th>
              <th style={{ padding: '10px' }}>Name</th>
              <th style={{ padding: '10px' }}>Email</th>
              <th style={{ padding: '10px' }}>Pincode</th>
              <th style={{ padding: '10px' }}>Mobile</th>
              <th style={{ padding: '10px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers?.map((agent: Agent, index: number) => (
              <tr key={agent._id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '10px', textAlign: 'center' }}>{index + 1}</td>
                <td style={{ padding: '10px' }}>{agent.agentname}</td>
                <td style={{ padding: '10px' }}>{agent.email}</td>
                <td style={{ padding: '10px' }}>{agent.pincode}</td>
                <td style={{ padding: '10px' }}>
                  {agent.mobile}
                
                </td>
                <td style={{ padding: '10px', textAlign: 'center' }}>
                  <button
                    onClick={() => handleActionClick(agent)}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '5px',
                      border: 'none',
                      backgroundColor: agent.is_Approved ? 'red' : 'green',
                      color: 'white'
                    }}
                  >
                    {agent.is_Approved ? 'Reject' : 'Approve'}
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

export default AgentList;
