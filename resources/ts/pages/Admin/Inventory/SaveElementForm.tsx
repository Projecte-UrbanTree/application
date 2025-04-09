import { Icon } from '@iconify/react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

import { fetchElementType } from '@/api/service/elementTypeService';
import { SavePointsProps } from '@/api/service/pointService';
import {
  fetchElementsAsync,
  saveElementAsync,
} from '@/store/slice/elementSlice';
import { fetchPointsAsync, savePointsAsync } from '@/store/slice/pointSlice';
import { AppDispatch } from '@/store/store';
import { Element } from '@/types/Element';
import { TypePoint } from '@/types/Point';

interface SaveElementFormProps {
  zoneId: number;
  coordinate: [number, number];
  onClose: () => void;
  elementTypes: { label: string; value: number }[];
  treeTypes: { label: string; value: number }[];
}

export const SaveElementForm: React.FC<SaveElementFormProps> = ({
  zoneId,
  coordinate,
  onClose,
  elementTypes,
  treeTypes,
}) => {
  const [description, setDescription] = useState<string | null>(null);
  const [selectedElementType, setSelectedElementType] = useState<number | null>(
    null,
  );
  const [selectedTreeType, setSelectedTreeType] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requiresTreeType, setRequiresTreeType] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setDescription(e.target.value || null);
    },
    [],
  );

  const handleElementTypeChange = useCallback(async (e: { value: number }) => {
    const elementTypeId = e.value;
    setSelectedElementType(elementTypeId);

    try {
      const allElementTypes = await fetchElementType();
      const selectedElementType = allElementTypes.find(
        (et) => et.id === elementTypeId,
      );

      if (selectedElementType) {
        const needsTreeType = selectedElementType.requires_tree_type === true || 
                             selectedElementType.requires_tree_type === 1;
        setRequiresTreeType(needsTreeType);

        if (!needsTreeType) {
          setSelectedTreeType(null);
        }
      }
    } catch (error) {
      console.error('Error al verificar si requiere tipo de árbol:', error);
    }
  }, []);

  const handleTreeTypeChange = useCallback((e: { value: number }) => {
    setSelectedTreeType(e.value);
  }, []);

  const handleSave = async () => {
    if (!selectedElementType) return;

    setIsSubmitting(true);

    try {
      const [longitude, latitude] = coordinate;

      const pointToSave: SavePointsProps = {
        latitude,
        longitude,
        type: TypePoint.element,
        zone_id: zoneId,
      };

      const savedPoint = await dispatch(
        savePointsAsync([pointToSave]),
      ).unwrap();

      if (!savedPoint.id) {
        throw new Error('Failed to save point - no ID returned');
      }

      const elementData: Element = {
        description,
        element_type_id: selectedElementType,
        tree_type_id: requiresTreeType && selectedTreeType ? selectedTreeType : undefined,
        point_id: savedPoint.id,
      };

      await dispatch(saveElementAsync(elementData)).unwrap();
      await Promise.all([
        dispatch(fetchPointsAsync()),
        dispatch(fetchElementsAsync()),
      ]);

      onClose();
    } catch (error) {
      setIsSubmitting(false);
    }
  };

  const formIsValid =
    selectedElementType !== null &&
    (!requiresTreeType || selectedTreeType !== null);

  return (
    <div className="p-4 bg-gray-50 border border-gray-300 rounded shadow-sm">
      <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200 mb-4 flex items-center gap-2 text-indigo-800">
        <Icon icon="tabler:map-pin" className="text-indigo-500 flex-shrink-0" width="20" />
        <div className="text-sm">
          <p className="font-medium">Añadiendo elemento en la zona</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-4">
        <div className="mb-4">
          <label
            htmlFor="element-type"
            className="block text-sm font-medium mb-2 text-gray-700 flex items-center gap-1">
            <Icon icon="tabler:category" width="18" />
            Tipo de Elemento <span className="text-red-500">*</span>
          </label>
          <Dropdown
            id="element-type"
            value={selectedElementType}
            options={elementTypes}
            onChange={handleElementTypeChange}
            placeholder="Selecciona un tipo de elemento"
            className="w-full"
            appendTo="self"
            emptyMessage="No hay tipos disponibles"
            emptyFilterMessage="No se encontraron resultados"
          />
          {!selectedElementType && (
            <p className="text-amber-600 text-xs mt-1 flex items-center gap-1">
              <Icon icon="tabler:alert-circle" width="14" />
              Este campo es obligatorio
            </p>
          )}
        </div>

        {requiresTreeType && (
          <div className="mb-4">
            <label htmlFor="tree-type" className="block text-sm font-medium mb-2 text-gray-700 flex items-center gap-1">
              <Icon icon="tabler:tree" width="18" />
              Tipo de Árbol <span className="text-red-500">*</span>
            </label>
            <Dropdown
              id="tree-type"
              value={selectedTreeType}
              options={treeTypes}
              onChange={handleTreeTypeChange}
              placeholder="Selecciona tipo de árbol"
              className="w-full"
              appendTo="self"
              emptyMessage="No hay tipos disponibles"
              emptyFilterMessage="No se encontraron resultados"
              filter
            />
            {requiresTreeType && !selectedTreeType && (
              <p className="text-amber-600 text-xs mt-1 flex items-center gap-1">
                <Icon icon="tabler:alert-circle" width="14" />
                Este campo es obligatorio para el tipo de elemento seleccionado
              </p>
            )}
          </div>
        )}

        <div className="mb-2">
          <label htmlFor="description" className="block text-sm font-medium mb-2 text-gray-700 flex items-center gap-1">
            <Icon icon="tabler:notes" width="18" />
            Descripción (opcional)
          </label>
          <InputTextarea
            id="description"
            rows={3}
            value={description || ''}
            onChange={handleDescriptionChange}
            placeholder="Descripción adicional del elemento (opcional)"
            className="w-full"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-3 border-t border-gray-200">
        <Button
          label="Cancelar"
          className="p-button-outlined p-button-secondary"
          icon={<Icon icon="tabler:x" />}
          onClick={onClose}
          disabled={isSubmitting}
        />
        <Button
          label="Guardar Elemento"
          className="p-button-primary"
          icon={<Icon icon="tabler:device-floppy" />}
          onClick={handleSave}
          disabled={!formIsValid || isSubmitting}
          loading={isSubmitting}
        />
      </div>
    </div>
  );
};
