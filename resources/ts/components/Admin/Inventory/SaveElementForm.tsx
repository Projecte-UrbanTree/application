import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { savePointsAsync, fetchPointsAsync } from '@/store/slice/pointSlice';
import {
  saveElementAsync,
  fetchElementsAsync,
} from '@/store/slice/elementSlice';
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
  const [description, setDescription] = useState('');
  const [selectedElementType, setSelectedElementType] = useState<number | null>(
    null,
  );
  const [selectedTreeType, setSelectedTreeType] = useState<number | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const handleSave = async () => {
    if (!selectedElementType || !selectedTreeType) return;
    const [longitude, latitude] = coordinate;
    const savedPoint = await dispatch(
      savePointsAsync([
        {
          latitude,
          longitude,
          type: TypePoint.element,
          zone_id: zoneId,
        },
      ]),
    ).unwrap();
    const pointId = savedPoint.id;
    const elementData: Element = {
      description,
      element_type_id: selectedElementType,
      tree_type_id: selectedTreeType,
      point_id: pointId!,
    };
    await dispatch(saveElementAsync(elementData)).unwrap();
    await dispatch(fetchPointsAsync());
    await dispatch(fetchElementsAsync());
    onClose();
  };

  return (
    <div>
      <div className="mb-3">
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          descripción:
        </label>
        <InputTextarea
          id="description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="descripción del elemento"
          className="w-full"
        />
      </div>
      <div className="mb-3">
        <label
          htmlFor="element-type"
          className="block text-sm font-medium mb-1">
          tipo de elemento:
        </label>
        <Dropdown
          id="element-type"
          value={selectedElementType}
          options={elementTypes}
          onChange={(e) => setSelectedElementType(e.value)}
          placeholder="selecciona tipo de elemento"
          className="w-full"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="tree-type" className="block text-sm font-medium mb-1">
          tipo de árbol:
        </label>
        <Dropdown
          id="tree-type"
          value={selectedTreeType}
          options={treeTypes}
          onChange={(e) => setSelectedTreeType(e.value)}
          placeholder="selecciona tipo de árbol"
          className="w-full"
        />
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <Button
          label="cancelar"
          className="p-button-secondary"
          onClick={onClose}
        />
        <Button
          label="guardar elemento"
          className="p-button-primary"
          onClick={handleSave}
        />
      </div>
    </div>
  );
};
