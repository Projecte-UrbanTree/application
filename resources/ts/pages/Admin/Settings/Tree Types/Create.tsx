import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axiosClient from "@/api/axiosClient";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
export default function CreateTreeType() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const initialValues = {
        family: "",
        genus: "",
        species: ""
    };
    const validationSchema = Yup.object({
        family: Yup.string()
            .matches(/^[a-zA-Z0-9]+$/, t("admin.pages.treeTypes.form.create.validation.alphanumeric.family"))
            .required(t("admin.pages.treeTypes.form.create.validation.family")),
        genus: Yup.string()
            .matches(/^[a-zA-Z0-9]+$/, t("admin.pages.treeTypes.form.create.validation.alphanumeric.genus"))
            .required(t("admin.pages.treeTypes.form.create.validation.genus")),
        species: Yup.string()
            .matches(/^[a-zA-Z0-9]+$/, t("admin.pages.treeTypes.form.create.validation.alphanumeric.species"))
    });
    const handleSubmit = async (values: typeof initialValues) => {
        setIsSubmitting(true);
        try {
            await axiosClient.get("/sanctum/csrf-cookie");
            await axiosClient.post("/admin/tree-types", values);
            navigate("/admin/settings/tree-types", { state: { success: t("admin.pages.treeTypes.list.messages.createSuccess") } });
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
                        onClick={() => navigate("/admin/settings/tree-types")}
                    >
                        <Icon icon="tabler:arrow-left" className="h-6 w-6" />
                    </Button>
                    <h2 className="text-white text-3xl font-bold">
                        {t("admin.pages.treeTypes.form.create.title")}
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
                                        <Icon icon="tabler:tree" className="h-5 w-5 mr-2" />
                                        {t("admin.fields.family")}
                                    </label>
                                    <Field
                                        name="family"
                                        as={InputText}
                                        placeholder={t("admin.fields.family")}
                                        className={errors.family && touched.family ? "p-invalid" : ""}
                                    />
                                    {errors.family && touched.family && (
                                        <small className="p-error">{errors.family}</small>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                        <Icon icon="tabler:tree" className="h-5 w-5 mr-2" />
                                        {t("admin.fields.genus")}
                                    </label>
                                    <Field
                                        name="genus"
                                        as={InputText}
                                        placeholder={t("admin.fields.genus")}
                                        className={errors.genus && touched.genus ? "p-invalid" : ""}
                                    />
                                    {errors.genus && touched.genus && (
                                        <small className="p-error">{errors.genus}</small>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                        <Icon icon="tabler:tree" className="h-5 w-5 mr-2" />
                                        {t("admin.fields.species")}
                                    </label>
                                    <Field
                                        name="species"
                                        as={InputText}
                                        placeholder={t("admin.fields.species")}
                                        className={errors.species && touched.species ? "p-invalid" : ""}
                                    />
                                    {errors.species && touched.species && (
                                        <small className="p-error">{errors.species}</small>
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
                                                ? t("admin.pages.treeTypes.form.create.submittingText")
                                                : t("admin.pages.treeTypes.form.create.submitButton")
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
