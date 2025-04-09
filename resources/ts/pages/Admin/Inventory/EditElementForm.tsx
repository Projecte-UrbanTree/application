import { Icon } from '@iconify/react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import React, { useEffect,useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { updateElementService } from '@/api/service/elementService';
import { fetchElementType } from '@/api/service/elementTypeService';
import { fetchElementsAsync } from '@/store/slice/elementSlice';
import { AppDispatch } from '@/store/store';
import { Element } from '@/types/Element';

interface EditElementFormProps {
  element: Element;
  onClose: () => void;
  elementTypes: { label: string; value: number }[];
  treeTypes: { label: string; value: number }[];
}

const EditElementForm: React.FC<EditElementFormProps> = ({
  element,
  onClose,
  elementTypes,
  treeTypes
}) => {
  const [formData, setFormData] = useState<Element>({
    ...element,
    description: element.description ?? '',
    element_type_id: element.element_type_id ?? 0,
    tree_type_id: element.tree_type_id ?? undefined,
  });

  const [requiresTreeType, setRequiresTreeType] = useState<boolean>(false);
  const toast = useRef<Toast>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const checkElementTypeRequirements = async () => {
      if (formData.element_type_id) {
        try {
          const allElementTypes = await fetchElementType();
          const selectedElementType = allElementTypes.find(
            (et) => et.id === formData.element_type_id,
          );

          if (selectedElementType) {
            const needsTreeType = selectedElementType.requires_tree_type === true || 
                                selectedElementType.requires_tree_type === 1;
            setRequiresTreeType(needsTreeType);
          }
        } catch (error) {
          console.error('Error al verificar si requiere tipo de árbol:', error);
        }
      }
    };

    checkElementTypeRequirements();
  }, [formData.element_type_id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleElementTypeChange = (e: { value: number }) => {
    setFormData({ ...formData, element_type_id: e.value });
    
    // Si el nuevo tipo no requiere árbol, eliminar el tree_type_id
    if (!requiresTreeType) {
      setFormData(prev => ({ ...prev, tree_type_id: undefined }));
    }
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
      
      await dispatch(fetchElementsAsync());
      setIsSubmitting(false);
      onClose();
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo actualizar el elemento',
      });
      setIsSubmitting(false);
    }
  };

  const formIsValid =
    formData.element_type_id !== 0 &&
    (!requiresTreeType || formData.tree_type_id !== undefined);

  return (
    <div className="p-4">
      <Toast ref={toast} />

      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mb-4 flex items-center gap-2 text-sm text-gray-700">
        <Icon icon="tabler:info-circle" className="text-blue-500" width="20" />
        <span>Editando elemento #{element.id}</span>
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-gray-700 font-medium flex items-center gap-1" htmlFor="description">
          <Icon icon="tabler:notes" width="18" />
          Descripción:
        </label>
        <InputTextarea
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
        <label className="block mb-2 text-gray-700 font-medium flex items-center gap-1" htmlFor="element_type_id">
          <Icon icon="tabler:category" width="18" />
          Tipo de Elemento:
        </label>
        <Dropdown
          id="element_type_id"
          value={formData.element_type_id}
          options={elementTypes}     
          onChange={handleElementTypeChange}
          placeholder="Selecciona el tipo de elemento"
          className="w-full"
          disabled={isSubmitting}
          appendTo="self"
        />
      </div>

      {requiresTreeType && (
        <div className="mb-4">
          <label className="block mb-2 text-gray-700 font-medium flex items-center gap-1" htmlFor="tree_type_id">
            <Icon icon="tabler:tree" width="18" />
            Tipo de Árbol:
          </label>
          <Dropdown
            id="tree_type_id"
            value={formData.tree_type_id}
            options={treeTypes}
            onChange={handleTreeTypeChange}
            placeholder="Selecciona el tipo de árbol"
            className="w-full"
            disabled={isSubmitting}
            appendTo="self"
          />
        </div>
      )}

      <div className="flex justify-end gap-3 mt-5 pt-3 border-t border-gray-200">
        <Button
          label="Guardar"
          onClick={handleSubmit}
          className="p-button-success"
          disabled={!formIsValid || isSubmitting}
          loading={isSubmitting}
          icon={<Icon icon="tabler:device-floppy" />}
        />
        <Button
          label="Cancelar"
          onClick={onClose}
          className="p-button-outlined p-button-secondary"
          disabled={isSubmitting}
          icon={<Icon icon="tabler:x" />}
        />
      </div>
    </div>
  );
};

export default EditElementForm;