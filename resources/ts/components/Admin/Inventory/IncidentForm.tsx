import React, { useState } from 'react';
import { Button } from 'primereact/button';

interface IncidentFormProps {
  elementId: number;
  onClose: () => void;
}

const IncidentForm: React.FC<IncidentFormProps> = ({ elementId, onClose }) => {
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    // Aquí puedes manejar la lógica para enviar la incidencia
    console.log(`Incidencia para el elemento ${elementId}: ${description}`);
    onClose(); // Cerrar el modal después de enviar
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-bold mb-2">
        Añadir Incidencia para Elemento #{elementId}
      </h3>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descripción de la incidencia"
        className="w-full p-2 border border-gray-300 rounded"
      />
      <div className="flex justify-end mt-4">
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
