import React, { useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { Element } from '@/types/Element';
import { updateElementService } from '@/api/service/elementService';

interface EditElementFormProps {
  element: Element;
  onClose: () => void;
  onBackToIncidents?: () => void;
  elementTypes: { label: string; value: number }[];
  treeTypes: { label: string; value: number }[];
}

const EditElementForm: React.FC<EditElementFormProps> = ({
  element,
  onClose,
  onBackToIncidents,
  elementTypes,
  treeTypes,
}) => {
  const [formData, setFormData] = useState<Element>({
    ...element,
    description: element.description ?? '',
    element_type_id: element.element_type_id ?? 0,
    tree_type_id: element.tree_type_id ?? 0,
  });

  const toast = useRef<Toast>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleElementTypeChange = (e: { value: number }) => {
    setFormData({ ...formData, element_type_id: e.value });
  };

  const handleTreeTypeChange = (e: { value: number }) => {
    setFormData({ ...formData, tree_type_id: e.value });
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await updateElementService(formData);
      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Elemento actualizado correctamente',
      });

      setIsSubmitting(false);
      if (onBackToIncidents) {
        onBackToIncidents();
      } else {
        onClose();
      }
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo actualizar el elemento',
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <Toast ref={toast} />

      <div className="mb-4">
        <label className="block mb-1" htmlFor="description">
          Descripción:
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description ?? ''}
          onChange={handleInputChange}
          className="p-inputtext p-component w-full"
          placeholder="Descripción del elemento"
          disabled={isSubmitting}
          rows={3}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1" htmlFor="element_type_id">
          Tipo de Elemento:
        </label>
        <Dropdown
          id="element_type_id"
          value={formData.element_type_id}
          options={elementTypes}
          optionLabel="label"
          optionValue="value"
          onChange={handleElementTypeChange}
          placeholder="Selecciona el tipo de elemento"
          className="w-full"
          disabled={isSubmitting}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1" htmlFor="tree_type_id">
          Tipo de Árbol:
        </label>
        <Dropdown
          id="tree_type_id"
          value={formData.tree_type_id}
          options={treeTypes}
          optionLabel="label"
          optionValue="value"
          onChange={handleTreeTypeChange}
          placeholder="Selecciona el tipo de árbol"
          className="w-full"
          disabled={isSubmitting}
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

export default EditElementForm;
