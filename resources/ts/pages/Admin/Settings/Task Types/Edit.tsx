import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axiosClient from "@/api/axiosClient";
import { useTranslation } from "react-i18next";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { Icon } from "@iconify/react";

export default function EditTaskType() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [initialValues, setInitialValues] = useState({ name: "" });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTaskType = async () => {
            try {
                const response = await axiosClient.get(`/admin/task-types/${id}`);
                setInitialValues({ name: response.data.name });
                setIsLoading(false);
            } catch {
                setIsLoading(false);
            }
        };
        fetchTaskType();
    }, [id]);

    const validationSchema = Yup.object({
        name: Yup.string().required(t("admin.pages.taskTypes.edit.validations.name_required"))
    });

    const handleSubmit = async (values: typeof initialValues) => {
        try {
            await axiosClient.put(`/admin/task-types/${id}`, values);
            navigate("/admin/settings/task-types", {
                state: { success: t("admin.pages.taskTypes.update") }
            });
        } catch {
            navigate("/admin/settings/task-types", {
                state: { error: t("admin.pages.taskTypes.error") }
            });
        }
    };

    const handleDelete = async () => {
        try {
            await axiosClient.delete(`/admin/task-types/${id}`);
            navigate("/admin/settings/task-types", {
                state: { success: t("admin.pages.taskTypes.deletedSuccess") }
            });
        } catch {
            navigate("/admin/settings/task-types", {
                state: { error: t("admin.pages.taskTypes.error") }
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <Icon icon="eos-icons:loading" className="h-8 w-8 animate-spin text-blue-600" />
                <span className="mt-2 text-blue-600">
                    {t("admin.pages.taskTypes.loading")}
                </span>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center bg-gray-50 p-4 md:p-6">
            <Card className="w-full max-w-3xl shadow-lg">
                <header className="bg-blue-700 px-6 py-4 flex items-center -mt-6 -mx-6 rounded-t-lg">
                    <Button
                        className="p-button-text mr-4"
                        style={{ color: "#fff" }}
                        onClick={() => navigate("/admin/settings/task-types")}
                    >
                        <Icon icon="tabler:arrow-left" className="h-6 w-6" />
                    </Button>
                    <h2 className="text-white text-3xl font-bold">
                        {t("admin.pages.taskTypes.edit.title")}
                    </h2>
                </header>
                <div className="p-6">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize
                    >
                        {({ errors, touched, isSubmitting }) => (
                            <Form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col">
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                        {t("admin.pages.taskTypes.edit.fields.name")}
                                    </label>
                                    <Field
                                        name="name"
                                        as={InputText}
                                        placeholder={t("admin.pages.taskTypes.edit.placeholders.name")}
                                        className={errors.name && touched.name ? "p-invalid" : ""}
                                    />
                                    {errors.name && touched.name && (
                                        <small className="p-error">{errors.name}</small>
                                    )}
                                </div>
                                <div className="col-span-1 md:col-span-2 flex justify-end gap-4 mt-4">
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full md:w-auto"
                                        icon={isSubmitting ? "pi pi-spin pi-spinner" : "pi pi-check"}
                                        label={
                                            isSubmitting
                                                ? t("admin.pages.taskTypes.edit.submittingText")
                                                : t("admin.pages.taskTypes.edit.submitButton")
                                        }
                                    />
                                    <Button
                                        type="button"
                                        className="p-button-danger"
                                        icon="pi pi-trash"
                                        onClick={handleDelete}
                                        label={t("admin.pages.taskTypes.edit.deleteButton")}
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
