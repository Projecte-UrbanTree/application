import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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

const CreateWorkOrder = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const currentContract = useSelector(
    (state: RootState) => state.contract.currentContract,
  );
  const [users, setUsers] = useState<any[]>([]);
  const [zones, setZones] = useState<any[]>([]);
  const [taskTypes, setTaskTypes] = useState<any[]>([]);
  const [elementTypes, setElementTypes] = useState<any[]>([]);
  const [treeTypes, setTreeTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number[]>([]);

  const fetchInitialData = useCallback(async () => {
    try {
      const response = await axiosClient.get(
        `/admin/work-orders/create${currentContract ? `?contract_id=${currentContract.id}` : ''}`,
      );
      setUsers(response.data.users);
      setZones(response.data.zones);
      setTaskTypes(response.data.task_types);
      setElementTypes(response.data.element_types);
      setTreeTypes(response.data.tree_types);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    } finally {
      setLoading(false);
    }
  }, [currentContract]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    setActiveIndex([0]);
  }, []);

  const initialValues = {
    date: null,
    selectedUsers: [],
    blocks: [
      {
        notes: '',
        zones: [],
        tasks: [
          { task_type_id: null, element_type_id: null, tree_type_id: null },
        ],
      },
    ],
  };

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

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const formattedDate = values.date
        ? `${values.date.getFullYear()}-${String(values.date.getMonth() + 1).padStart(2, '0')}-${String(values.date.getDate()).padStart(2, '0')}`
        : null;
      const userIds = values.selectedUsers.map((user: any) => user.id);
      const formattedBlocks = values.blocks.map((block: any) => ({
        notes: block.notes,
        zones: block.zones
          .filter(Boolean)
          .map((zone: any) => (typeof zone === 'object' ? zone.id : zone)),
        tasks: block.tasks.map((task: any) => ({
          task_type_id: task.task_type_id,
          element_type_id: task.element_type_id,
          tree_type_id: task.tree_type_id,
        })),
      }));
      await axiosClient.post('/admin/work-orders', {
        date: formattedDate,
        users: userIds,
        contract_id: currentContract?.id,
        blocks: formattedBlocks,
      });
      navigate('/admin/work-orders', {
        state: {
          success: t('admin.pages.workOrders.list.messages.createSuccess'),
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

  const userTemplate = useCallback(
    (option: any) => (
      <div className="flex items-center">
        <div>
          {option.name} {option.surname}
        </div>
      </div>
    ),
    [],
  );

  const zoneTemplate = useCallback(
    (option: any) => (
      <div className="flex items-center">
        <div>{option.name}</div>
      </div>
    ),
    [],
  );

  const requiresTreeType = useCallback(
    (elementTypeId: number | null) => {
      if (!elementTypeId) return false;
      const elementType = elementTypes.find(
        (et: any) => et.id === elementTypeId,
      );
      return elementType && elementType.requires_tree_type;
    },
    [elementTypes],
  );

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

  if (!currentContract) {
    return (
      <>
        <div className="flex items-center mb-4">
          <Button
            icon={<Icon icon="tabler:arrow-left" className="h-5 w-5" />}
            className="p-button-text mr-3"
            onClick={() => navigate('/admin/work-orders')}
          />
          <h2 className="text-xl font-semibold text-gray-800">
            {t('admin.pages.workOrders.form.title.create')}
          </h2>
        </div>
        
        <Card className="border border-gray-300 bg-gray-50 rounded shadow-sm">
          <div className="p-4 text-center">
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
      </>
    );
  }

  return (
    <>
      <div className="flex items-center mb-4">
        <Button
          icon={<Icon icon="tabler:arrow-left" className="h-5 w-5" />}
          className="p-button-text mr-3"
          onClick={() => navigate('/admin/work-orders')}
        />
        <h2 className="text-xl font-semibold text-gray-800">
          {t('admin.pages.workOrders.form.title.create')}
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
            {({ errors, touched, setFieldValue, values }) => (
              <Form className="grid grid-cols-1 gap-5">
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
                  <h3 className="text-xl font-semibold text-center mb-4">
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
                        {values.blocks.map((block, index: number) => (
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
                                    className="p-button-outlined p-button-danger p-button-sm"
                                    tooltip={t('admin.pages.workOrders.form.removeBlock')}
                                    tooltipOptions={{ position: 'top' }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      remove(index);
                                    }}
                                    type="button"
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
                                {t('admin.pages.workOrders.form.fields.zones')}
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
                                    (task, taskIndex: number) => (
                                      <div
                                        key={taskIndex}
                                        className="p-2 border border-gray-300 rounded-lg">
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
                                              className="p-button-outlined p-button-danger p-button-sm"
                                              tooltip={t('admin.pages.workOrders.form.removeTask')}
                                              tooltipOptions={{ position: 'top' }}
                                              onClick={() =>
                                                removeTask(taskIndex)
                                              }
                                              type="button"
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
                                      icon={<Icon icon="tabler:plus" className="h-5 w-5 mr-2" />}
                                      label={t(
                                        'admin.pages.workOrders.form.buttons.addTask',
                                      )}
                                      className="p-button-outlined p-button-sm w-full"
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
                                {t('admin.pages.workOrders.form.fields.notes')}
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
                        ))}
                      </Accordion>
                      <div className="flex justify-center">
                        <Button
                          type="button"
                          icon={<Icon icon="tabler:plus" className="h-5 w-5 mr-2" />}
                          label={t(
                            'admin.pages.workOrders.form.buttons.addBlock',
                          )}
                          className="p-button-outlined p-button-sm w-full"
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
                <div className="flex justify-end mt-6">
                  <Button
                    type="submit"
                    severity="info"
                    disabled={isSubmitting}
                    className="p-button-sm"
                    icon={isSubmitting ? 'pi pi-spin pi-spinner' : undefined}
                    label={t('admin.pages.workOrders.form.submitButton.create')}
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

export default CreateWorkOrder;
