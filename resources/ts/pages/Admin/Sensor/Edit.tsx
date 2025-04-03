import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Icon } from '@iconify/react';

const EditSensor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    eui: '',
    name: '',
    longitude: '',
    latitude: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchSensor = async () => {
      try {
        const response = await axios.get(`/api/admin/sensors/${id}`);
        setFormData(response.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch sensor data');
      }
    };

    fetchSensor();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.put(`/api/admin/sensors/${id}`, formData);
      setSuccess('Sensor updated successfully!');
      setTimeout(() => navigate('/admin/sensors'), 2000); // Redirect after success
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-50 p-4 md:p-6">
      <Card className="w-full max-w-3xl shadow-lg">
        <header className="bg-blue-700 px-6 py-4 flex items-center -mt-6 -mx-6 rounded-t-lg">
          <Button
            className="p-button-text mr-4"
            style={{ color: '#fff' }}
            onClick={() => navigate('/admin/sensors')}>
            <Icon icon="tabler:arrow-left" className="h-6 w-6" />
          </Button>
          <h2 className="text-white text-3xl font-bold">Edit Sensor</h2>
        </header>
        <div className="p-6">
          {error && (
            <Message severity="error" text={error} className="mb-4 w-full" />
          )}
          {success && (
            <Message
              severity="success"
              text={success}
              className="mb-4 w-full"
            />
          )}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                EUI:
              </label>
              <input
                type="text"
                name="eui"
                value={formData.eui}
                onChange={handleChange}
                required
                className="p-inputtext w-full"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Name:
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="p-inputtext w-full"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Longitude:
              </label>
              <input
                type="text"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                className="p-inputtext w-full"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Latitude:
              </label>
              <input
                type="text"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                className="p-inputtext w-full"
              />
            </div>
            <div className="flex justify-end mt-4">
              <Button
                type="submit"
                icon="pi pi-check"
                label="Update Sensor"
                className="w-full md:w-auto"
              />
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default EditSensor;
