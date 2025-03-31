import React, { useState } from 'react';
import { Element } from '@/types/Element';
import { Button } from 'primereact/button';
import { TabView, TabPanel } from 'primereact/tabview';
import { Tag } from 'primereact/tag';
import { Calendar } from 'primereact/calendar';

interface ElementDetailPopupProps {
  element: Element;
  onClose: () => void;
}

const ElementDetailPopup: React.FC<ElementDetailPopupProps> = ({
  element,
  onClose,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

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
            <div className="border p-4 rounded-md">
              <p className="font-bold">Incidencia 1</p>
              <p>
                <strong>📛 Nombre:</strong> Rama caída
              </p>
              <p>
                <strong>📅 Fecha Creación:</strong> 2025-03-31 15:15:26
              </p>
              <p>
                <strong>⚠️ Estado:</strong>{' '}
                <Tag severity="warning" value="Abierta" className="ml-2" />
              </p>
              <p>
                <strong>📝 Descripción:</strong> Rama caída en el suelo
              </p>

              <div className="mt-3 flex gap-2">
                <Button
                  label="Cambiar Estado"
                  className="p-button-success p-button-sm"
                />
                <Button
                  label="Eliminar incidencia"
                  className="p-button-danger p-button-sm"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button label="Añadir Incidencia" className="p-button-sm" />
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
