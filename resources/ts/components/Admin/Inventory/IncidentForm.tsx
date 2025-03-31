import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Incidence } from '@/types/Incident';
import { saveIncidence } from '@/api/service/incidentService';

interface IncidentFormProps {
  elementId: number;
  onClose: () => void;
}

const IncidentForm: React.FC<IncidentFormProps> = ({ elementId, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Abierta');

  const handleSubmit = async () => {
    const newIncidence: Incidence = {
      name,
      description,
      status,
      element_id: elementId,
    };

    try {
      // await saveIncidence(newIncidence);
      console.log(newIncidence);
      onClose();
    } catch (error) {
      console.error('Error al crear la incidencia:', error);
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-bold mb-2">Añadir Incidendcia</h3>
      <div className="mb-4">
        <label className="block mb-1">Nombre:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-inputtext p-component w-full"
          placeholder="Nombre de la incidencia"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Descripción:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="p-inputtext p-component w-full"
          placeholder="Descripción de la incidencia"
        />
      </div>
      <div className="flex justify-end">
        <Button
          label="Guardar"
          onClick={handleSubmit}
          className="p-button-success"
        />
        <Button
          label="Cancelar"
          onClick={onClose}
          className="p-button-secondary ml-2"
        />
      </div>
    </div>
  );
};

export default IncidentForm;
