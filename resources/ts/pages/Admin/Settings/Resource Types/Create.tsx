import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '@/api/axiosClient';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

export default function CreateResourceType() {
  const navigate = useNavigate();
  const [resourceType, setResourceType] = useState({ name: '', description: '' });

  const handleSave = async () => {
    try {
      await axiosClient.post('/admin/resource-types', resourceType);
      navigate('/admin/settings/resource-types');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Create Resource Type</h2>
      <div>
        <label>Name</label>
        <InputText
          value={resourceType.name}
          onChange={(e) => setResourceType({ ...resourceType, name: e.target.value })}
        />
      </div>
      <div>
        <label>Description</label>
        <InputText
          value={resourceType.description}
          onChange={(e) => setResourceType({ ...resourceType, description: e.target.value })}
        />
      </div>
      <Button label="Save" onClick={handleSave} />
    </div>
  );
}
