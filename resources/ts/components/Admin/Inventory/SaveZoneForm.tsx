import * as yup from 'yup';
import { yupResolver } from '@yu';
const schema = yup.object().shape({
    name: yup.string().required('El nombre es obligatorio'),
    description: yup.string().required('La descripción es obligatoria'),
    color: yup
        .string()
        .matches(/^#([0-9A-F]{3}){1,2}$/i, 'Debe ser un código de color válido')
        .required('El color es obligatorio'),
});

export const SaveZoneForm = ({ onClose, onSubmit }) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    return (
        <div className="p-6 bg-white rounded-2xl shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Guardar Zona</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                    <label className="block text-sm font-medium">Nombre</label>
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <Input {...field} className="w-full" />
                        )}
                    />
                    {errors.name && (
                        <p className="text-red-500 text-sm">
                            {errors.name.message}
                        </p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium">
                        Descripción
                    </label>
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <Input {...field} className="w-full" />
                        )}
                    />
                    {errors.description && (
                        <p className="text-red-500 text-sm">
                            {errors.description.message}
                        </p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium">Color</label>
                    <Controller
                        name="color"
                        control={control}
                        render={({ field }) => (
                            <Input {...field} type="color" className="w-full" />
                        )}
                    />
                    {errors.color && (
                        <p className="text-red-500 text-sm">
                            {errors.color.message}
                        </p>
                    )}
                </div>

                <div className="flex justify-end gap-2">
                    <Button type="button" onClick={onClose} variant="secondary">
                        Cancelar
                    </Button>
                    <Button type="submit" variant="primary">
                        Guardar
                    </Button>
                </div>
            </form>
        </div>
    );
};
function useForm(arg0: { resolver: any }): {
    control: any;
    handleSubmit: any;
    formState: { errors: any };
} {
    throw new Error('Function not implemented.');
}
