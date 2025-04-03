import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, useField } from 'formik';
import * as Yup from 'yup';
import axiosClient from '@/api/axiosClient';
import { useTranslation } from 'react-i18next';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import {
  differenceInYears,
  differenceInMonths,
  subYears,
  subMonths,
  format,
} from 'date-fns';

interface FormFieldProps {
  as: React.ElementType;
  name: string;
  label: string;
  [key: string]: any;
}

const FormField = ({
  as: Component,
  name,
  label,
  ...props
}: FormFieldProps) => {
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

export default function EditEva() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

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
        const response = await axiosClient.get(`/admin/evas/${id}`);
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
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };
    fetchEva();
  }, [id]);

  useEffect(() => {
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
    fetchDictionaries();
  }, []);

  const validationSchema = Yup.object({
    element_id: Yup.number(),
    date_birth: Yup.date(),
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

      await axiosClient.put(`/admin/evas/${id}`, payload);
      navigate(`/admin/evas/${id}`, {
        state: { success: t('messages.updateSuccess') },
      });
    } catch (error) {
      console.error('Error en handleSubmit:', error);
      navigate(`/admin/evas/${id}`, { state: { error: t('messages.error') } });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Icon
          icon="eos-icons:loading"
          className="h-8 w-8 animate-spin text-blue-600"
        />
        <span className="mt-2 text-blue-600">{t('general.loading')}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center bg-gray-50 p-4 md:p-6">
      <Card className="w-full max-w-3xl shadow-lg">
        <header className="bg-blue-700 px-6 py-4 flex items-center -mt-6 -mx-6 rounded-t-lg">
          <Button
            className="p-button-text mr-4"
            style={{ color: '#fff' }}
            onClick={() => navigate(`/admin/evas/${id}`)}>
            <Icon icon="tabler:arrow-left" className="h-6 w-6" />
          </Button>
          <h2 className="text-white text-3xl font-bold">
            {t('admin.pages.evas.edit.title')}
          </h2>
        </header>
        <div className="p-6">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize>
            {({ isSubmitting }) => (
              <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Sección: Identificación */}
                <div className="md:col-span-1 p-4 rounded-lg border-2 border-gray-300 bg-gray-50">
                  <h1 className="text-xl font-bold mb-4">
                    {t('admin.pages.evas.edit.identification')}
                  </h1>
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
                  <div className="md:col-span-1 p-4 rounded-lg border-2 border-gray-300 bg-gray-50">
                    <h1 className="text-xl font-bold mb-4">
                      {t('admin.pages.evas.edit.treeCondition')}
                    </h1>

                    {/* Subsección: Dimensiones */}
                    <h2 className="text-lg font-semibold mb-2">
                      {t('admin.pages.evas.edit.dimensions')}
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
                <div className="md:col-span-2 p-4 rounded-lg border-2 border-gray-300 bg-gray-50 mb-6">
                  {/* Subsección: Estado */}
                  <h2 className="text-lg font-semibold mb-2">
                    {t('admin.pages.evas.edit.state')}
                  </h2>

                  {/* Subsubsección: Copa y Ramas */}
                  <h3 className="text-md font-medium mb-2">
                    {t('admin.pages.evas.edit.crownBranches')}
                  </h3>
                  <FormField
                    name="unbalanced_crown"
                    label={t('admin.pages.evas.form.unbalanced_crown')}
                    as={Dropdown}
                    options={dictionaries.unbalancedCrown}
                  />
                  <FormField
                    name="overextended_branches"
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
                    name="dead_branches"
                    label={t('admin.pages.evas.form.dead_branches')}
                    as={Dropdown}
                    options={dictionaries.deadBranches}
                  />

                  {/* Subsubsección: Tronco */}
                  <h3 className="text-md font-medium mt-4 mb-2">
                    {t('admin.pages.evas.edit.trunk')}
                  </h3>
                  <FormField
                    name="inclination"
                    label={t('admin.pages.evas.form.inclination')}
                    as={Dropdown}
                    options={dictionaries.inclination}
                  />
                  <FormField
                    name="V_forks"
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
                    name="bark_damage"
                    label={t('admin.pages.evas.form.bark_damage')}
                    as={Dropdown}
                    options={dictionaries.barkDamage}
                  />

                  {/* Subsubsección: Raíces */}
                  <h3 className="text-md font-medium mt-4 mb-2">
                    {t('admin.pages.evas.edit.roots')}
                  </h3>
                  <FormField
                    name="soil_lifting"
                    label={t('admin.pages.evas.form.soil_lifting')}
                    as={Dropdown}
                    options={dictionaries.soilLifting}
                  />
                  <FormField
                    name="cut_damaged_roots"
                    label={t('admin.pages.evas.form.cut_damaged_roots')}
                    as={Dropdown}
                    options={dictionaries.cutRoots}
                  />
                  <FormField
                    name="basal_rot"
                    label={t('admin.pages.evas.form.basal_rot')}
                    as={Dropdown}
                    options={dictionaries.basalRot}
                  />
                  <FormField
                    name="exposed_surface_roots"
                    label={t('admin.pages.evas.form.exposed_surface_roots')}
                    as={Dropdown}
                    options={dictionaries.exposedRoots}
                  />
                </div>
                <div className="md:col-span-2 p-4 rounded-lg border-2 border-gray-300 bg-gray-50">
                  {/* Sección: Condición del entorno */}
                  <div className="md:col-span-2">
                    <h1 className="text-xl font-bold mb-4">
                      {t('admin.pages.evas.edit.environmentCondition')}
                    </h1>

                    {/* Subsección: Factores Ambientales */}
                    <h2 className="text-lg font-semibold mb-2">
                      {t('admin.pages.evas.edit.environmentalFactors')}
                    </h2>

                    {/* Subsubsección: Exposición al viento */}
                    <FormField
                      name="wind"
                      label={t('admin.pages.evas.edit.windExposure')}
                      as={Dropdown}
                      options={dictionaries.wind}
                    />

                    {/* Subsubsección: Exposición a la sequía */}
                    <FormField
                      name="drought"
                      label={t('admin.pages.evas.edit.droughtExposure')}
                      as={Dropdown}
                      options={dictionaries.drought}
                    />
                  </div>
                </div>
                <div className="md:col-span-2 flex justify-end mt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-auto"
                    icon={
                      isSubmitting ? 'pi pi-spin pi-spinner' : 'pi pi-check'
                    }
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
    </div>
  );
}
