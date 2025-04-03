import React, { useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Incidence, IncidentStatus } from '@/types/Incident';
import { saveIncidence } from '@/api/service/incidentService';
import { AppDispatch } from '@/store/store';
import { useDispatch } from 'react-redux';
import { hideLoader, showLoader } from '@/store/slice/loaderSlice';
import { Toast } from 'primereact/toast';
import { fetchElementsAsync } from '@/store/slice/elementSlice';

interface IncidentFormProps {
  elementId: number;
  onClose: () => void;
  onBackToIncidents?: () => void;
}

const IncidentForm: React.FC<IncidentFormProps> = ({
  elementId,
  onClose,
  onBackToIncidents,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(IncidentStatus.open);
  const dispatch = useDispatch<AppDispatch>();
  const toast = useRef<Toast>(null);

  const handleSubmit = async () => {
    const newIncidence: Incidence = {
      name,
      description,
      status,
      element_id: elementId,
    };

    try {
      dispatch(showLoader());
      await saveIncidence(newIncidence);
      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Incidencia creada correctamente',
      });

      setName('');
      setDescription('');

      await dispatch(fetchElementsAsync());

      if (onBackToIncidents) {
        onBackToIncidents();
      } else {
        onClose();
      }
    } catch (error) {
      console.error('Error al crear la incidencia:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo crear la incidencia',
      });
    } finally {
      dispatch(hideLoader());
    }
  };

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <h3 className="text-lg font-bold mb-2">Añadir Incidencia</h3>
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
      <div className="flex justify-end gap-4">
        <Button
          label="Guardar"
          onClick={handleSubmit}
          className="p-button-success"
        />
        <Button
          label="Cancelar"
          onClick={onBackToIncidents || onClose}
          className="p-button-secondary"
        />
      </div>
    </div>
  );
};

export default IncidentForm;
