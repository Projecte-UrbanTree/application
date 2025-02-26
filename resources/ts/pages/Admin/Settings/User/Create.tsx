import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axiosClient from "@/api/axiosClient";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

export default function CreateUser() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const initialValues = {
        name: "",
        surname: "",
        email: "",
        company: "",
        dni: "",
        role: "worker",
        password: "",
    };

    const validationSchema = Yup.object({
        name: Yup.string().required("El nombre es obligatorio"),
        surname: Yup.string().required("El apellido es obligatorio"),
        email: Yup.string().email("Correo inválido").required("El correo es obligatorio"),
        company: Yup.string(),
        dni: Yup.string(),
        role: Yup.string().oneOf(["admin", "worker", "customer"], "Rol no válido").required("El rol es obligatorio"),
        password: Yup.string()
            .min(8, "Debe tener al menos 8 caracteres")
            .matches(/[A-Z]/, "Debe contener al menos una letra mayúscula")
            .matches(/[0-9]/, "Debe contener al menos un número")
            .required("La contraseña es obligatoria"),
    });

    const handleSubmit = async (values: typeof initialValues) => {
        setIsSubmitting(true);
        try {
            await axiosClient.get("/sanctum/csrf-cookie");
            await axiosClient.post("/admin/users", values);
            localStorage.setItem("userSuccessMessage", "✅ Usuario creado exitosamente");
            navigate("/admin/settings/users");
        } catch (error: any) {
            console.error("Error al crear usuario:", error.response ? error.response.data : error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-6">
            <div className="w-full max-w-xl bg-white shadow-lg rounded-lg p-8 relative">
                <button
                    onClick={() => navigate("/admin/settings/users")}
                    className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition-all flex items-center gap-2"
                >
                    <Icon icon="tabler:arrow-left" className="h-6 w-6" />
                    <span className="text-sm font-medium">Volver a Usuarios</span>
                </button>

                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
                    Crear Usuario
                </h2>

                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                    {() => (
                        <Form className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                                <Field name="name" placeholder="Nombre" className="w-full p-2 border rounded" />
                                <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                                <Field name="surname" placeholder="Apellido" className="w-full p-2 border rounded" />
                                <ErrorMessage name="surname" component="div" className="text-red-500 text-sm" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
                                <Field name="email" type="email" placeholder="Correo" className="w-full p-2 border rounded" />
                                <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
                                <Field name="company" placeholder="Empresa" className="w-full p-2 border rounded" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">DNI</label>
                                <Field name="dni" placeholder="DNI" className="w-full p-2 border rounded" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                                <Field name="role" as="select" className="w-full p-2 border rounded">
                                    <option value="admin">Administrador</option>
                                    <option value="worker">Trabajador</option>
                                    <option value="customer">Cliente</option>
                                </Field>
                                <ErrorMessage name="role" component="div" className="text-red-500 text-sm" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                                <Field name="password" type="password" placeholder="Contraseña" className="w-full p-2 border rounded" />
                                <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
                            </div>

                            <div className="flex justify-center mt-4">
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
                                            Creando...
                                        </>
                                    ) : (
                                        "Crear Usuario"
                                    )}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}
