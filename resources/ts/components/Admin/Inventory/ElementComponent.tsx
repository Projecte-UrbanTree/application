import { Element } from '@/types/Element';
import { Button } from 'primereact/button';
import { ElementType } from '@/types/ElementType';
import { TreeTypes } from '@/types/TreeTypes';
import ReactDOM from 'react-dom/client';
interface ElementPopupProps {
  element: Element;
  treeTypes: TreeTypes[] | undefined;
  elementTypes: ElementType[] | undefined;
  onDeleteElement?: (elementId: number) => void;
  onAddIncident?: (elementId: number) => void;
}

const ElementPopup: React.FC<ElementPopupProps> = ({
  element,
  treeTypes,
  elementTypes,
  onDeleteElement,
  onAddIncident,
}) => {
  const elementType = elementTypes?.find(
    (type) => type.id === element.element_type_id,
  );
  const treeType = treeTypes?.find((type) => type.id === element.tree_type_id);

  return (
    <div
      className="p-4"
      style={{
        width: '300px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      }}>
      <h3 className="text-lg font-bold mb-2">Elemento #{element.id}</h3>
      <p className="text-sm mb-1">
        <strong>Tipo:</strong> {elementType?.name || 'No definido'}
      </p>
      <p className="text-sm mb-1">
        <strong>Árbol:</strong>{' '}
        {treeType
          ? `${treeType.family} ${treeType.genus} ${treeType.species}`
          : 'No definido'}
      </p>
      <p className="text-sm mb-1">
        <strong>Estado:</strong> {element.created_at || 'No disponible'}
      </p>

      <div className="flex gap-2 mt-3">
        <Button label="Editar" className="p-button-sm" />
        <Button
          label="Eliminar"
          className="p-button-danger p-button-sm"
          onClick={() => onDeleteElement && onDeleteElement(element.id!)}
        />
        <Button
          label="Añadir Incidencia"
          className="p-button-warning p-button-sm"
          onClick={() => onAddIncident && onAddIncident(element.id!)}
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
