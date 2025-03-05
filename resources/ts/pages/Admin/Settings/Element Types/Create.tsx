import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axiosClient from "@/api/axiosClient";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Password } from "primereact/password";
import { Card } from "primereact/card";
import { ColorPicker } from "primereact/colorpicker";

export default function CreateElementType() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const initialValues = {
        name: "",
        requires_tree_type: false,
        description: "",
        icon: "",
        color: "#FF0000"
    };

    const validationSchema = Yup.object({
        name: Yup.string().required(t("admin.pages.elementTypes.create.validations.name")),
        requires_tree_type: Yup.boolean().required(t("admin.pages.elementTypes.create.validations.requires_tree_type")),
        description: Yup.string(),
        icon: Yup.string().required(),
        color: Yup.string().required(),
    });

    const booleanOptions = [
        { label: t("admin.fields.true"), value: true },
        { label: t("admin.fields.false"), value: false }
    ];

    const handleSubmit = async (values: typeof initialValues) => {
        setIsSubmitting(true);
        try {
            await axiosClient.get("/sanctum/csrf-cookie");
            await axiosClient.post("/admin/element-types", values);
            navigate("/admin/settings/element-types", { state: { success: t("admin.pages.elementTypes.success") } });
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex items-center justify-center bg-gray-50 p-4 md:p-6">
            <Card className="w-full max-w-3xl shadow-lg">
                <header className="bg-blue-700 px-6 py-4 flex items-center -mt-6 -mx-6 rounded-t-lg">
                    <Button
                        className="p-button-text mr-4"
                        style={{ color: "#fff" }}
                        onClick={() => navigate("/admin/settings/element-types")}
                    >
                        <Icon icon="tabler:arrow-left" className="h-6 w-6" />
                    </Button>
                    <h2 className="text-white text-3xl font-bold">
                        {t("admin.pages.elementTypes.create.title")}
                    </h2>
                </header>
                <div className="p-6">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ errors, touched }) => (
                            <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                        <Icon icon="tabler:user" className="h-5 w-5 mr-2" />
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
                                        <Icon icon="tabler:user" className="h-5 w-5 mr-2" />
                                        {t("admin.fields.requires_tree_type")}
                                    </label>
                                    <Field
                                        name="requires_tree_type"
                                        render={({ field, form }: { field: any, form: any }) => (
                                            <Dropdown
                                                id={field.name}
                                                value={field.value}
                                                options={booleanOptions}
                                                onChange={(e) => form.setFieldValue(field.name, e.value)}
                                                className={errors.requires_tree_type && touched.requires_tree_type ? "p-invalid" : ""}
                                            />
                                        )}
                                    />
                                    {errors.requires_tree_type && touched.requires_tree_type && (
                                        <small className="p-error">{errors.requires_tree_type}</small>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                        <Icon icon="tabler:user" className="h-5 w-5 mr-2" />
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
                                <div className="flex flex-col">
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                        <Icon icon="tabler:user" className="h-5 w-5 mr-2" />
                                        {t("admin.fields.icon")}
                                    </label>
                                    <Field
                                        name="icon"
                                        as={InputText}
                                        placeholder={t("admin.fields.icon")}
                                        className={errors.icon && touched.icon ? "p-invalid" : ""}
                                    />
                                    {errors.icon && touched.icon && (
                                        <small className="p-error">{errors.icon}</small>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                        <Icon icon="tabler:user" className="h-5 w-5 mr-2" />
                                        {t("admin.fields.color")}
                                    </label>
                                    <Field
                                        name="color"
                                        render={({ field, form }: { field: any, form: any }) => (
                                            <ColorPicker
                                                id={field.name}
                                                value={field.value}
                                                onChange={(e) => form.setFieldValue(field.name, e.value)}
                                                className={errors.color && touched.color ? "p-invalid" : ""}
                                            />
                                        )}
                                    />
                                    {errors.color && touched.color && (
                                        <small className="p-error">{errors.color}</small>
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
                                                ? t("admin.pages.elementTypes.create.submittingText")
                                                : t("admin.pages.elementTypes.create.submitButton")
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