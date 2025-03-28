import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Formik, Form, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Icon } from '@iconify/react';
import axiosClient from '@/api/axiosClient';
import { RootState } from '@/store/store';
import { useTranslation } from 'react-i18next';
import { Message } from 'primereact/message';

interface UserType {
  id: number;
  name: string;
  surname: string;
}

interface WorkTask {
  task_type_id: number | null;
  element_type_id: number | null;
  tree_type_id: number | null;
}

interface WorkBlock {
  notes: string;
  zones: { id: number; name: string }[];
  tasks: WorkTask[];
}

interface EditWorkOrderValues {
  date: Date | null;
  selectedUsers: UserType[];
  blocks: WorkBlock[];
}

const EditWorkOrder = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const currentContract = useSelector(
    (state: RootState) => state.contract.currentContract,
  );
  const [initialValues, setInitialValues] =
    useState<EditWorkOrderValues | null>(null);
  const [users, setUsers] = useState<UserType[]>([]);
  const [zones, setZones] = useState<{ id: number; name: string }[]>([]);
  const [taskTypes, setTaskTypes] = useState<any[]>([]);
  const [elementTypes, setElementTypes] = useState<any[]>([]);
  const [treeTypes, setTreeTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [workOrderContract, setWorkOrderContract] = useState<number | null>(
    null,
  );
  const [activeIndex, setActiveIndex] = useState<number[]>([]);

  useEffect(() => {
    axiosClient
      .get(`/admin/work-orders/${id}`)
      .then((response) => {
        const data = response.data;
        setWorkOrderContract(data.contract_id);

        // Usar los trabajadores disponibles del contrato
        setUsers(
          data.available_workers.map((u: any) => ({
            id: u.id,
            name: u.name,
            surname: u.surname || '',
          })),
        );

        // Usar las zonas disponibles del contrato
        setZones(
          data.available_zones.map((z: any) => ({
            id: z.id,
            name: z.name,
          })),
        );

        // Configurar tipos de tareas, elementos y árboles
        setTaskTypes(data.task_types);
        setElementTypes(data.element_types);
        setTreeTypes(data.tree_types);

        const transformed: EditWorkOrderValues = {
          date: data.date ? new Date(data.date) : null,
          selectedUsers: data.users.map((u: any) => ({
            id: u.id,
            name: u.name,
            surname: u.surname,
          })),
          blocks: data.work_orders_blocks.map((block: any) => ({
            notes: block.notes,
            zones: block.zones.map((z: any) => ({ id: z.id, name: z.name })),
            tasks: block.block_tasks.map((task: any) => ({
              task_type_id: task.task_type_id,
              element_type_id: task.element_type_id,
              tree_type_id: task.tree_type_id || null,
            })),
          })),
        };
        setInitialValues(transformed);
        setLoading(false);
        // Inicializar activeIndex con todos los índices
        setActiveIndex(
          Array.from({ length: data.work_orders_blocks.length }, (_, i) => i),
        );
      })
      .catch(() => setLoading(false));
  }, [id]);

  const validationSchema = Yup.object({
    date: Yup.date().required(
      t('admin.pages.workOrders.form.validation.date_required'),
    ),
    selectedUsers: Yup.array().min(
      1,
      t('admin.pages.workOrders.form.validation.users_required'),
    ),
    blocks: Yup.array()
      .of(
        Yup.object({
          notes: Yup.string().nullable(),
          zones: Yup.array().min(
            1,
            t('admin.pages.workOrders.form.validation.zones_required'),
          ),
          tasks: Yup.array()
            .of(
              Yup.object({
                task_type_id: Yup.number()
                  .nullable()
                  .required(
                    t(
                      'admin.pages.workOrders.form.validation.task_type_required',
                    ),
                  ),
                element_type_id: Yup.number()
                  .nullable()
                  .required(
                    t(
                      'admin.pages.workOrders.form.validation.element_type_required',
                    ),
                  ),
                tree_type_id: Yup.number().nullable(),
              }),
            )
            .min(1, t('admin.pages.workOrders.form.validation.tasks_required')),
        }),
      )
      .min(1, t('admin.pages.workOrders.form.validation.blocks_required')),
  });

  const handleSubmit = async (
    values: EditWorkOrderValues,
    { setSubmitting }: any,
  ) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const formattedDate = values.date
        ? `${values.date.getFullYear()}-${String(values.date.getMonth() + 1).padStart(2, '0')}-${String(values.date.getDate()).padStart(2, '0')}`
        : null;
      const userIds = values.selectedUsers.map((user) => user.id);
      const formattedBlocks = values.blocks.map((block) => ({
        notes: block.notes,
        zones: block.zones
          .filter(Boolean)
          .map((zone) => (typeof zone === 'object' ? zone.id : zone)),
        tasks: block.tasks.map((task) => ({
          task_type_id: task.task_type_id,
          element_type_id: task.element_type_id,
          tree_type_id: task.tree_type_id,
        })),
      }));
      await axiosClient.put(`/admin/work-orders/${id}`, {
        date: formattedDate,
        users: userIds,
        blocks: formattedBlocks,
      });
      navigate('/admin/work-orders', {
        state: {
          success: t('admin.pages.workOrders.list.messages.updateSuccess'),
        },
      });
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          t('admin.pages.workOrders.list.messages.error'),
      );
      setSubmitting(false);
      setIsSubmitting(false);
    }
  };

  const userTemplate = (option: UserType) => (
    <div className="flex items-center">
      <div>
        {option.name} {option.surname}
      </div>
    </div>
  );

  const zoneTemplate = (option: { id: number; name: string }) => (
    <div className="flex items-center">
      <div>{option.name}</div>
    </div>
  );

  const requiresTreeType = (elementTypeId: number | null): boolean => {
    if (!elementTypeId) return false;
    const elementType = elementTypes.find((et: any) => et.id === elementTypeId);
    return elementType && elementType.requires_tree_type;
  };

  if (loading || !initialValues) {
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

  if (!currentContract && !workOrderContract) {
    return (
      <div className="flex items-center justify-center bg-gray-50 p-4 md:p-6">
        <Card className="w-full max-w-3xl shadow-lg">
          <div className="p-6 text-center">
            <Icon
              icon="tabler:alert-circle"
              className="h-16 w-16 text-yellow-500 mx-auto mb-4"
            />
            <h2 className="text-2xl font-bold mb-4">
              {t('admin.pages.workOrders.form.noContract.title')}
            </h2>
            <p className="text-gray-600 mb-6">
              {t('admin.pages.workOrders.form.noContract.message')}
            </p>
            <Button
              label={t('admin.pages.workOrders.form.returnButton')}
              icon="pi pi-arrow-left"
              onClick={() => navigate('/admin/work-orders')}
            />
          </div>
        </Card>
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
            onClick={() => navigate('/admin/work-orders')}>
            <Icon icon="tabler:arrow-left" className="h-6 w-6" />
          </Button>
          <h2 className="text-white text-3xl font-bold">
            {t('admin.pages.workOrders.form.title.edit')}
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
            {({ errors, touched, setFieldValue, values }) => (
              <Form className="grid grid-cols-1 gap-4">
                <div className="flex flex-col">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Icon icon="tabler:calendar" className="h-5 w-5 mr-2" />
                    {t('admin.pages.workOrders.form.fields.date')}
                  </label>
                  <Calendar
                    id="date"
                    value={values.date}
                    onChange={(e) => setFieldValue('date', e.value)}
                    showIcon
                    dateFormat="dd/mm/yy"
                    className={
                      errors.date && touched.date
                        ? 'p-invalid w-full'
                        : 'w-full'
                    }
                  />
                  <ErrorMessage
                    name="date"
                    component="small"
                    className="p-error"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Icon icon="tabler:users" className="h-5 w-5 mr-2" />
                    {t('admin.pages.workOrders.form.fields.users')}
                  </label>
                  <MultiSelect
                    value={values.selectedUsers}
                    options={users}
                    onChange={(e) => setFieldValue('selectedUsers', e.value)}
                    optionLabel="name"
                    placeholder={t(
                      'admin.pages.workOrders.form.placeholders.users',
                    )}
                    filter
                    itemTemplate={userTemplate}
                    className={
                      errors.selectedUsers && touched.selectedUsers
                        ? 'p-invalid w-full'
                        : 'w-full'
                    }
                    display="chip"
                  />
                  <ErrorMessage
                    name="selectedUsers"
                    component="small"
                    className="p-error"
                  />
                </div>
                <div className="my-6">
                  <h3 className="text-2xl font-bold text-center mb-4">
                    {t('admin.pages.workOrders.form.blocksTitle')}
                  </h3>
                </div>
                <FieldArray name="blocks">
                  {({ remove, push }) => (
                    <div className="space-y-4">
                      <Accordion
                        activeIndex={activeIndex}
                        onTabChange={(e) =>
                          setActiveIndex(
                            Array.isArray(e.index) ? e.index : [e.index],
                          )
                        }
                        multiple>
                        {values.blocks.map(
                          (block: WorkBlock, index: number) => (
                            <AccordionTab
                              key={index}
                              header={
                                <div className="flex items-center justify-between w-full">
                                  <span>
                                    {t(
                                      'admin.pages.workOrders.form.fields.block',
                                    )}{' '}
                                    {index + 1}
                                  </span>
                                  {values.blocks.length > 1 && (
                                    <Button
                                      icon={
                                        <Icon
                                          icon="tabler:trash"
                                          className="h-5 w-5"
                                        />
                                      }
                                      className="p-button-rounded p-button-danger"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        remove(index);
                                      }}
                                      type="button"
                                      aria-label={t(
                                        'admin.pages.workOrders.form.removeBlock',
                                      )}
                                    />
                                  )}
                                </div>
                              }>
                              <div className="flex flex-col mb-3">
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                  <Icon
                                    icon="tabler:map-pin"
                                    className="h-5 w-5 mr-2"
                                  />
                                  {t(
                                    'admin.pages.workOrders.form.fields.zones',
                                  )}
                                </label>
                                <MultiSelect
                                  value={values.blocks[index].zones}
                                  options={zones}
                                  onChange={(e) =>
                                    setFieldValue(
                                      `blocks[${index}].zones`,
                                      e.value,
                                    )
                                  }
                                  optionLabel="name"
                                  placeholder={t(
                                    'admin.pages.workOrders.form.placeholders.zones',
                                  )}
                                  filter
                                  itemTemplate={zoneTemplate}
                                  className="w-full"
                                  display="chip"
                                />
                                <ErrorMessage
                                  name={`blocks[${index}].zones`}
                                  component="small"
                                  className="p-error"
                                />
                              </div>
                              <FieldArray name={`blocks[${index}].tasks`}>
                                {({ remove: removeTask, push: pushTask }) => (
                                  <div className="space-y-3 mt-6">
                                    {values.blocks[index].tasks.map(
                                      (task: WorkTask, taskIndex: number) => (
                                        <div
                                          key={taskIndex}
                                          className="p-2 border border-gray-200 rounded-lg">
                                          <div className="flex justify-between items-center mb-2">
                                            <h5 className="text-sm font-semibold">
                                              {t(
                                                'admin.pages.workOrders.form.fields.task',
                                              )}{' '}
                                              {taskIndex + 1}
                                            </h5>
                                            {values.blocks[index].tasks.length >
                                              1 && (
                                              <Button
                                                icon={
                                                  <Icon
                                                    icon="tabler:trash"
                                                    className="h-4 w-4"
                                                  />
                                                }
                                                className="p-button-rounded p-button-danger p-button-sm"
                                                onClick={() =>
                                                  removeTask(taskIndex)
                                                }
                                                type="button"
                                                aria-label={t(
                                                  'admin.pages.workOrders.form.removeTask',
                                                )}
                                              />
                                            )}
                                          </div>
                                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                            <div className="flex flex-col">
                                              <label className="text-xs font-medium text-gray-700 mb-1">
                                                {t(
                                                  'admin.pages.workOrders.form.fields.taskType',
                                                )}
                                              </label>
                                              <Dropdown
                                                value={task.task_type_id}
                                                options={taskTypes}
                                                onChange={(e) =>
                                                  setFieldValue(
                                                    `blocks[${index}].tasks[${taskIndex}].task_type_id`,
                                                    e.value,
                                                  )
                                                }
                                                optionLabel="name"
                                                optionValue="id"
                                                placeholder={t(
                                                  'admin.pages.workOrders.form.placeholders.taskType',
                                                )}
                                                className="w-full"
                                              />
                                              <ErrorMessage
                                                name={`blocks[${index}].tasks[${taskIndex}].task_type_id`}
                                                component="small"
                                                className="p-error"
                                              />
                                            </div>
                                            <div className="flex flex-col">
                                              <label className="text-xs font-medium text-gray-700 mb-1">
                                                {t(
                                                  'admin.pages.workOrders.form.fields.elementType',
                                                )}
                                              </label>
                                              <Dropdown
                                                value={task.element_type_id}
                                                options={elementTypes}
                                                onChange={(e) => {
                                                  setFieldValue(
                                                    `blocks[${index}].tasks[${taskIndex}].element_type_id`,
                                                    e.value,
                                                  );
                                                  if (
                                                    !requiresTreeType(e.value)
                                                  ) {
                                                    setFieldValue(
                                                      `blocks[${index}].tasks[${taskIndex}].tree_type_id`,
                                                      null,
                                                    );
                                                  }
                                                }}
                                                optionLabel="name"
                                                optionValue="id"
                                                placeholder={t(
                                                  'admin.pages.workOrders.form.placeholders.elementType',
                                                )}
                                                className="w-full"
                                              />
                                              <ErrorMessage
                                                name={`blocks[${index}].tasks[${taskIndex}].element_type_id`}
                                                component="small"
                                                className="p-error"
                                              />
                                            </div>
                                            <div className="flex flex-col">
                                              <label className="text-xs font-medium text-gray-700 mb-1">
                                                {t(
                                                  'admin.pages.workOrders.form.fields.treeType',
                                                )}
                                              </label>
                                              <Dropdown
                                                value={task.tree_type_id}
                                                options={treeTypes}
                                                onChange={(e) =>
                                                  setFieldValue(
                                                    `blocks[${index}].tasks[${taskIndex}].tree_type_id`,
                                                    e.value,
                                                  )
                                                }
                                                optionLabel="species"
                                                optionValue="id"
                                                placeholder={t(
                                                  'admin.pages.workOrders.form.placeholders.treeType',
                                                )}
                                                className="w-full"
                                                disabled={
                                                  !requiresTreeType(
                                                    task.element_type_id,
                                                  )
                                                }
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      ),
                                    )}
                                    <div className="flex justify-center mt-2">
                                      <Button
                                        type="button"
                                        icon="pi pi-plus"
                                        label={t(
                                          'admin.pages.workOrders.form.buttons.addTask',
                                        )}
                                        className="p-button-outlined p-button-sm"
                                        onClick={() =>
                                          pushTask({
                                            task_type_id: null,
                                            element_type_id: null,
                                            tree_type_id: null,
                                          })
                                        }
                                      />
                                    </div>
                                  </div>
                                )}
                              </FieldArray>
                              <div className="flex flex-col mt-3">
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                  <Icon
                                    icon="tabler:notes"
                                    className="h-5 w-5 mr-2"
                                  />
                                  {t(
                                    'admin.pages.workOrders.form.fields.notes',
                                  )}
                                </label>
                                <InputTextarea
                                  rows={3}
                                  value={values.blocks[index].notes}
                                  onChange={(e) =>
                                    setFieldValue(
                                      `blocks[${index}].notes`,
                                      e.target.value,
                                    )
                                  }
                                  className="w-full"
                                  placeholder={t(
                                    'admin.pages.workOrders.form.placeholders.notes',
                                  )}
                                />
                              </div>
                            </AccordionTab>
                          ),
                        )}
                      </Accordion>
                      <div className="flex justify-center">
                        <Button
                          type="button"
                          icon="pi pi-plus"
                          label={t(
                            'admin.pages.workOrders.form.buttons.addBlock',
                          )}
                          className="p-button-outlined"
                          onClick={() => {
                            const newIndex = values.blocks.length;
                            push({
                              notes: '',
                              zones: [],
                              tasks: [
                                {
                                  task_type_id: null,
                                  element_type_id: null,
                                  tree_type_id: null,
                                },
                              ],
                            });
                            setActiveIndex([...activeIndex, newIndex]);
                          }}
                        />
                      </div>
                    </div>
                  )}
                </FieldArray>
                <div className="flex justify-end mt-4">
                  <Button
                    type="submit"
                    icon="pi pi-check"
                    label={t('admin.pages.workOrders.form.submitButton.edit')}
                    className="w-full md:w-auto"
                    loading={isSubmitting}
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

export default EditWorkOrder;
