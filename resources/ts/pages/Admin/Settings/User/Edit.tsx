import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axiosClient from "@/api/axiosClient";
import { useTranslation } from "react-i18next";
import { Button } from 'primereact/button';

export default function EditUser() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [initialValues, setInitialValues] = useState<{
        name: string;
        surname: string;
        email: string;
        company?: string;
        dni?: string;
        role: string;
        password?: string;
    }>({
        name: "",
        surname: "",
        email: "",
        company: "",
        dni: "",
        role: "worker",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axiosClient.get(`/admin/users/${id}`);
                const user = response.data;
                setInitialValues({
                    name: user.name,
                    surname: user.surname,
                    email: user.email,
                    company: user.company || "",
                    dni: user.dni || "",
                    role: user.role,
                    password: "",
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
        name: Yup.string().required(t("admin.pages.users.edit.validations.name_required")),
        surname: Yup.string().required(t("admin.pages.users.edit.validations.surname_required")),
        email: Yup.string()
            .email(t("admin.pages.users.edit.validations.invalid_email"))
            .required(t("admin.pages.users.edit.validations.email_required")),
        company: Yup.string(),
        dni: Yup.string(),
        role: Yup.string()
            .oneOf(["admin", "worker", "customer"], t("admin.pages.users.edit.validations.role_invalid"))
            .required(t("admin.pages.users.edit.validations.role_invalid")),
        password: Yup.string()
            .min(8, t("admin.pages.users.edit.validations.password_min"))
            .matches(/[A-Z]/, t("admin.pages.users.create.validations.password_uppercase"))
            .matches(/[0-9]/, t("admin.pages.users.create.validations.password_number"))
            .matches(/[!@#$%^&*(),.?":{}|<>]/, t("admin.pages.users.create.validations.password_special")),
    });

    const handleSubmit = async (values: typeof initialValues) => {
        try {
            const data = { ...values };
            if (!data.password) {
                delete data.password;
            }
            await axiosClient.put(`/admin/users/${id}`, data);
            navigate("/admin/settings/users", { state: { success: t("admin.pages.users.update") } });
        } catch (error) {
            navigate("/admin/settings/users", { state: { error: t("admin.pages.users.error", "Error saving user") } });
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <Icon icon="eos-icons:loading" className="h-8 w-8 animate-spin text-blue-600" />
                <span className="mt-2 text-blue-600">{t("admin.pages.users.loading", "Loading...")}</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 md:p-10">
            <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg overflow-hidden">
                <header className="bg-blue-700 px-6 py-4 flex items-center">
                    <Button
                        className="p-button-text text-white hover:text-blue-200 transition duration-200 mr-4"
                        onClick={() => navigate("/admin/settings/users")}
                    >
                        <Icon icon="tabler:arrow-left" className="h-6 w-6" />
                    </Button>
                    <h2 className="text-white text-3xl font-bold">{t("admin.pages.users.edit.title")}</h2>
                </header>
                <div className="p-8">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize
                    >
                        {({ isSubmitting }) => (
                            <Form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col">
                                    <label className="text-gray-700 font-medium mb-2">
                                        {t("admin.pages.users.edit.labels.name")}
                                    </label>
                                    <Field
                                        name="name"
                                        placeholder={t("admin.pages.users.edit.placeholders.name")}
                                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-gray-700 font-medium mb-2">
                                        {t("admin.pages.users.edit.labels.surname")}
                                    </label>
                                    <Field
                                        name="surname"
                                        placeholder={t("admin.pages.users.edit.placeholders.surname")}
                                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <ErrorMessage name="surname" component="div" className="text-red-500 text-sm mt-1" />
                                </div>
                                <div className="flex flex-col col-span-1 md:col-span-2">
                                    <label className="text-gray-700 font-medium mb-2">
                                        {t("admin.pages.users.edit.labels.email")}
                                    </label>
                                    <Field
                                        name="email"
                                        type="email"
                                        placeholder={t("admin.pages.users.edit.placeholders.email")}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-gray-700 font-medium mb-2">
                                        {t("admin.pages.users.edit.labels.company")}
                                    </label>
                                    <Field
                                        name="company"
                                        placeholder={t("admin.pages.users.edit.placeholders.company")}
                                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-gray-700 font-medium mb-2">
                                        {t("admin.pages.users.edit.labels.dni")}
                                    </label>
                                    <Field
                                        name="dni"
                                        placeholder={t("admin.pages.users.edit.placeholders.dni")}
                                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-gray-700 font-medium mb-2">
                                        {t("admin.pages.users.edit.labels.role")}
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
                                    <ErrorMessage name="role" component="div" className="text-red-500 text-sm mt-1" />
                                </div>
                                <div className="flex flex-col col-span-1 md:col-span-2">
                                    <label className="text-gray-700 font-medium mb-2">
                                        {t("admin.pages.users.edit.labels.password")}
                                    </label>
                                    <Field
                                        name="password"
                                        type="password"
                                        placeholder={t("admin.pages.users.edit.placeholders.password")}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                                </div>
                                <div className="md:col-span-2 flex justify-end">
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full md:w-auto bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg shadow hover:bg-blue-700 transition duration-200"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Icon icon="eos-icons:loading" className="h-5 w-5 mr-2 animate-spin" />
                                                {t("admin.pages.users.edit.submittingText")}
                                            </>
                                        ) : (
                                            t("admin.pages.users.edit.submitButton")
                                        )}
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
}
