import { Icon } from '@iconify/react';
import {
  differenceInMonths,
  differenceInYears,
  format,
  subMonths,
  subYears,
} from 'date-fns';
import { Form, Formik, useFormikContext } from 'formik';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Message } from 'primereact/message';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';

import axiosClient from '@/api/axiosClient';
import { useToast } from '@/hooks/useToast';

interface FormFieldProps {
  name: string;
  label: string;
  component: any;
  options?: { label: string; value: number }[];
  min?: number;
  max?: number;
}

const FormikInputNumber: React.FC<FormFieldProps> = ({
  name,
  label,
  min,
  max,
}) => {
  const { values, errors, touched, setFieldValue } = useFormikContext<any>();

  return (
    <div className="flex flex-col mb-4">
      <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
        <Icon icon="tabler:input-number" className="h-5 w-5 mr-2" />
        {label}
      </label>
      <InputNumber
        id={name}
        value={values[name]}
        onValueChange={(e) => setFieldValue(name, e.value)}
        min={min}
        max={max}
        className={
          errors[name] && touched[name] ? 'p-invalid w-full' : 'w-full'
        }
      />
      {errors[name] && touched[name] ? (
        <small className="p-error">{String(errors[name])}</small>
      ) : null}
    </div>
  );
};

const FormikDropdown: React.FC<FormFieldProps> = ({ name, label, options }) => {
  const { values, errors, touched, setFieldValue } = useFormikContext<any>();

  return (
    <div className="flex flex-col mb-4">
      <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
        <Icon icon="tabler:dropdown" className="h-5 w-5 mr-2" />
        {label}
      </label>
      <Dropdown
        id={name}
        value={values[name]}
        options={options}
        onChange={(e) => setFieldValue(name, e.value)}
        optionLabel="label"
        optionValue="value"
        className={
          errors[name] && touched[name] ? 'p-invalid w-full' : 'w-full'
        }
      />
      {errors[name] && touched[name] ? (
        <small className="p-error">{String(errors[name])}</small>
      ) : null}
    </div>
  );
};

interface EditEvaProps {
  preselectedElementId?: number;
  onClose?: () => void;
  redirectPath?: string;
}

interface DictionaryOption {
  label: string;
  value: number;
}

interface Dictionaries {
  unbalancedCrown: DictionaryOption[];
  overextendedBranches: DictionaryOption[];
  cracks: DictionaryOption[];
  deadBranches: DictionaryOption[];
  inclination: DictionaryOption[];
  VForks: DictionaryOption[];
  cavities: DictionaryOption[];
  barkDamage: DictionaryOption[];
  soilLifting: DictionaryOption[];
  cutRoots: DictionaryOption[];
  basalRot: DictionaryOption[];
  exposedRoots: DictionaryOption[];
  wind: DictionaryOption[];
  drought: DictionaryOption[];
}

