import { Icon } from '@iconify/react';
import { Button } from 'primereact/button';
import React from 'react';
import ReactDOM from 'react-dom/client';

import { Element } from '@/types/Element';
import { ElementType } from '@/types/ElementType';
import { TreeTypes } from '@/types/TreeTypes';

interface ElementPopupProps {
  element: Element;
  treeTypes: TreeTypes[] | undefined;
  elementTypes: ElementType[] | undefined;
  onDeleteElement?: (elementId: number) => void;
  onAddIncident?: (elementId: number) => void;
}

const ElementPopup: React.FC<ElementPopupProps> = React.memo(
  ({ element, treeTypes, elementTypes, onDeleteElement, onAddIncident }) => {
    const elementType = elementTypes?.find(
      (type) => type.id === element.element_type_id,
    );
    const treeType = treeTypes?.find(
      (type) => type.id === element.tree_type_id,
    );

    return (
      <div
        className="bg-gray-50 p-4 shadow-sm rounded border border-gray-300"
        style={{
          width: '340px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
        }}>
        <div className="bg-indigo-50 p-3 border-b border-indigo-100 rounded-t-lg">
          <h3 className="text-lg font-bold text-indigo-700 flex items-center gap-2">
            <Icon icon="tabler:clipboard-data" width="22" />
            Elemento #{element.id}
          </h3>
          {element.description && (
            <p className="text-sm text-indigo-600 mt-1 truncate">{element.description}</p>
          )}
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-1 gap-3 mb-3">
            <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
              <div className="flex items-center mb-2 gap-2">
                <div 
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: elementType?.color || '#6366F1' }}>
                  {elementType?.icon && (
                    <Icon
                      icon={elementType.icon.startsWith('tabler:') 
                        ? elementType.icon 
                        : `tabler:${elementType.icon.replace('mdi:', '')}`}
                      width="16"
                      color="white"
                    />
                  )}
                </div>
                <span className="font-semibold text-gray-700">{elementType?.name || 'No definido'}</span>
              </div>
              
              {treeType && (
                <div className="bg-white rounded p-2 border border-gray-200 text-sm space-y-1 mt-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Familia:</span>
                    <span className="font-medium">{treeType.family}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Género:</span>
                    <span className="font-medium">{treeType.genus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Especie:</span>
                    <span className="font-medium">{treeType.species}</span>
                  </div>
                </div>
              )}
              
              <div className="flex justify-between mt-2 text-sm">
                <span className="text-gray-600">Creado:</span>
                <span className="font-medium">
                  {element.created_at
                    ? new Date(element.created_at).toLocaleDateString()
                    : 'No disponible'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button
              label="Incidencia"
              className="p-button-warning p-button-sm"
              icon={<Icon icon="tabler:alert-triangle" width="16" />}
              onClick={() => onAddIncident && onAddIncident(element.id!)}
            />
            <Button
              label="Eliminar"
              className="p-button-danger p-button-sm"
              icon={<Icon icon="tabler:trash" width="16" />}
              onClick={() => onDeleteElement && onDeleteElement(element.id!)}
            />
          </div>
        </div>
      </div>
    );
  },
);

export const renderElementPopup = (
  element: Element,
  treeTypes: TreeTypes[],
  elementTypes: ElementType[],
  onDelete?: (elementId: number) => void,
  onAddIncident?: (elementId: number) => void,
): HTMLElement => {
  const container = document.createElement('div');
  ReactDOM.createRoot(container).render(
    <ElementPopup
      element={element}
      treeTypes={treeTypes}
      elementTypes={elementTypes}
      onDeleteElement={onDelete}
      onAddIncident={onAddIncident}
    />,
  );
  return container;
};
