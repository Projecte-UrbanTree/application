import { Icon } from '@iconify/react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import React, { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { saveIncidence } from '@/api/service/incidentService';
import { fetchElementsAsync } from '@/store/slice/elementSlice';
import { AppDispatch } from '@/store/store';
import { Incidence, IncidentStatus } from '@/types/Incident';

interface IncidentFormProps {
  elementId: number;
  onClose: () => void;
  onBackToIncidents?: () => void;
}

const IncidentForm: React.FC<IncidentFormProps> = ({
  elementId,
  onClose,
  onBackToIncidents,
}) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status] = useState(IncidentStatus.open);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const toast = useRef<Toast>(null);

  const handleSubmit = useCallback(async () => {
    if (!name.trim()) {
      toast.current?.show({
        severity: 'warn',
        summary: t(
          'admin.pages.inventory.incidentForm.toast.nameRequiredWarningTitle',
        ),
        detail: t(
          'admin.pages.inventory.incidentForm.toast.nameRequiredWarningDetail',
        ),
      });
      return;
    }

    setIsSubmitting(true);

    const newIncidence: Incidence = {
      name,
      description,
      status,
      element_id: elementId,
    };

    try {
      await saveIncidence(newIncidence);
      toast.current?.show({
        severity: 'success',
        summary: t('admin.pages.inventory.incidentForm.toast.successTitle'),
        detail: t('admin.pages.inventory.incidentForm.toast.successDetail'),
      });

      setName('');
      setDescription('');

      await dispatch(fetchElementsAsync());

      if (onBackToIncidents) {
        onBackToIncidents();
      } else {
        onClose();
      }
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: t('admin.pages.inventory.incidentForm.toast.errorTitle'),
        detail: t('admin.pages.inventory.incidentForm.toast.errorDetail'),
      });
      setIsSubmitting(false);
    }
  }, [
    name,
    description,
    status,
    elementId,
    dispatch,
    onBackToIncidents,
    onClose,
    t,
  ]);

  const handleCancel = useCallback(() => {
    setName('');
    setDescription('');
    onClose();
  }, [onClose]);

  return (
    <div className="p-4 bg-gray-50 border border-gray-300 rounded shadow-sm">
      <Toast ref={toast} />

      <form className="space-y-4">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <Icon icon="tabler:notes" width="18" />
              {t('admin.pages.inventory.incidentForm.nameLabel')}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-inputtext"
              placeholder={t(
                'admin.pages.inventory.incidentForm.namePlaceholder',
              )}
              disabled={isSubmitting}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <Icon icon="tabler:notes" width="18" />
              {t('admin.pages.inventory.incidentForm.descriptionLabel')}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-inputtext"
              placeholder={t(
                'admin.pages.inventory.incidentForm.descriptionPlaceholder',
              )}
              disabled={isSubmitting}
              rows={4}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-gray-200">
          <Button
            label={t('admin.pages.inventory.incidentForm.cancelButton')}
            className="p-button-outlined p-button-secondary"
            icon={<Icon icon="tabler:x" />}
            onClick={handleCancel}
            disabled={isSubmitting}
          />
          <Button
            label={t('admin.pages.inventory.incidentForm.saveButton')}
            className="p-button-primary"
            icon={<Icon icon="tabler:device-floppy" />}
            onClick={handleSubmit}
            disabled={isSubmitting}
          />
        </div>
      </form>
    </div>
  );
};

export default IncidentForm;
