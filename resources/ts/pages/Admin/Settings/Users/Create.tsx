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
export default function CreateUser() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const initialValues = {
        name: "",
        surname: "",
        email: "",
        company: "",
        dni: "",
        role: "worker",
        password: ""
    };
    const validationSchema = Yup.object({
        name: Yup.string().required(t("admin.pages.users.form.create.validations.name_required")),
        surname: Yup.string().required(t("admin.pages.users.form.create.validations.surname_required")),
        email: Yup.string()
            .email(t("admin.pages.users.form.create.validations.invalid_email"))
            .required(t("admin.pages.users.form.create.validations.email_required")),
        company: Yup.string(),
        dni: Yup.string(),
        role: Yup.string()
            .oneOf(["admin", "worker", "customer"], t("admin.pages.users.form.create.validations.role_invalid"))
            .required(t("admin.pages.users.form.create.validations.role_invalid")),
        password: Yup.string()
            .min(8, t("admin.pages.users.form.create.validations.password_min"))
            .matches(/[A-Z]/, t("admin.pages.users.form.create.validations.password_uppercase"))
            .matches(/[0-9]/, t("admin.pages.users.form.create.validations.password_number"))
            .matches(/[!@#$%^&*(),.?":{}|<>]/, t("admin.pages.users.form.create.validations.password_special"))
            .required(t("admin.pages.users.form.create.validations.password_required"))
    });
    const handleSubmit = async (values: typeof initialValues) => {
        setIsSubmitting(true);
        try {
            await axiosClient.get("/sanctum/csrf-cookie");
            await axiosClient.post("/admin/users", values);
            navigate("/admin/settings/users", { state: { success: t("admin.pages.users.list.messages.createSuccess") } });
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };
    const roleOptions = [
        { label: t("admin.roles.admin"), value: "admin" },
        { label: t("admin.roles.worker"), value: "worker" },
        { label: t("admin.roles.customer"), value: "customer" }
    ];
    return (
        <div className="flex items-center justify-center bg-gray-50 p-4 md:p-6">
            <Card className="w-full max-w-3xl shadow-lg">
                <header className="bg-blue-700 px-6 py-4 flex items-center -mt-6 -mx-6 rounded-t-lg">
                    <Button
                        className="p-button-text mr-4"
                        style={{ color: "#fff" }}
                        onClick={() => navigate("/admin/settings/users")}
                    >
                        <Icon icon="tabler:arrow-left" className="h-6 w-6" />
                    </Button>
                    <h2 className="text-white text-3xl font-bold">
                        {t("admin.pages.users.form.create.title")}
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
                                        {t("admin.fields.surname")}
                                    </label>
                                    <Field
                                        name="surname"
                                        as={InputText}
                                        placeholder={t("admin.fields.surname")}
                                        className={errors.surname && touched.surname ? "p-invalid" : ""}
                                    />
                                    {errors.surname && touched.surname && (
                                        <small className="p-error">{errors.surname}</small>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                        <Icon icon="tabler:mail" className="h-5 w-5 mr-2" />
                                        {t("admin.fields.email")}
                                    </label>
                                    <Field
                                        name="email"
                                        as={InputText}
                                        type="email"
                                        placeholder={t("admin.fields.email")}
                                        className={errors.email && touched.email ? "p-invalid" : ""}
                                        keyfilter="email"
                                    />
                                    {errors.email && touched.email && (
                                        <small className="p-error">{errors.email}</small>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                        <Icon icon="tabler:building" className="h-5 w-5 mr-2" />
                                        {t("admin.fields.company")}
                                    </label>
                                    <Field
                                        name="company"
                                        as={InputText}
                                        placeholder={t("admin.fields.company")}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                        <Icon icon="tabler:id" className="h-5 w-5 mr-2" />
                                        {t("admin.fields.dni")}
                                    </label>
                                    <Field
                                        name="dni"
                                        as={InputText}
                                        placeholder={t("admin.fields.dni")}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                        <Icon icon="tabler:users" className="h-5 w-5 mr-2" />
                                        {t("admin.fields.role")}
                                    </label>
                                    <Field
                                        name="role"
                                        as={Dropdown}
                                        options={roleOptions}
                                        placeholder={t("admin.pages.users.form.create.placeholders.role")}
                                        className={errors.role && touched.role ? "p-invalid" : ""}
                                    />
                                    {errors.role && touched.role && (
                                        <small className="p-error">{errors.role}</small>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                        <Icon icon="tabler:lock" className="h-5 w-5 mr-2" />
                                        {t("admin.fields.password")}
                                    </label>
                                    <Field
                                        name="password"
                                        as={Password}
                                        placeholder={t("admin.pages.users.form.create.placeholders.password")}
                                        toggleMask
                                        className={errors.password && touched.password ? "p-invalid" : ""}
                                    />
                                    {errors.password && touched.password && (
                                        <small className="p-error">{errors.password}</small>
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
                                                ? t("admin.pages.users.form.create.submittingText")
                                                : t("admin.pages.users.form.create.submitButton")
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