export default function EditEva({
  preselectedElementId,
  onClose,
  redirectPath,
}: EditEvaProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const elementId = preselectedElementId || id;

  const [initialValues, setInitialValues] = useState({
    element_id: 0,
    date_birth: '',
    years: 0,
    months: 0,
    height: 0,
    diameter: 0,
    crown_width: 0,
    crown_projection_area: 0,
    root_surface_diameter: 0,
    effective_root_area: 0,
    height_estimation: 0,
    unbalanced_crown: 0,
    overextended_branches: 0,
    cracks: 0,
    dead_branches: 0,
    inclination: 0,
    V_forks: 0,
    cavities: 0,
    bark_damage: 0,
    soil_lifting: 0,
    cut_damaged_roots: 0,
    basal_rot: 0,
    exposed_surface_roots: 0,
    wind: 0,
    drought: 0,
    status: 0,
  });

  const [dictionaries, setDictionaries] = useState<Dictionaries>({
    unbalancedCrown: [],
    overextendedBranches: [],
    cracks: [],
    deadBranches: [],
    inclination: [],
    VForks: [],
    cavities: [],
    barkDamage: [],
    soilLifting: [],
    cutRoots: [],
    basalRot: [],
    exposedRoots: [],
    wind: [],
    drought: [],
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEva = async () => {
      try {
        const response = await axiosClient.get(`/admin/evas/${elementId}`);
        const data = response.data;
        const today = new Date();
        const birthDate = new Date(data.date_birth);
        const years = differenceInYears(today, birthDate);
        const months = differenceInMonths(today, birthDate) % 12;
        setInitialValues({
          ...data,
          years,
          months,
        });
      } catch (error) {
        console.error(error);
        setError(t('admin.pages.evas.list.messages.error'));
        setIsLoading(false);
      }
    };

    const fetchDictionaries = async () => {
      try {
        const response = await axiosClient.get('/admin/evas/create');
        const translatedDictionaries: Dictionaries = {
          unbalancedCrown: [],
          overextendedBranches: [],
          cracks: [],
          deadBranches: [],
          inclination: [],
          VForks: [],
          cavities: [],
          barkDamage: [],
          soilLifting: [],
          cutRoots: [],
          basalRot: [],
          exposedRoots: [],
          wind: [],
          drought: [],
        };
        for (const key in response.data.dictionaries) {
          translatedDictionaries[key as keyof Dictionaries] =
            response.data.dictionaries[key].map((option: DictionaryOption) => ({
              ...option,
              label: t(option.label),
            }));
        }
        setDictionaries(translatedDictionaries);
      } catch (error) {
        console.error(error);
      }
    };

    Promise.all([fetchEva(), fetchDictionaries()]);
  }, [elementId, t]);

  const validationSchema = Yup.object({
    element_id: Yup.number(),
    date_birth: Yup.string(),
    years: Yup.number().min(0),
    months: Yup.number().min(0).max(11),
    height: Yup.number(),
    diameter: Yup.number(),
    crown_width: Yup.number(),
    crown_projection_area: Yup.number(),
    root_surface_diameter: Yup.number(),
    effective_root_area: Yup.number(),
    height_estimation: Yup.number(),
    unbalanced_crown: Yup.number(),
    overextended_branches: Yup.number(),
    cracks: Yup.number(),
    dead_branches: Yup.number(),
    inclination: Yup.number(),
    V_forks: Yup.number(),
    cavities: Yup.number(),
    bark_damage: Yup.number(),
    soil_lifting: Yup.number(),
    cut_damaged_roots: Yup.number(),
    basal_rot: Yup.number(),
    exposed_surface_roots: Yup.number(),
    wind: Yup.number(),
    drought: Yup.number(),
    status: Yup.number(),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const today = new Date();
      const birthDate = subMonths(subYears(today, values.years), values.months);
      const formattedDate = format(birthDate, 'yyyy-MM-dd');

      const status =
        Number(values.unbalanced_crown || 0) +
        Number(values.overextended_branches || 0) +
        Number(values.cracks || 0) +
        Number(values.dead_branches || 0) +
        Number(values.inclination || 0) +
        Number(values.V_forks || 0) +
        Number(values.cavities || 0) +
        Number(values.bark_damage || 0) +
        Number(values.soil_lifting || 0) +
        Number(values.cut_damaged_roots || 0) +
        Number(values.basal_rot || 0) +
        Number(values.exposed_surface_roots || 0);

      const updatedValues = {
        ...values,
        date_birth: formattedDate,
        status: status,
      };

      const payload = {
        ...updatedValues,
        element_id: Number(updatedValues.element_id),
        height: Number(updatedValues.height),
        diameter: Number(updatedValues.diameter),
        crown_width: Number(updatedValues.crown_width),
        crown_projection_area: Number(updatedValues.crown_projection_area),
        root_surface_diameter: Number(updatedValues.root_surface_diameter),
        effective_root_area: Number(updatedValues.effective_root_area),
        height_estimation: Number(updatedValues.height_estimation),
      };

      await axiosClient.put(`/admin/evas/${elementId}`, payload);

      if (redirectPath) {
        onClose && onClose();
      } else {
        showToast('success', t('admin.pages.evas.list.messages.updateSuccess'));
        navigate('/admin/evas');
      }
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          t('admin.pages.evas.list.messages.error'),
      );
    }
    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <ProgressSpinner
          style={{ width: '50px', height: '50px' }}
          strokeWidth="4"
        />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center mb-4">
        <Button
          icon={<Icon icon="tabler:arrow-left" className="h-5 w-5" />}
          className="p-button-text mr-3"
          onClick={() => navigate('/admin/evas')}
        />
        <h2 className="text-xl font-semibold text-gray-800">
          {t('admin.pages.evas.edit.title')}
        </h2>
      </div>

      <Card className="border border-gray-300 bg-gray-50 rounded shadow-sm">
        <div className="p-0">
          {error && (
            <Message severity="error" text={error} className="mb-4 w-full" />
          )}
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize>
            {() => (
              <Form className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-1 p-4 rounded-lg border border-gray-300 bg-gray-100">
                  <h1 className="text-xl font-bold mb-4">
                    {t('admin.pages.evas.edit.identification')}
                  </h1>
                  <FormikInputNumber
                    name="years"
                    label={t('admin.pages.evas.form.years')}
                    component={InputNumber}
                    min={0}
                  />
                  <FormikInputNumber
                    name="months"
                    label={t('admin.pages.evas.form.months')}
                    component={InputNumber}
                    min={0}
                    max={11}
                  />
                </div>

                <div className="md:col-span-1">
                  <div className="p-4 rounded-lg border border-gray-300 bg-gray-100">
                    <h1 className="text-xl font-bold mb-4">
                      {t('admin.pages.evas.edit.treeCondition')}
                    </h1>

                    <h2 className="text-lg font-semibold mb-2">
                      {t('admin.pages.evas.edit.dimensions')}
                    </h2>
                    <FormikInputNumber
                      name="height"
                      label={`${t('admin.pages.evas.form.height')} (m)`}
                      component={InputNumber}
                    />
                    <FormikInputNumber
                      name="diameter"
                      label={`${t('admin.pages.evas.form.diameter')} (cm)`}
                      component={InputNumber}
                    />
                    <FormikInputNumber
                      name="crown_width"
                      label={`${t('admin.pages.evas.form.crown_width')} (m)`}
                      component={InputNumber}
                    />
                    <FormikInputNumber
                      name="crown_projection_area"
                      label={`${t('admin.pages.evas.form.crown_projection_area')} (m²)`}
                      component={InputNumber}
                    />
                    <FormikInputNumber
                      name="root_surface_diameter"
                      label={`${t('admin.pages.evas.form.root_surface_diameter')} (m)`}
                      component={InputNumber}
                    />
                    <FormikInputNumber
                      name="effective_root_area"
                      label={`${t('admin.pages.evas.form.effective_root_area')} (m²)`}
                      component={InputNumber}
                    />
                    <FormikInputNumber
                      name="height_estimation"
                      label={`${t('admin.pages.evas.form.height_estimation')} (m)`}
                      component={InputNumber}
                    />
                  </div>
                </div>

                <div className="md:col-span-2 p-4 rounded-lg border border-gray-300 bg-gray-100">
                  <h2 className="text-lg font-semibold mb-2">
                    {t('admin.pages.evas.edit.state')}
                  </h2>

                  <h3 className="text-md font-medium mb-2">
                    {t('admin.pages.evas.edit.crownBranches')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormikDropdown
                      name="unbalanced_crown"
                      label={t('admin.pages.evas.form.unbalanced_crown')}
                      component={Dropdown}
                      options={dictionaries.unbalancedCrown}
                    />
                    <FormikDropdown
                      name="overextended_branches"
                      label={t('admin.pages.evas.form.overextended_branches')}
                      component={Dropdown}
                      options={dictionaries.overextendedBranches}
                    />
                    <FormikDropdown
                      name="cracks"
                      label={t('admin.pages.evas.form.cracks')}
                      component={Dropdown}
                      options={dictionaries.cracks}
                    />
                    <FormikDropdown
                      name="dead_branches"
                      label={t('admin.pages.evas.form.dead_branches')}
                      component={Dropdown}
                      options={dictionaries.deadBranches}
                    />
                  </div>

                  <h3 className="text-md font-medium mt-4 mb-2">
                    {t('admin.pages.evas.edit.trunk')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormikDropdown
                      name="inclination"
                      label={t('admin.pages.evas.form.inclination')}
                      component={Dropdown}
                      options={dictionaries.inclination}
                    />
                    <FormikDropdown
                      name="V_forks"
                      label={t('admin.pages.evas.form.V_forks')}
                      component={Dropdown}
                      options={dictionaries.VForks}
                    />
                    <FormikDropdown
                      name="cavities"
                      label={t('admin.pages.evas.form.cavities')}
                      component={Dropdown}
                      options={dictionaries.cavities}
                    />
                    <FormikDropdown
                      name="bark_damage"
                      label={t('admin.pages.evas.form.bark_damage')}
                      component={Dropdown}
                      options={dictionaries.barkDamage}
                    />
                  </div>

                  <h3 className="text-md font-medium mt-4 mb-2">
                    {t('admin.pages.evas.edit.roots')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormikDropdown
                      name="soil_lifting"
                      label={t('admin.pages.evas.form.soil_lifting')}
                      component={Dropdown}
                      options={dictionaries.soilLifting}
                    />
                    <FormikDropdown
                      name="cut_damaged_roots"
                      label={t('admin.pages.evas.form.cut_damaged_roots')}
                      component={Dropdown}
                      options={dictionaries.cutRoots}
                    />
                    <FormikDropdown
                      name="basal_rot"
                      label={t('admin.pages.evas.form.basal_rot')}
                      component={Dropdown}
                      options={dictionaries.basalRot}
                    />
                    <FormikDropdown
                      name="exposed_surface_roots"
                      label={t('admin.pages.evas.form.exposed_surface_roots')}
                      component={Dropdown}
                      options={dictionaries.exposedRoots}
                    />
                  </div>
                </div>

                <div className="md:col-span-2 p-4 rounded-lg border border-gray-300 bg-gray-100">
                  <div>
                    <h1 className="text-xl font-bold mb-4">
                      {t('admin.pages.evas.edit.environmentCondition')}
                    </h1>

                    <h2 className="text-lg font-semibold mb-2">
                      {t('admin.pages.evas.edit.environmentalFactors')}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormikDropdown
                        name="wind"
                        label={t('admin.pages.evas.form.wind')}
                        component={Dropdown}
                        options={dictionaries.wind}
                      />
                      <FormikDropdown
                        name="drought"
                        label={t('admin.pages.evas.form.drought')}
                        component={Dropdown}
                        options={dictionaries.drought}
                      />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 flex justify-end mt-6">
                  <Button
                    type="submit"
                    severity="info"
                    disabled={isSubmitting}
                    className="p-button-sm"
                    icon={isSubmitting ? 'pi pi-spin pi-spinner' : undefined}
                    label={
                      isSubmitting
                        ? t('admin.pages.evas.form.saving')
                        : t('admin.pages.evas.form.save')
                    }
                  />
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </Card>
    </>
  );
}
