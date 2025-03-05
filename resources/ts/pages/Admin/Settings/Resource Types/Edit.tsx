import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axiosClient from "@/api/axiosClient";
import { useTranslation } from "react-i18next";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";

export default function EditResourceType() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [initialValues, setInitialValues] = useState<{
        name: string;
        description: string;
    }>({
        name: "",
        description: ""
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchResourceType = async () => {
            try {
                const response = await axiosClient.get(`/admin/resource-types/${id}`);
                const resourceType = response.data;
                setInitialValues({
                    name: resourceType.name,
                    description: resourceType.description
                });
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                setIsLoading(false);
            }
        };
        fetchResourceType();
    }, [id]);

    const validationSchema = Yup.object({
        name: Yup.string().required(t("admin.pages.resourceTypes.edit.validations.name_required")),
        description: Yup.string().required(t("admin.pages.resourceTypes.edit.validations.description_required"))
    });

    const handleSubmit = async (values: typeof initialValues) => {
        try {
            await axiosClient.put(`/admin/resource-types/${id}`, values);
            navigate("/admin/settings/resource-types", { state: { success: t("admin.pages.resourceTypes.update") } });
        } catch (error) {
            navigate("/admin/settings/resource-types", { state: { error: t("admin.pages.resourceTypes.error") } });
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <Icon icon="eos-icons:loading" className="h-8 w-8 animate-spin text-blue-600" />
                <span className="mt-2 text-blue-600">{t("admin.pages.resourceTypes.loading")}</span>
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
                        onClick={() => navigate("/admin/settings/resource-types")}
                    >
                        <Icon icon="tabler:arrow-left" className="h-6 w-6" />
                    </Button>
                    <h2 className="text-white text-3xl font-bold">
                        {t("admin.pages.resourceTypes.edit.title")}
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
                            <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                        <Icon icon="tabler:tag" className="h-5 w-5 mr-2" />
                                        {t("admin.fields.name")}
                                    </label>
                                    <Field
                                        name="name"
                                        as={InputText}
                                        placeholder={t("admin.fields.name")}
                                        className={errors.name && touched.name ? "p-invalid" : ""}
                                    />
                                    {errors.name && touched.name && (
                                        <small className="p-error">{errors.name}</small>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                        <Icon icon="tabler:info-circle" className="h-5 w-5 mr-2" />
                                        {t("admin.fields.description")}
                                    </label>
                                    <Field
                                        name="description"
                                        as={InputText}
                                        placeholder={t("admin.fields.description")}
                                        className={errors.description && touched.description ? "p-invalid" : ""}
                                    />
                                    {errors.description && touched.description && (
                                        <small className="p-error">{errors.description}</small>
                                    )}
                                </div>
                                <div className="md:col-span-2 flex justify-end mt-4">
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full md:w-auto"
                                        icon={isSubmitting ? "pi pi-spin pi-spinner" : "pi pi-check"}
                                        label={
                                            isSubmitting
                                                ? t("admin.pages.resourceTypes.edit.submittingText")
                                                : t("admin.pages.resourceTypes.edit.submitButton")
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
