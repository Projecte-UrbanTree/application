import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Element } from '@/types/Element';

interface ElementPopupProps {
  element: Element;
}

export const ElementPopup: React.FC<ElementPopupProps> = ({ element }) => {
  return (
    <div className="p-3">
      <h3 className="text-lg font-bold mb-2">Elemento #{element.id}</h3>
      <p className="text-sm mb-1">Tipo: {element.element_type_id}</p>
      <p className="text-sm">Estado: {element.created_at}</p>
    </div>
  );
};

export const renderElementPopup = (element: Element): string => {
  return ReactDOMServer.renderToString(<ElementPopup element={element} />);
};
