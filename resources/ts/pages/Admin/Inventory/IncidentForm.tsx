import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import React, { useCallback, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { saveIncidence } from '@/api/service/incidentService';
import { fetchElementsAsync } from '@/store/slice/elementSlice';
import { AppDispatch } from '@/store/store';
import { Incidence, IncidentStatus } from '@/types/Incident';

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
  const [status] = useState(IncidentStatus.open);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const toast = useRef<Toast>(null);

  const handleSubmit = useCallback(async () => {
    if (!name.trim()) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Atención',
        detail: 'El nombre de la incidencia es obligatorio',
      });
      return;
    }

    setIsSubmitting(true);

    const newIncidence: Incidence = {
      name,
      description,
      status,
      element_id: elementId,
    };

    try {
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
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo crear la incidencia',
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [
    name,
    description,
    status,
    elementId,
    dispatch,
    onBackToIncidents,
    onClose,
  ]);

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <div className="mb-4">
        <label className="block mb-1">Nombre:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-inputtext p-component w-full"
          placeholder="Nombre de la incidencia"
          disabled={isSubmitting}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Descripción:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="p-inputtext p-component w-full"
          placeholder="Descripción de la incidencia"
          disabled={isSubmitting}
          rows={4}
        />
      </div>
      <div className="flex justify-end gap-4">
        <Button
          label="Guardar"
          onClick={handleSubmit}
          className="p-button-success"
          disabled={isSubmitting}
          icon="pi pi-save"
        />
        <Button
          label="Cancelar"
          onClick={onBackToIncidents || onClose}
          className="p-button-secondary"
          disabled={isSubmitting}
        />
      </div>
    </div>
  );
};

export default IncidentForm;
