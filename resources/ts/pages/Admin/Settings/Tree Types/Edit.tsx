import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axiosClient from "@/api/axiosClient";
import { useTranslation } from "react-i18next";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Password } from "primereact/password";
import { Card } from "primereact/card";

export default function EditTreeType() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [initialValues, setInitialValues] = useState<{
        family: string;
        genus: string;
        species: string;
    }>({
        family: "",
        genus: "",
        species: "",
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axiosClient.get(`/admin/treeTypes/${id}`);
                const tree_type = response.data;
                setInitialValues({
                    family: tree_type.family,
                    genus: tree_type.genus,
                    species: tree_type.species,
                });
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                setIsLoading(false);
            }
        };
        fetchUser();
    }, [id]);

    const validationSchema = Yup.object({
        family: Yup.string().required(t("admin.pages.treeTypes.create.validation.family")),
        genus: Yup.string().required(t("admin.pages.treeTypes.create.validation.genus")),
        species: Yup.string().required(t("admin.pages.treeTypes.create.validation.species"))
    });

    const handleSubmit = async (values: typeof initialValues) => {
        try {
            const data = { ...values };
            await axiosClient.put(`/admin/treeTypes/${id}`, data);
            navigate("/admin/settings/treeTypes", { state: { success: t("admin.pages.treeTypes.update") } });
        } catch (error) {
            navigate("/admin/settings/treeTypes", { state: { error: t("admin.pages.treeTypes.error") } });
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <Icon icon="eos-icons:loading" className="h-8 w-8 animate-spin text-blue-600" />
                <span className="mt-2 text-blue-600">{t("admin.pages.treeTypes.loading")}</span>
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
                        onClick={() => navigate("/admin/settings/treeTypes")}
                    >
                        <Icon icon="tabler:arrow-left" className="h-6 w-6" />
                    </Button>
                    <h2 className="text-white text-3xl font-bold">
                        {t("admin.pages.treeTypes.edit.title")}
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
                                        <Icon icon="tabler:treeType" className="h-5 w-5 mr-2" />
                                        {t("admin.fields.family")}
                                    </label>
                                    <Field
                                        name="name"
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
                                        <Icon icon="tabler:treeType" className="h-5 w-5 mr-2" />
                                        {t("admin.fields.genus")}
                                    </label>
                                    <Field
                                        name="surname"
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
                                        <Icon icon="tabler:treeType" className="h-5 w-5 mr-2" />
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
                                                ? t("admin.pages.treeTypes.edit.submittingText")
                                                : t("admin.pages.treeTypes.edit.submitButton")
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