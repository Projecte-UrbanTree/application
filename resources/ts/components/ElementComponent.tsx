import React, { useRef } from 'react';
import ReactDOMServer from 'react-dom/server';
import { Element } from '@/types/Element';
import { Button } from 'primereact/button';
import { ElementType } from '@/types/ElementType';
import { TreeTypes } from '@/types/TreeTypes';
import { Toast } from 'primereact/toast';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { deleteElementAsync } from '@/store/slice/elementSlice';

interface ElementPopupProps {
  element: Element;
  treeTypes: TreeTypes[] | undefined;
  elementTypes: ElementType[] | undefined;
  onDelete: (elementId: number) => void;
}

export const ElementPopup: React.FC<ElementPopupProps> = ({
  element,
  treeTypes,
  elementTypes,
  onDelete,
}) => {
  const toast = useRef<Toast>(null);
  const dispatch = useDispatch<AppDispatch>();

  const elementType = elementTypes?.find(
    (type) => type.id === element.element_type_id,
  );
  const treeType = treeTypes?.find((type) => type.id === element.tree_type_id);

  const handleDeleteElement = async () => {
    try {
      await dispatch(deleteElementAsync(element.id!));
      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Elemento eliminado correctamente',
      });
      onDelete(element.id!);
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al eliminar el elemento',
      });
    }
  };

  return (
    <div className="p-3">
      <Toast ref={toast} />
      <h3 className="text-lg font-bold mb-2">Elemento #{element.id}</h3>
      <p className="text-sm mb-1">Tipo: {elementType?.name}</p>
      <p className="text-sm">Estado: {element.created_at}</p>

      <div className="flex gap-2">
        <Button label="Editar" className="p-button-sm" />
        <Button
          label="Eliminar"
          className="p-button-danger p-button-sm"
          onClick={handleDeleteElement}
        />
      </div>
    </div>
  );
};

export const renderElementPopup = (
  element: Element,
  treeTypes: TreeTypes[],
  elementTypes: ElementType[],
): string => {
  return ReactDOMServer.renderToString(
    <ElementPopup
      element={element}
      elementTypes={elementTypes}
      treeTypes={treeTypes}
      onDelete={(elementId) => {
        // Handle the deletion
      }}
    />,
  );
};
