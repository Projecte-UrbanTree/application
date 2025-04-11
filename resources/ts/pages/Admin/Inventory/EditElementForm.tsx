import { Icon } from '@iconify/react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
            if (!needsTreeType) {
              setFormData(prev => ({ ...prev, tree_type_id: undefined }));
            }
          }
        } catch (error) {
          console.error('Error fetching element type details:', error);
        }
      } else {
        setRequiresTreeType(false);
        setFormData(prev => ({ ...prev, tree_type_id: undefined }));
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
        summary: t('general.success'),
        detail: t('admin.pages.inventory.editElementForm.toast.successDetail'),
      });

      await dispatch(fetchElementsAsync());
      setIsSubmitting(false);
      onClose();
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: t('general.error'),
        detail: t('admin.pages.inventory.editElementForm.toast.errorDetail'),
      });
      setIsSubmitting(false);
    }
  };

  const formIsValid =
    formData.element_type_id !== 0 &&
    (!requiresTreeType || (formData.tree_type_id !== undefined && formData.tree_type_id !== null && formData.tree_type_id !== 0));

  return (
    <div className="p-4 bg-gray-50 border border-gray-300 rounded shadow-sm">
      <Toast ref={toast} />

      <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200 mb-4 flex items-center gap-2 text-indigo-800">
        <Icon icon="tabler:info-circle" className="text-indigo-500 flex-shrink-0" width="20" />
        <span className="text-sm font-medium">{t('admin.pages.inventory.editElementForm.editingInfo', { id: element.id })}</span>
      </div>

      <form className="space-y-4">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <Icon icon="tabler:category" width="18" />
              {t('admin.pages.inventory.editElementForm.labels.elementType')}
            </label>
            <Dropdown
              id="element_type_id"
              value={formData.element_type_id}
              options={elementTypes}
              onChange={handleElementTypeChange}
              placeholder={t('admin.pages.inventory.editElementForm.placeholders.elementType')}
              className="w-full"
              disabled={isSubmitting}
              appendTo="self"
            />
          </div>

          {requiresTreeType && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <Icon icon="tabler:tree" width="18" />
                {t('admin.pages.inventory.editElementForm.labels.treeType')}
              </label>
              <Dropdown
                id="tree_type_id"
                value={formData.tree_type_id}
                options={treeTypes}
                onChange={handleTreeTypeChange}
                placeholder={t('admin.pages.inventory.editElementForm.placeholders.treeType')}
                className="w-full"
                disabled={isSubmitting || !formData.element_type_id}
                appendTo="self"
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <Icon icon="tabler:notes" width="18" />
              {t('admin.pages.inventory.editElementForm.labels.description')}
            </label>
            <InputTextarea
              id="description"
              name="description"
              value={formData.description ?? ''}
              onChange={handleInputChange}
              className="w-full p-inputtext"
              placeholder={t('admin.pages.inventory.editElementForm.placeholders.description')}
              disabled={isSubmitting}
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-gray-200">
          <Button
            label={t('general.cancel')}
            className="p-button-outlined p-button-secondary"
            icon={<Icon icon="tabler:x" />}
            onClick={onClose}
            disabled={isSubmitting}
          />
          <Button
            label={t('admin.pages.inventory.editElementForm.buttons.save')}
            className="p-button-primary"
            icon={<Icon icon="tabler:device-floppy" />}
            onClick={handleSubmit}
            disabled={!formIsValid || isSubmitting}
            loading={isSubmitting}
          />
        </div>
      </form>
    </div>
  );
};

export default EditElementForm;