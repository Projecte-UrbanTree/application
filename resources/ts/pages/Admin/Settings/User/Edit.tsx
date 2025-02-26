import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axiosClient from "@/api/axiosClient";

export default function EditUser() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
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
        name: Yup.string().required("El nombre es obligatorio"),
        surname: Yup.string().required("El apellido es obligatorio"),
        email: Yup.string().email("Correo inválido").required("El correo es obligatorio"),
        company: Yup.string(),
        dni: Yup.string(),
        role: Yup.string().oneOf(["admin", "worker", "customer"], "Rol no válido").required("El rol es obligatorio"),
        password: Yup.string().min(8, "Debe tener al menos 8 caracteres"),
    });

    const handleSubmit = async (values: typeof initialValues) => {
        try {
            const data = { ...values };
            if (!data.password) {
                delete data.password;
            }
            await axiosClient.put(`/admin/users/${id}`, data);
            navigate("/admin/settings/users", { state: { success: "Usuario editado exitosamente" } });
        } catch (error) {
            navigate("/admin/settings/users", { state: { error: "Error al editar usuario, verifica los datos." } });
        }
    };

    if (isLoading) return <div>Cargando...</div>;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 md:p-10">
            <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg overflow-hidden">
                <header className="bg-blue-700 px-6 py-4 flex items-center">
                    <button onClick={() => navigate("/admin/settings/users")} className="text-white hover:text-blue-200 transition duration-200 mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h2 className="text-white text-3xl font-bold">Editar Usuario</h2>
                </header>
                <div className="p-8">
                    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize>
                        {({ isSubmitting }) => (
                            <Form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col">
                                    <label className="text-gray-700 font-medium mb-2">Nombre</label>
                                    <Field name="name" placeholder="Nombre" className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-gray-700 font-medium mb-2">Apellido</label>
                                    <Field name="surname" placeholder="Apellido" className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    <ErrorMessage name="surname" component="div" className="text-red-500 text-sm mt-1" />
                                </div>
                                <div className="flex flex-col col-span-1 md:col-span-2">
                                    <label className="text-gray-700 font-medium mb-2">Correo</label>
                                    <Field name="email" type="email" placeholder="Correo" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-gray-700 font-medium mb-2">Empresa</label>
                                    <Field name="company" placeholder="Empresa" className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-gray-700 font-medium mb-2">DNI</label>
                                    <Field name="dni" placeholder="DNI" className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-gray-700 font-medium mb-2">Rol</label>
                                    <Field name="role" as="select" className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="admin">Administrador</option>
                                        <option value="worker">Trabajador</option>
                                        <option value="customer">Cliente</option>
                                    </Field>
                                    <ErrorMessage name="role" component="div" className="text-red-500 text-sm mt-1" />
                                </div>
                                <div className="flex flex-col col-span-1 md:col-span-2">
                                    <label className="text-gray-700 font-medium mb-2">Contraseña (dejar en blanco para no cambiar)</label>
                                    <Field name="password" type="password" placeholder="Contraseña" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                                </div>
                                <div className="md:col-span-2 flex justify-end">
                                    <button type="submit" disabled={isSubmitting} className="w-full md:w-auto bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg shadow hover:bg-blue-700 transition duration-200">
                                        Guardar Cambios
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
