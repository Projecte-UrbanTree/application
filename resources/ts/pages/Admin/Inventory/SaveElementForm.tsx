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
        const needsTreeType = selectedElementType.requires_tree_type === 1;
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
    if (!selectedElementType || (requiresTreeType && !selectedTreeType)) return;

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
        tree_type_id: requiresTreeType
          ? (selectedTreeType ?? undefined)
          : undefined,
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
    <div className="p-3">
      <div className="mb-3">
        <label
          htmlFor="element-type"
          className="block text-sm font-medium mb-1">
          Tipo de Elemento:
        </label>
        <Dropdown
          id="element-type"
          value={selectedElementType}
          options={elementTypes}
          onChange={handleElementTypeChange}
          placeholder="Selecciona Tipo de Elemento"
          className="w-full"
        />
      </div>

      {requiresTreeType && (
        <div className="mb-3">
          <label htmlFor="tree-type" className="block text-sm font-medium mb-1">
            Tipo de Árbol:
          </label>
          <Dropdown
            id="tree-type"
            value={selectedTreeType}
            options={treeTypes}
            onChange={handleTreeTypeChange}
            placeholder="Selecciona Tipo de Árbol"
            className="w-full"
          />
        </div>
      )}

      <div className="mb-3">
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Descripción: (opcional)
        </label>
        <InputTextarea
          id="description"
          rows={3}
          value={description || ''}
          onChange={handleDescriptionChange}
          placeholder="Descripción del Elemento (opcional)"
          className="w-full"
        />
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button
          label="Cancelar"
          className="p-button-secondary"
          onClick={onClose}
          disabled={isSubmitting}
        />
        <Button
          label="Guardar Elemento"
          className="p-button-primary"
          onClick={handleSave}
          disabled={!formIsValid || isSubmitting}
        />
      </div>
    </div>
  );
};
