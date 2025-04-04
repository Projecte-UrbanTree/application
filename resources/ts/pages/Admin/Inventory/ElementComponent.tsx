import { Element } from '@/types/Element';
import { Button } from 'primereact/button';
import { ElementType } from '@/types/ElementType';
import { TreeTypes } from '@/types/TreeTypes';
import ReactDOM from 'react-dom/client';
import React from 'react';

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
        className="p-4 bg-white shadow-lg rounded-lg border border-gray-200"
        style={{
          width: '300px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
        }}>
        <h3 className="text-lg font-bold mb-2 border-b pb-2">
          Elemento #{element.id}
        </h3>
        <div className="my-2">
          <p className="text-sm mb-1 flex justify-between">
            <strong>Tipo:</strong>{' '}
            <span>{elementType?.name || 'No definido'}</span>
          </p>
          <p className="text-sm mb-1 flex justify-between">
            <strong>Árbol:</strong>{' '}
            <span>
              {treeType
                ? `${treeType.family} ${treeType.genus} ${treeType.species}`
                : 'No definido'}
            </span>
          </p>
          <p className="text-sm mb-1 flex justify-between">
            <strong>Creado:</strong>{' '}
            <span>
              {element.created_at
                ? new Date(element.created_at).toLocaleDateString()
                : 'No disponible'}
            </span>
          </p>
        </div>

        <div className="flex gap-2 mt-4 justify-end">
          <Button
            label="Eliminar"
            className="p-button-danger p-button-sm"
            onClick={() => onDeleteElement && onDeleteElement(element.id!)}
          />
          <Button
            label="Incidencia"
            className="p-button-warning p-button-sm"
            onClick={() => onAddIncident && onAddIncident(element.id!)}
          />
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
