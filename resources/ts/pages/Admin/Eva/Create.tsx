import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, useField } from 'formik';
import * as Yup from 'yup';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Icon } from '@iconify/react';
import axiosClient from '@/api/axiosClient';
import { useTranslation } from 'react-i18next';
import { Message } from 'primereact/message';
import { subYears, subMonths, format } from 'date-fns';

const FormField = ({ as: Component, name, label, ...props }: any) => {
  const [field, meta, helpers] = useField(name);

  if (Component === InputNumber) {
    return (
      <div className="mb-4">
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <InputNumber
          id={name}
          value={field.value}
          onValueChange={(e) => helpers.setValue(e.value)}
          {...props}
        />
        {meta.touched && meta.error ? (
          <div className="text-red-500 text-sm">{meta.error}</div>
        ) : null}
      </div>
    );
  }

  if (Component === Dropdown) {
    return (
      <div className="mb-4">
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <Dropdown
          id={name}
          value={field.value}
          onChange={(e) => helpers.setValue(e.value)}
          optionLabel="label"
          optionValue="value"
          {...props}
        />
        {meta.touched && meta.error ? (
          <div className="text-red-500 text-sm">{meta.error}</div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <Component id={name} {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="text-red-500 text-sm">{meta.error}</div>
      ) : null}
    </div>
  );
};

const CreateEva = () => {
  const navigate = useNavigate();
  const [elements, setElements] = useState<any[]>([]);
  const [dictionaries, setDictionaries] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    axiosClient
      .get('/admin/evas/create')
      .then((response) => {
        setElements(response.data.elements);
        setDictionaries(response.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const initialValues = {
    element_id: null,
    date_birth: null,
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
  };

  const validationSchema = Yup.object({
    element_id: Yup.number().required(
      t('admin.pages.evas.form.validation.element_required'),
    ),
    date_birth: Yup.date().required(
      t('admin.pages.evas.form.validation.date_required'),
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
        values.unbalanced_crown +
        values.overextended_branches +
        values.cracks +
        values.dead_branches +
        values.inclination +
        values.V_forks +
        values.cavities +
        values.bark_damage +
        values.soil_lifting +
        values.cut_damaged_roots +
        values.basal_rot +
        values.exposed_surface_roots;

      const updatedValues = {
        ...values,
        date_birth: formattedDate,
        status,
      };

      await axiosClient.post('/admin/evas', updatedValues);
      navigate('/admin/evas', {
        state: { success: t('admin.pages.evas.list.messages.createSuccess') },
      });
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          t('admin.pages.evas.list.messages.error'),
      );
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <ProgressSpinner
          style={{ width: '50px', height: '50px' }}
          strokeWidth="4"
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
            onClick={() => navigate('/admin/evas')}>
            <Icon icon="tabler:arrow-left" className="h-6 w-6" />
          </Button>
          <h2 className="text-white text-3xl font-bold">
            {t('admin.pages.evas.form.title.create')}
          </h2>
        </header>
        <div className="p-6">
          {error && (
            <Message severity="error" text={error} className="mb-4 w-full" />
          )}
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}>
            {({ isSubmitting }) => (
              <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <h1 className="text-xl font-bold mb-4">Identificación</h1>
                  <FormField
                    name="element_id"
                    label={t('admin.pages.evas.form.element_id')}
                    as="input"
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
                <div className="md:col-span-2">
                  <h1 className="text-xl font-bold mb-4">
                    Condición del árbol
                  </h1>
                  <h2 className="text-lg font-semibold mb-2">Dimensiones</h2>
                  <FormField
                    name="height"
                    label={t('admin.pages.evas.form.height')}
                    as={InputNumber}
                  />
                  <FormField
                    name="diameter"
                    label={t('admin.pages.evas.form.diameter')}
                    as={InputNumber}
                  />
                  <FormField
                    name="crown_width"
                    label={t('admin.pages.evas.form.crown_width')}
                    as={InputNumber}
                  />
                  <FormField
                    name="crown_projection_area"
                    label={t('admin.pages.evas.form.crown_projection_area')}
                    as={InputNumber}
                  />
                  <FormField
                    name="root_surface_diameter"
                    label={t('admin.pages.evas.form.root_surface_diameter')}
                    as={InputNumber}
                  />
                  <FormField
                    name="effective_root_area"
                    label={t('admin.pages.evas.form.effective_root_area')}
                    as={InputNumber}
                  />
                  <FormField
                    name="height_estimation"
                    label={t('admin.pages.evas.form.height_estimation')}
                    as={InputNumber}
                  />
                  <h2 className="text-lg font-semibold mt-4 mb-2">Estado</h2>
                  <h3 className="text-md font-medium mb-2">Copa y Ramas</h3>
                  <FormField
                    name="unbalanced_crown"
                    label={t('admin.pages.evas.form.unbalanced_crown')}
                    as={Dropdown}
                    options={dictionaries.copaDesequilibrada}
                  />
                  <FormField
                    name="overextended_branches"
                    label={t('admin.pages.evas.form.overextended_branches')}
                    as={Dropdown}
                    options={dictionaries.ramasSobreextendidas}
                  />
                  <FormField
                    name="cracks"
                    label={t('admin.pages.evas.form.cracks')}
                    as={Dropdown}
                    options={dictionaries.grietas}
                  />
                  <FormField
                    name="dead_branches"
                    label={t('admin.pages.evas.form.dead_branches')}
                    as={Dropdown}
                    options={dictionaries.ramasMuertas}
                  />
                  <h3 className="text-md font-medium mt-4 mb-2">Tronco</h3>
                  <FormField
                    name="inclination"
                    label={t('admin.pages.evas.form.inclination')}
                    as={Dropdown}
                    options={dictionaries.inclinacion}
                  />
                  <FormField
                    name="V_forks"
                    label={t('admin.pages.evas.form.V_forks')}
                    as={Dropdown}
                    options={dictionaries.bifurcacionesV}
                  />
                  <FormField
                    name="cavities"
                    label={t('admin.pages.evas.form.cavities')}
                    as={Dropdown}
                    options={dictionaries.cavidades}
                  />
                  <FormField
                    name="bark_damage"
                    label={t('admin.pages.evas.form.bark_damage')}
                    as={Dropdown}
                    options={dictionaries.danosCorteza}
                  />
                  <h3 className="text-md font-medium mt-4 mb-2">Raíces</h3>
                  <FormField
                    name="soil_lifting"
                    label={t('admin.pages.evas.form.soil_lifting')}
                    as={Dropdown}
                    options={dictionaries.levantamientoSuelo}
                  />
                  <FormField
                    name="cut_damaged_roots"
                    label={t('admin.pages.evas.form.cut_damaged_roots')}
                    as={Dropdown}
                    options={dictionaries.raicesCortadas}
                  />
                  <FormField
                    name="basal_rot"
                    label={t('admin.pages.evas.form.basal_rot')}
                    as={Dropdown}
                    options={dictionaries.podredumbreBasal}
                  />
                  <FormField
                    name="exposed_surface_roots"
                    label={t('admin.pages.evas.form.exposed_surface_roots')}
                    as={Dropdown}
                    options={dictionaries.raicesExpuestas}
                  />
                </div>
                <div className="md:col-span-2">
                  <h1 className="text-xl font-bold mt-6 mb-4">
                    Condición del entorno
                  </h1>
                  <h2 className="text-lg font-semibold mb-2">
                    Factores Ambientales
                  </h2>
                  <h3 className="text-md font-medium mb-2">
                    Exposición al viento
                  </h3>
                  <FormField
                    name="wind"
                    label={t('admin.pages.evas.form.wind')}
                    as={Dropdown}
                    options={dictionaries.viento}
                  />
                  <h3 className="text-md font-medium mt-4 mb-2">
                    Exposición a la sequía
                  </h3>
                  <FormField
                    name="drought"
                    label={t('admin.pages.evas.form.drought')}
                    as={Dropdown}
                    options={dictionaries.sequia}
                  />
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
};

export default CreateEva;
