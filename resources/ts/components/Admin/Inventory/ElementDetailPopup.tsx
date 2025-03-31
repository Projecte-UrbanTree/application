import React, { useEffect, useRef, useState } from 'react';
import { Element } from '@/types/Element';
import { Button } from 'primereact/button';
import { TabView, TabPanel } from 'primereact/tabview';
import { Tag } from 'primereact/tag';
import { Calendar } from 'primereact/calendar';
import { Incidence, IncidentStatus } from '@/types/Incident';
import { deleteIncidence, fetchIncidence } from '@/api/service/incidentService';
import IncidentForm from './IncidentForm';
import { Dialog } from 'primereact/dialog';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { hideLoader, showLoader } from '@/store/slice/loaderSlice';
import { Toast } from 'primereact/toast';

interface ElementDetailPopupProps {
  element: Element;
  onClose: () => void;
  onOpenIncidentForm: () => void;
}

const ElementDetailPopup: React.FC<ElementDetailPopupProps> = ({
  element,
  onClose,
  onOpenIncidentForm,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [incidences, setIncidences] = useState<Incidence[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const toast = useRef<Toast>(null);
  useEffect(() => {
    const loadIncidences = async () => {
      try {
        const data = await fetchIncidence();

        if (Array.isArray(data)) {
          setIncidences(data.filter((i) => i.element_id === element.id));
        } else {
          setIncidences([]);
        }
      } catch (error) {
        setIncidences([]);
      }
    };

    loadIncidences();
  }, [element.id]);

  const handleAddIncidentClick = () => {
    onClose();
    setTimeout(() => {
      onOpenIncidentForm();
    }, 300);
  };

  const handleDeleteIncident = async (id: number) => {
    try {
      onClose();
      dispatch(showLoader());
      await deleteIncidence(id);

      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Incidencia eliminada correctamente',
      });
    } catch (error) {
      toast.current?.show({
        severity: 'error',
      });
    } finally {
      dispatch(hideLoader());
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-[650px] max-w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Elemento {element.id}</h2>
        <Button
          icon="pi pi-times"
          className="p-button-rounded p-button-text"
          onClick={onClose}
        />
      </div>

      <TabView
        activeIndex={activeIndex}
        onTabChange={(e) => setActiveIndex(e.index)}>
        <TabPanel header="Información">
          <div className="text-sm space-y-2">
            <p>
              <strong>Descripción:</strong>{' '}
              {element.description || 'No disponible'}
            </p>
            <p>
              <strong>Tipo:</strong> {element.element_type_id || 'No definido'}
            </p>
            <p>
              <strong>Estado:</strong> {element.created_at || 'No disponible'}
            </p>
          </div>
        </TabPanel>

        <TabPanel header="Incidencias">
          <div className="space-y-4">
            {incidences.length > 0 ? (
              incidences.map((incidence) => (
                <div key={incidence.id} className="border p-4 rounded-md">
                  <p className="font-bold">Incidencia #{incidence.id}</p>
                  <p>
                    <strong>📛 Nombre:</strong>{' '}
                    {incidence.name || 'No disponible'}
                  </p>
                  <p>
                    <strong>📅 Fecha Creación:</strong>{' '}
                    {incidence.created_at || 'No disponible'}
                  </p>
                  <p>
                    <strong>⚠️ Estado:</strong>{' '}
                    <Tag
                      // severidad del tag según el estado de la incidencia
                      severity={
                        incidence.status === IncidentStatus.open
                          ? 'warning'
                          : incidence.status === IncidentStatus.in_progress
                            ? 'info'
                            : 'success'
                      }
                      // texto mostrado en el tag según el estado
                      value={
                        incidence.status === IncidentStatus.open
                          ? 'Abierto'
                          : incidence.status === IncidentStatus.in_progress
                            ? 'En progreso'
                            : 'Cerrado'
                      }
                      className="ml-2"
                    />
                  </p>

                  <p>
                    <strong>📝 Descripción:</strong>{' '}
                    {incidence.description || 'No disponible'}
                  </p>

                  <div className="mt-3 flex gap-2">
                    <Button
                      label="Cambiar Estado"
                      className="p-button-success p-button-sm"
                    />
                    <Button
                      label="Eliminar incidencia"
                      className="p-button-danger p-button-sm"
                      onClick={() => handleDeleteIncident(incidence.id!)}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p>No hay incidencias registradas para este elemento.</p>
            )}
            <div className="flex justify-end">
              <Button
                label="Añadir Incidencidda"
                className="p-button-sm"
                onClick={handleAddIncidentClick}
              />
            </div>
          </div>
        </TabPanel>

        <TabPanel header="Historial">
          <p className="text-sm">Historial del elemento (en construcción...)</p>
        </TabPanel>
      </TabView>
    </div>
  );
};

export default ElementDetailPopup;
