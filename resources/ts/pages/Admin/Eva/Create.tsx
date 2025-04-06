import { Icon } from '@iconify/react';
import { format, subMonths, subYears } from 'date-fns';
import { Form, Formik, useField } from 'formik';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Message } from 'primereact/message';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

import axiosClient from '@/api/axiosClient';
import { useToast } from '@/hooks/useToast';

const FormField = ({ as: Component, name, label, ...props }: any) => {
  const [field, meta, helpers] = useField(name);

  if (Component === InputNumber) {
    return (
      <div className="flex flex-col mb-4">
        <label
          htmlFor={name}
          className="flex items-center text-sm font-medium text-gray-700 mb-1">
          <Icon icon="tabler:input-number" className="h-5 w-5 mr-2" />
          {label}
        </label>
        <InputNumber
          id={name}
          value={field.value}
          onValueChange={(e) => helpers.setValue(e.value)}
          {...props}
          className="w-full"
        />
        {meta.touched && meta.error ? (
          <small className="p-error">{meta.error}</small>
        ) : null}
      </div>
    );
  }

  if (Component === Dropdown) {
    return (
      <div className="flex flex-col mb-4">
        <label
          htmlFor={name}
          className="flex items-center text-sm font-medium text-gray-700 mb-1">
          <Icon icon="tabler:dropdown" className="h-5 w-5 mr-2" />
          {label}
        </label>
        <Dropdown
          id={name}
          value={field.value}
          onChange={(e) => helpers.setValue(e.value)}
          optionLabel="label"
          optionValue="value"
          {...props}
          className="w-full"
        />
        {meta.touched && meta.error ? (
          <small className="p-error">{meta.error}</small>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex flex-col mb-4">
      <label
        htmlFor={name}
        className="flex items-center text-sm font-medium text-gray-700 mb-1">
        <Icon icon="tabler:input" className="h-5 w-5 mr-2" />
        {label}
      </label>
      <Component id={name} {...field} {...props} className="w-full" />
      {meta.touched && meta.error ? (
        <small className="p-error">{meta.error}</small>
      ) : null}
    </div>
  );
};

interface CreateEvaProps {
  preselectedElementId: number | null;
  onClose: () => void;
  redirectPath?: string;
}

const CreateEva = ({
  preselectedElementId,
  onClose,
  redirectPath,
}: CreateEvaProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [elements, setElements] = useState<any[]>([]);
  const [dictionaries, setDictionaries] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axiosClient
      .get('/admin/evas/create')
      .then((response) => {
        setElements(response.data.elements);
        if (preselectedElementId) {
          setElements((prev) =>
            prev.filter((element) => element.id === preselectedElementId),
          );
        }
        const translatedDictionaries: any = {
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
          translatedDictionaries[key] = response.data.dictionaries[key].map(
            (option: any) => ({
              ...option,
              label: t(option.label),
            }),
          );
        }
        setDictionaries(translatedDictionaries);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [preselectedElementId]);

  const initialValues = {
    element_id: preselectedElementId || 0,
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
    unbalancedCrown: 0,
    overextendedBranches: 0,
    cracks: 0,
    deadBranches: 0,
    inclination: 0,
    VForks: 0,
    cavities: 0,
    barkDamage: 0,
    soilLifting: 0,
    cutRoots: 0,
    basalRot: 0,
    exposedRoots: 0,
    wind: 0,
    drought: 0,
    status: 0,
  };

  const validationSchema = Yup.object({
    element_id: Yup.number().required(
      t('admin.pages.evas.form.validation.element_required'),
    ),
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

  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const today = new Date();
      const birthDate = subMonths(subYears(today, values.years), values.months);
      const formattedDate = format(birthDate, 'yyyy-MM-dd');
      const status =
        values.unbalancedCrown +
        values.overextendedBranches +
        values.cracks +
        values.deadBranches +
        values.inclination +
        values.VForks +
        values.cavities +
        values.barkDamage +
        values.soilLifting +
        values.cutRoots +
        values.basalRot +
        values.exposedRoots;

      const updatedValues = {
        ...values,
        date_birth: formattedDate,
        status,
        unbalanced_crown: values.unbalancedCrown,
        overextended_branches: values.overextendedBranches,
        cracks: values.cracks,
        dead_branches: values.deadBranches,
        inclination: values.inclination,
        V_forks: values.VForks,
        cavities: values.cavities,
        bark_damage: values.barkDamage,
        soil_lifting: values.soilLifting,
        cut_damaged_roots: values.cutRoots,   
        basal_rot: values.basalRot,
        exposed_surface_roots: values.exposedRoots,
        wind: values.wind,
        drought: values.drought,
      };

      await axiosClient.post('/admin/evas', updatedValues);

      if (redirectPath) {
        onClose();
      } else {
        showToast('success', t('admin.pages.evas.list.messages.createSuccess'));
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

  if (loading) {
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
          {t('admin.pages.evas.form.title.create')}
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
            onSubmit={handleSubmit}>
            {() => (
              <Form className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Sección: Identificación */}
                <div className="md:col-span-1 p-4 rounded-lg border border-gray-300 bg-gray-100">
                  <h1 className="text-xl font-bold mb-4">
                    {t('admin.pages.evas.create.identification')}
                  </h1>
                  <FormField
                    name="element_id"
                    label={t('admin.pages.evas.form.name')}
                    as={Dropdown}
                    options={elements.map((element) => ({
                      label: element.id,
                      value: element.id,
                    }))}
                    optionLabel="label"
                    optionValue="value"
                    disabled={!!preselectedElementId}
                  />
                  <FormField
                    name="years"
                    label={t('admin.pages.evas.form.years')}
                    as={InputNumber}
                    min={0}
                  />
                  <FormField
                    name="months"
                    label={t('admin.pages.evas.form.months')}
                    as={InputNumber}
                    min={0}
                    max={11}
                  />
                </div>
                {/* Sección: Condición del árbol */}
                <div className="md:col-span-1">
                  <div className="p-4 rounded-lg border border-gray-300 bg-gray-100">
                    <h1 className="text-xl font-bold mb-4">
                      {t('admin.pages.evas.create.treeCondition')}
                    </h1>

                    {/* Subsección: Dimensiones */}
                    <h2 className="text-lg font-semibold mb-2">
                      {t('admin.pages.evas.create.dimensions')}
                    </h2>
                    <FormField
                      name="height"
                      label={`${t('admin.pages.evas.form.height')} (m)`}
                      as={InputNumber}
                    />
                    <FormField
                      name="diameter"
                      label={`${t('admin.pages.evas.form.diameter')} (cm)`}
                      as={InputNumber}
                    />
                    <FormField
                      name="crown_width"
                      label={`${t('admin.pages.evas.form.crown_width')} (m)`}
                      as={InputNumber}
                    />
                    <FormField
                      name="crown_projection_area"
                      label={`${t('admin.pages.evas.form.crown_projection_area')} (m²)`}
                      as={InputNumber}
                    />
                    <FormField
                      name="root_surface_diameter"
                      label={`${t('admin.pages.evas.form.root_surface_diameter')} (m)`}
                      as={InputNumber}
                    />
                    <FormField
                      name="effective_root_area"
                      label={`${t('admin.pages.evas.form.effective_root_area')} (m²)`}
                      as={InputNumber}
                    />
                    <FormField
                      name="height_estimation"
                      label={`${t('admin.pages.evas.form.height_estimation')} (m)`}
                      as={InputNumber}
                    />
                  </div>
                </div>
                <div className="md:col-span-2 p-4 rounded-lg border border-gray-300 bg-gray-100">
                  {/* Subsección: Estado */}
                  <h2 className="text-lg font-semibold mb-2">
                    {t('admin.pages.evas.create.state')}
                  </h2>

                  {/* Subsubsección: Copa y Ramas */}
                  <h3 className="text-md font-medium mb-2">
                    {t('admin.pages.evas.create.crownBranches')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      name="unbalancedCrown"
                      label={t('admin.pages.evas.form.unbalanced_crown')}
                      as={Dropdown}
                      options={dictionaries.unbalancedCrown}
                    />
                    <FormField
                      name="overextendedBranches"
                      label={t('admin.pages.evas.form.overextended_branches')}
                      as={Dropdown}
                      options={dictionaries.overextendedBranches}
                    />
                    <FormField
                      name="cracks"
                      label={t('admin.pages.evas.form.cracks')}
                      as={Dropdown}
                      options={dictionaries.cracks}
                    />
                    <FormField
                      name="deadBranches"
                      label={t('admin.pages.evas.form.dead_branches')}
                      as={Dropdown}
                      options={dictionaries.deadBranches}
                    />
                  </div>

                  {/* Subsubsección: Tronco */}
                  <h3 className="text-md font-medium mt-4 mb-2">
                    {t('admin.pages.evas.create.trunk')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      name="inclination"
                      label={t('admin.pages.evas.form.inclination')}
                      as={Dropdown}
                      options={dictionaries.inclination}
                    />
                    <FormField
                      name="VForks"
                      label={t('admin.pages.evas.form.V_forks')}
                      as={Dropdown}
                      options={dictionaries.VForks}
                    />
                    <FormField
                      name="cavities"
                      label={t('admin.pages.evas.form.cavities')}
                      as={Dropdown}
                      options={dictionaries.cavities}
                    />
                    <FormField
                      name="barkDamage"
                      label={t('admin.pages.evas.form.bark_damage')}
                      as={Dropdown}
                      options={dictionaries.barkDamage}
                    />
                  </div>

                  {/* Subsubsección: Raíces */}
                  <h3 className="text-md font-medium mt-4 mb-2">
                    {t('admin.pages.evas.create.roots')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      name="soilLifting"
                      label={t('admin.pages.evas.form.soil_lifting')}
                      as={Dropdown}
                      options={dictionaries.soilLifting}
                    />
                    <FormField
                      name="cutRoots"
                      label={t('admin.pages.evas.form.cut_damaged_roots')}
                      as={Dropdown}
                      options={dictionaries.cutRoots}
                    />
                    <FormField
                      name="basalRot"
                      label={t('admin.pages.evas.form.basal_rot')}
                      as={Dropdown}
                      options={dictionaries.basalRot}
                    />
                    <FormField
                      name="exposedRoots"
                      label={t('admin.pages.evas.form.exposed_surface_roots')}
                      as={Dropdown}
                      options={dictionaries.exposedRoots}
                    />
                  </div>
                </div>
                <div className="md:col-span-2 p-4 rounded-lg border border-gray-300 bg-gray-100">
                  {/* Sección: Condición del entorno */}
                  <div>
                    <h1 className="text-xl font-bold mb-4">
                      {t('admin.pages.evas.create.environmentCondition')}
                    </h1>

                    {/* Subsección: Factores Ambientales */}
                    <h2 className="text-lg font-semibold mb-2">
                      {t('admin.pages.evas.create.environmentalFactors')}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Subsubsección: Exposición al viento */}
                      <FormField
                        name="wind"
                        label={t('admin.pages.evas.form.wind')}
                        as={Dropdown}
                        options={dictionaries.wind}
                      />

                      {/* Subsubsección: Exposición a la sequía */}
                      <FormField
                        name="drought"
                        label={t('admin.pages.evas.form.drought')}
                        as={Dropdown}
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
};

export default CreateEva;
