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
        summary: t('admin.pages.inventory.incidentForm.toast.nameRequiredWarningTitle'),
        detail: t('admin.pages.inventory.incidentForm.toast.nameRequiredWarningDetail'),
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

  return (
    <div className="p-4 bg-gray-50 border border-gray-300 rounded shadow-sm">
      <Toast ref={toast} />
      <div className="mb-4">
        <label className="block mb-1">{t('admin.pages.inventory.incidentForm.nameLabel')}</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-inputtext p-component w-full"
          placeholder={t('admin.pages.inventory.incidentForm.namePlaceholder')}
          disabled={isSubmitting}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">{t('admin.pages.inventory.incidentForm.descriptionLabel')}</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="p-inputtext p-component w-full"
          placeholder={t('admin.pages.inventory.incidentForm.descriptionPlaceholder')}
          disabled={isSubmitting}
          rows={4}
        />
      </div>
      <div className="flex justify-end gap-4">
        <Button
          label={t('admin.pages.inventory.incidentForm.saveButton')}
          onClick={handleSubmit}
          className="p-button-success"
          disabled={isSubmitting}
          icon="pi pi-save"
        />
        <Button
          label={t('admin.pages.inventory.incidentForm.cancelButton')}
          onClick={onBackToIncidents || onClose}
          className="p-button-secondary"
          disabled={isSubmitting}
        />
      </div>
    </div>
  );
};

export default IncidentForm;