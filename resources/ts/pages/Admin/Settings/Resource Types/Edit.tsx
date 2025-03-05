import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '@/api/axiosClient';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

export default function EditResourceType() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [resourceType, setResourceType] = useState({ name: '', description: '' });

  useEffect(() => {
    const fetchResourceType = async () => {
      try {
        const response = await axiosClient.get(`/admin/resource-types/${id}`);
        setResourceType(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchResourceType();
  }, [id]);

  const handleSave = async () => {
    try {
      await axiosClient.put(`/admin/resource-types/${id}`, resourceType);
      navigate('/admin/settings/resource-types');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Edit Resource Type</h2>
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
