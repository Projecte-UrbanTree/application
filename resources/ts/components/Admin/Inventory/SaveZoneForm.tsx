import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ColorPicker } from 'primereact/colorpicker';
import { Zone } from '@/types/zone';
import { saveZone } from '@/api/service/zoneService';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Contract } from '@/types/contract';
import { useState, useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';

const schema = yup.object().shape({
    name: yup.string().required('El nombre es obligatorio'),
    description: yup.string().required('La descripción es obligatoria'),
    color: yup
        .string()
        .matches(
            /^#([0-9A-F]{6})$/i,
            'Debe ser un código de color válido en formato #RRGGBB',
        )
        .required('El color es obligatorio'),
    contractId: yup.number().required('El ID del contrato es obligatorio'),
    coordinates: yup
        .array()
        .of(yup.array().of(yup.number()))
        .min(1, 'Las coordenadas son obligatorias'),
});

export interface SaveZoneProps {
    coordinates: number[][];
    onClose: () => {};
}

export const SaveZoneForm = ({
    coordinates,
    onClose: onCloseProp,
}: SaveZoneProps) => {
    const currentContract: Contract | null = useSelector(
        (state: RootState) => state.contract.currentContract,
    );

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name: '',
            description: '',
            color: '#FF5733',
            contractId: currentContract?.id || 0,
            coordinates: coordinates,
        },
    });
    const [isLoading, setIsLoading] = useState(false);
    const toast = useRef<Toast>(null);

    useEffect(() => {
        setValue('coordinates', coordinates);
        if (currentContract?.id) {
            setValue('contractId', currentContract.id);
        }
    }, [coordinates, currentContract, setValue]);

    async function onSubmit(data: Zone) {
        setIsLoading(true);
        try {
            await saveZone({ ...data, contract_id: currentContract?.id });
            toast.current?.show({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Zona guardada correctamente',
            });
            setTimeout(() => {
                onClose();
            }, 1000);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo guardar la zona',
            });
        } finally {
            setIsLoading(false);
        }
    }

    function onClose() {
        onCloseProp();
    }

    return (
        <div className="p-6 bg-white rounded-2xl shadow-lg w-96">
            <Toast ref={toast} />
            <h2 className="text-xl font-semibold mb-4">Guardar Zona</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                    <label className="block text-sm font-medium">Nombre</label>
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <InputText
                                {...field}
                                className="w-full p-inputtext"
                            />
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
                            <InputText
                                {...field}
                                className="w-full p-inputtext"
                            />
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
                            <ColorPicker
                                {...field}
                                format="hex"
                                className="w-full"
                                onChange={(e) =>
                                    setValue('color', `#${e.value}`)
                                }
                            />
                        )}
                    />
                    {errors.color && (
                        <p className="text-red-500 text-sm">
                            {errors.color.message}
                        </p>
                    )}
                </div>

                <div className="flex justify-end gap-2">
                    <Button
                        type="button"
                        onClick={onClose}
                        className="p-button-secondary"
                        disabled={isLoading}>
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        className="p-button-primary"
                        disabled={isLoading}>
                        {isLoading ? 'Guardando...' : 'Guardar'}
                    </Button>
                </div>
            </form>
        </div>
    );
};
