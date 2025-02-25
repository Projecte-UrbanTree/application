import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreateUser() {
    const navigate = useNavigate();

    const initialValues = {
        name: "",
        surname: "",
        email: "",
        company: "",
        dni: "",
        role: "worker"
    };

    const validationSchema = Yup.object({
        name: Yup.string().required("El nombre es obligatorio"),
        surname: Yup.string().required("El apellido es obligatorio"),
        email: Yup.string().email("Correo inválido").required("El correo es obligatorio"),
        role: Yup.string().required("El rol es obligatorio"),
    });

    const handleSubmit = async (values: typeof initialValues) => {
        try {
            await axios.post("http://127.0.0.1:8000/api/admin/users", values);
            navigate("/admin/settings/users"); // Redirigir a la lista de usuarios
        } catch (error) {
            console.error("Error al crear usuario:", error);
        }
    };

    return (
        <div className="p-6 bg-white rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Crear Usuario</h2>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ isSubmitting }) => (
                    <Form className="space-y-4">
                        <div>
                            <Field name="name" placeholder="Nombre" className="w-full p-2 border rounded" />
                            <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                        </div>
                        <div>
                            <Field name="surname" placeholder="Apellido" className="w-full p-2 border rounded" />
                            <ErrorMessage name="surname" component="div" className="text-red-500 text-sm" />
                        </div>
                        <div>
                            <Field name="email" type="email" placeholder="Correo" className="w-full p-2 border rounded" />
                            <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                        </div>
                        <div>
                            <Field name="company" placeholder="Empresa" className="w-full p-2 border rounded" />
                        </div>
                        <div>
                            <Field name="dni" placeholder="DNI" className="w-full p-2 border rounded" />
                        </div>
                        <div>
                            <Field name="role" as="select" className="w-full p-2 border rounded">
                                <option value="admin">Administrador</option>
                                <option value="worker">Trabajador</option>
                                <option value="customer">Cliente</option>
                            </Field>
                            <ErrorMessage name="role" component="div" className="text-red-500 text-sm" />
                        </div>
                        <button type="submit" disabled={isSubmitting} className="bg-blue-500 text-white px-4 py-2 rounded">
                            Crear Usuario
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
