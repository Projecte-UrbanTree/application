import React, { useRef } from 'react';
import ReactDOMServer from 'react-dom/server';
import { Element } from '@/types/Element';
import { Button } from 'primereact/button';
import { ElementType } from '@/types/ElementType';
import { TreeTypes } from '@/types/TreeTypes';
import { Toast } from 'primereact/toast';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';

interface ElementPopupProps {
  element: Element;
  treeTypes: TreeTypes[] | undefined;
  elementTypes: ElementType[] | undefined;
  onDeleteElement?: (elementId: number) => void;
}

export const ElementPopup: React.FC<ElementPopupProps> = ({
  element,
  treeTypes,
  elementTypes,
  onDeleteElement,
}) => {
  const elementType = elementTypes?.find(
    (type) => type.id === element.element_type_id,
  );
  const treeType = treeTypes?.find((type) => type.id === element.tree_type_id);

  return (
    <div className="p-3">
      <h3 className="text-lg font-bold mb-2">Elemento #{element.id}</h3>
      <p className="text-sm mb-1">Tipo: {elementType?.name}</p>
      <p className="text-sm">Estado: {element.created_at}</p>

      <div className="flex gap-2">
        <Button label="Editar" className="p-button-sm" />
        <Button
          label="Eliminar"
          className="p-button-danger p-button-sm"
          onClick={() => onDeleteElement && onDeleteElement(element.id!)}
        />
      </div>
    </div>
  );
};

export const renderElementPopup = (
  element: Element,
  treeTypes: TreeTypes[],
  elementTypes: ElementType[],
  onDelete?: (elementId: number) => void,
): string => {
  return ReactDOMServer.renderToString(
    <ElementPopup
      element={element}
      elementTypes={elementTypes}
      treeTypes={treeTypes}
      onDeleteElement={onDelete}
    />,
  );
};
