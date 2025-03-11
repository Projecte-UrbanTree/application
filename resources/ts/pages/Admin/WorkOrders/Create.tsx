import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputTextarea } from 'primereact/inputtextarea';
import { Icon } from '@iconify/react';
import { Dropdown } from 'primereact/dropdown';
import axiosClient from '@/api/axiosClient';
import { RootState } from '@/store/store';
import { useTranslation } from 'react-i18next';
import { Message } from 'primereact/message';

const CreateWorkOrder = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<any[]>([]);
    const [zones, setZones] = useState<any[]>([]);
    const [taskTypes, setTaskTypes] = useState<any[]>([]);
    const [elementTypes, setElementTypes] = useState<any[]>([]);
    const [treeTypes, setTreeTypes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { t } = useTranslation();
    const currentContract = useSelector((state: RootState) => state.contract.currentContract);

    useEffect(() => {
        axiosClient.get('/admin/work-orders/create')
            .then(response => {
                setUsers(response.data.users);
                setZones(response.data.zones);
                setTaskTypes(response.data.task_types);
                setElementTypes(response.data.element_types);
                setTreeTypes(response.data.tree_types);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const initialValues = {
        date: null,
        selectedUsers: [],
        blocks: [{
            notes: '',
            zones: [],
            tasks: [{ task_type_id: null, element_type_id: null, tree_type_id: null }]
        }]
    };

    const validationSchema = Yup.object({
        date: Yup.date().required('La fecha es obligatoria'),
        selectedUsers: Yup.array().min(1, 'Debes seleccionar al menos un operario'),
        blocks: Yup.array().of(
            Yup.object({
                notes: Yup.string().nullable(),
                zones: Yup.array(),
                tasks: Yup.array().of(
                    Yup.object({
                        task_type_id: Yup.number().nullable().required('Tipo de tarea requerido'),
                        element_type_id: Yup.number().nullable().required('Tipo de elemento requerido'),
                        tree_type_id: Yup.number().nullable()
                    })
                )
            })
        ).min(1, 'Debe haber al menos un bloque')
    });

    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        setIsSubmitting(true);
        setError(null);
        try {
            const formattedDate = values.date ? new Date(values.date).toISOString().split('T')[0] : null;
            const userIds = values.selectedUsers.map((user: any) => user.id);
            const formattedBlocks = values.blocks.map((block: any) => ({
                notes: block.notes,
                zones: block.zones.filter(Boolean).map((zone: any) => 
                    typeof zone === 'object' ? zone.id : zone),
                tasks: block.tasks.map((task: any) => ({
                    task_type_id: task.task_type_id,
                    element_type_id: task.element_type_id,
                    tree_type_id: task.tree_type_id
                }))
            }));
            
            await axiosClient.post('/admin/work-orders', {
                date: formattedDate,
                users: userIds,
                contract_id: currentContract?.id,
                blocks: formattedBlocks
            });
            
            navigate('/admin/work-orders', { 
                state: { success: t('admin.pages.workOrders.createSuccess') }
            });
        } catch (error: any) {
            setError(error.response?.data?.message || t('admin.pages.workOrders.createError'));
            setSubmitting(false);
            setIsSubmitting(false);
        }
    };

    const userTemplate = (option: any) => (
        <div className="flex align-items-center">
            <div>{option.name} {option.surname}</div>
        </div>
    );

    const zoneTemplate = (option: any) => (
        <div className="flex align-items-center">
            <div>{option.name}</div>
        </div>
    );

    const requiresTreeType = (elementTypeId: number | null) => {
        if (!elementTypeId) return false;
        const elementType = elementTypes.find(et => et.id === elementTypeId);
        return elementType && elementType.requires_tree_type;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-4">
                <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
            </div>
        );
    }

    if (!currentContract) {
        return (
            <div className="flex items-center justify-center bg-gray-50 p-4 md:p-6">
                <Card className="w-full max-w-3xl shadow-lg">
                    <div className="p-6 text-center">
                        <Icon icon="tabler:alert-circle" className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-4">No hay contrato seleccionado</h2>
                        <p className="text-gray-600 mb-6">Debes seleccionar un contrato en el panel superior para crear una orden de trabajo.</p>
                        <Button label="Volver" icon="pi pi-arrow-left" onClick={() => navigate("/admin/work-orders")} />
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center bg-gray-50 p-4 md:p-6">
            <Card className="w-full max-w-3xl shadow-lg">
                <header className="bg-blue-700 px-6 py-4 flex items-center -mt-6 -mx-6 rounded-t-lg">
                    <Button className="p-button-text mr-4" style={{ color: "#fff" }} onClick={() => navigate("/admin/work-orders")}>
                        <Icon icon="tabler:arrow-left" className="h-6 w-6" />
                    </Button>
                    <h2 className="text-white text-3xl font-bold">Crear Orden de Trabajo</h2>
                </header>
                <div className="p-6">
                    {error && <Message severity="error" text={error} className="mb-4 w-full" />}
                    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                        {({ errors, touched, setFieldValue, values }) => (
                            <Form className="grid grid-cols-1 gap-4">
                                <div className="flex flex-col">
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                        <Icon icon="tabler:calendar" className="h-5 w-5 mr-2" />
                                        Fecha
                                    </label>
                                    <Calendar
                                        id="date"
                                        value={values.date}
                                        onChange={(e) => setFieldValue('date', e.value)}
                                        showIcon
                                        dateFormat="dd/mm/yy"
                                        className={errors.date && touched.date ? "p-invalid w-full" : "w-full"}
                                    />
                                    {errors.date && touched.date && <small className="p-error">{errors.date}</small>}
                                </div>
                                <div className="flex flex-col">
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                        <Icon icon="tabler:users" className="h-5 w-5 mr-2" />
                                        Operarios
                                    </label>
                                    <MultiSelect
                                        value={values.selectedUsers}
                                        options={users}
                                        onChange={(e) => setFieldValue('selectedUsers', e.value)}
                                        optionLabel="name"
                                        placeholder="Selecciona operarios"
                                        filter
                                        itemTemplate={userTemplate}
                                        className={errors.selectedUsers && touched.selectedUsers ? "p-invalid w-full" : "w-full"}
                                        display="chip"
                                    />
                                    {errors.selectedUsers && touched.selectedUsers && <small className="p-error">{errors.selectedUsers}</small>}
                                </div>
                                <div className="my-6">
                                    <h3 className="text-2xl font-bold text-center mb-4">Bloques de Trabajo</h3>
                                </div>
                                <FieldArray name="blocks">
                                    {({ remove, push }) => (
                                        <div className="space-y-4">
                                            {values.blocks.map((block, index) => (
                                                <Card key={index} className="shadow-sm border border-gray-200">
                                                    <div className="flex justify-between items-center mb-3">
                                                        <h4 className="text-lg font-bold flex items-center">
                                                            <Icon icon="tabler:box" className="h-5 w-5 mr-2" />
                                                            Bloque {index + 1}
                                                        </h4>
                                                        {values.blocks.length > 1 && (
                                                            <Button
                                                                icon={<Icon icon="tabler:trash" className="h-5 w-5" />}
                                                                className="p-button-rounded p-button-danger"
                                                                onClick={() => remove(index)}
                                                                type="button"
                                                                aria-label="Eliminar bloque"
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col mb-3">
                                                        <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                                            <Icon icon="tabler:map-pin" className="h-5 w-5 mr-2" />
                                                            Zonas
                                                        </label>
                                                        <MultiSelect
                                                            value={values.blocks[index].zones}
                                                            options={zones}
                                                            onChange={(e) => setFieldValue(`blocks[${index}].zones`, e.value)}
                                                            optionLabel="name"
                                                            placeholder="Selecciona zonas para este bloque"
                                                            filter
                                                            itemTemplate={zoneTemplate}
                                                            className="w-full"
                                                            display="chip"
                                                        />
                                                    </div>
                                                    <FieldArray name={`blocks[${index}].tasks`}>
                                                        {({ remove: removeTask, push: pushTask }) => (
                                                            <div className="space-y-3 mt-6">
                                                                {values.blocks[index].tasks.map((task, taskIndex) => (
                                                                    <div key={taskIndex} className="p-2 border border-gray-200 rounded-lg">
                                                                        <div className="flex justify-between items-center mb-2">
                                                                            <h5 className="text-sm font-semibold">Tarea {taskIndex + 1}</h5>
                                                                            {values.blocks[index].tasks.length > 1 && (
                                                                                <Button
                                                                                    icon={<Icon icon="tabler:trash" className="h-4 w-4" />}
                                                                                    className="p-button-rounded p-button-danger p-button-sm"
                                                                                    onClick={() => removeTask(taskIndex)}
                                                                                    type="button"
                                                                                    aria-label="Eliminar tarea"
                                                                                />
                                                                            )}
                                                                        </div>
                                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                                                            <div className="flex flex-col">
                                                                                <label className="text-xs font-medium text-gray-700 mb-1">Tipo de tarea</label>
                                                                                <Dropdown
                                                                                    value={task.task_type_id}
                                                                                    options={taskTypes}
                                                                                    onChange={(e) => setFieldValue(`blocks[${index}].tasks[${taskIndex}].task_type_id`, e.value)}
                                                                                    optionLabel="name"
                                                                                    optionValue="id"
                                                                                    placeholder="Selecciona tipo"
                                                                                    className="w-full"
                                                                                />
                                                                            </div>
                                                                            <div className="flex flex-col">
                                                                                <label className="text-xs font-medium text-gray-700 mb-1">Tipo de elemento</label>
                                                                                <Dropdown
                                                                                    value={task.element_type_id}
                                                                                    options={elementTypes}
                                                                                    onChange={(e) => {
                                                                                        setFieldValue(`blocks[${index}].tasks[${taskIndex}].element_type_id`, e.value);
                                                                                        if (!requiresTreeType(e.value)) {
                                                                                            setFieldValue(`blocks[${index}].tasks[${taskIndex}].tree_type_id`, null);
                                                                                        }
                                                                                    }}
                                                                                    optionLabel="name"
                                                                                    optionValue="id"
                                                                                    placeholder="Selecciona tipo"
                                                                                    className="w-full"
                                                                                />
                                                                            </div>
                                                                            <div className="flex flex-col">
                                                                                <label className="text-xs font-medium text-gray-700 mb-1">Especie de árbol</label>
                                                                                <Dropdown
                                                                                    value={task.tree_type_id}
                                                                                    options={treeTypes}
                                                                                    onChange={(e) => setFieldValue(`blocks[${index}].tasks[${taskIndex}].tree_type_id`, e.value)}
                                                                                    optionLabel="species"
                                                                                    optionValue="id"
                                                                                    placeholder="Selecciona especie"
                                                                                    className="w-full"
                                                                                    disabled={!requiresTreeType(task.element_type_id)}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                <div className="flex justify-center mt-2">
                                                                    <Button
                                                                        type="button"
                                                                        icon="pi pi-plus"
                                                                        label="Añadir Tarea"
                                                                        className="p-button-outlined p-button-sm"
                                                                        onClick={() => pushTask({ task_type_id: null, element_type_id: null, tree_type_id: null })}
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </FieldArray>
                                                    <div className="flex flex-col mt-3">
                                                        <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                                            <Icon icon="tabler:notes" className="h-5 w-5 mr-2" />
                                                            Notas
                                                        </label>
                                                        <InputTextarea
                                                            rows={3}
                                                            value={values.blocks[index].notes}
                                                            onChange={(e) => setFieldValue(`blocks[${index}].notes`, e.target.value)}
                                                            className="w-full"
                                                            placeholder="Añade notas para este bloque de trabajo..."
                                                        />
                                                    </div>
                                                </Card>
                                            ))}
                                            <div className="flex justify-center">
                                                <Button
                                                    type="button"
                                                    icon="pi pi-plus"
                                                    label="Añadir Bloque"
                                                    className="p-button-outlined"
                                                    onClick={() => push({ notes: '', zones: [], tasks: [{ task_type_id: null, element_type_id: null, tree_type_id: null }] })}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </FieldArray>
                                <div className="flex justify-end mt-4">
                                    <Button type="submit" icon="pi pi-check" label="Crear Orden de Trabajo" className="w-full md:w-auto" loading={isSubmitting} />
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </Card>
        </div>
    );
};

export default CreateWorkOrder;