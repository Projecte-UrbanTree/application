import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axiosClient from "@/api/axiosClient";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";

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
        name: Yup.string().required(t("admin.pages.users.create.validations.name_required")),
        surname: Yup.string().required(t("admin.pages.users.create.validations.surname_required")),
        email: Yup.string()
            .email(t("admin.pages.users.create.validations.invalid_email"))
            .required(t("admin.pages.users.create.validations.email_required")),
        company: Yup.string(),
        dni: Yup.string(),
        role: Yup.string()
            .oneOf(["admin", "worker", "customer"], t("admin.pages.users.create.validations.role_invalid"))
            .required(t("admin.pages.users.create.validations.role_invalid")),
        password: Yup.string()
            .min(8, t("admin.pages.users.create.validations.password_min"))
            .matches(/[A-Z]/, t("admin.pages.users.create.validations.password_uppercase"))
            .matches(/[0-9]/, t("admin.pages.users.create.validations.password_number"))
            .required(t("admin.pages.users.create.validations.password_required"))
    });

    const handleSubmit = async (values: typeof initialValues) => {
        setIsSubmitting(true);
        try {
            await axiosClient.get("/sanctum/csrf-cookie");
            await axiosClient.post("/admin/users", values);
            navigate("/admin/settings/users", { state: { success: t("admin.pages.users.success") } });
        } catch (error: any) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 md:p-10">
            <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg overflow-hidden">
                <header className="bg-blue-700 px-6 py-4 flex items-center">
                    <button
                        onClick={() => navigate("/admin/settings/users")}
                        title={t("admin.pages.users.create.returnButton")}
                        className="text-white hover:text-blue-200 transition duration-200 mr-4"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h2 className="text-white text-3xl font-bold">
                        {t("admin.pages.users.create.title")}
                    </h2>
                </header>
                <div className="p-8">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {() => (
                            <Form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t("admin.pages.users.create.labels.name")}
                                    </label>
                                    <Field
                                        name="name"
                                        placeholder={t("admin.pages.users.create.placeholders.name")}
                                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t("admin.pages.users.create.labels.surname")}
                                    </label>
                                    <Field
                                        name="surname"
                                        placeholder={t("admin.pages.users.create.placeholders.surname")}
                                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <ErrorMessage name="surname" component="div" className="text-red-500 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t("admin.pages.users.create.labels.email")}
                                    </label>
                                    <Field
                                        name="email"
                                        type="email"
                                        placeholder={t("admin.pages.users.create.placeholders.email")}
                                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t("admin.pages.users.create.labels.company")}
                                    </label>
                                    <Field
                                        name="company"
                                        placeholder={t("admin.pages.users.create.placeholders.company")}
                                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t("admin.pages.users.create.labels.dni")}
                                    </label>
                                    <Field
                                        name="dni"
                                        placeholder={t("admin.pages.users.create.placeholders.dni")}
                                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t("admin.pages.users.create.labels.role")}
                                    </label>
                                    <Field
                                        name="role"
                                        as="select"
                                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="admin">{t("admin.roles.admin")}</option>
                                        <option value="worker">{t("admin.roles.worker")}</option>
                                        <option value="customer">{t("admin.roles.customer")}</option>
                                    </Field>
                                    <ErrorMessage name="role" component="div" className="text-red-500 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t("admin.pages.users.create.labels.password")}
                                    </label>
                                    <Field
                                        name="password"
                                        type="password"
                                        placeholder={t("admin.pages.users.create.placeholders.password")}
                                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
                                </div>
                                <div className="md:col-span-2 flex justify-end mt-4">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`w-full md:w-auto flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded shadow-sm transition-all duration-200 text-lg ${
                                            isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
                                        }`}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Icon icon="eos-icons:loading" className="h-5 w-5 mr-2 animate-spin" />
                                                {t("admin.pages.users.create.submittingText")}
                                            </>
                                        ) : (
                                            t("admin.pages.users.create.submitButton")
                                        )}
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
}
