import { yupResolver } from '@hookform/resolvers/yup';
import { Icon } from '@iconify/react';
import * as turf from '@turf/turf';
import { Button } from 'primereact/button';
import { ColorPicker } from 'primereact/colorpicker';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';

import { savePoints, SavePointsProps } from '@/api/service/pointService';
import { saveZoneAsync } from '@/store/slice/zoneSlice';
import { AppDispatch, RootState } from '@/store/store';
import { Contract } from '@/types/Contract';
import { TypePoint } from '@/types/Point';
import { Zone } from '@/types/Zone';

const schema = yup.object().shape({
  name: yup.string().required('El nombre es obligatorio'),
  description: yup.string(),
  color: yup
    .string()
    .matches(
      /^#([0-9A-F]{6})$/i,
      'Debe ser un código de color válido en formato #RRGGBB',
    ),
  contractId: yup.number().required('El ID del contrato es obligatorio'),
  coordinates: yup
    .array()
    .of(yup.array().of(yup.number()))
    .min(1, 'Las coordenadas son obligatorias'),
});

export interface SaveZoneProps {
  coordinates: number[][];
  onClose: (newZone: Zone, newPoints: SavePointsProps[]) => void;
}

export const SaveZoneForm = ({
  coordinates,
  onClose: onCloseProp,
}: SaveZoneProps) => {
  const currentContract = useSelector<RootState, Contract | null>(
    (state) => state.contract.currentContract,
  );
  const zones = useSelector((state: RootState) => state.zone.zones);
  const points = useSelector((state: RootState) => state.points.points);
  const dispatch = useDispatch<AppDispatch>();

  const toast = useRef<Toast>(null);

  const defaultValues = useMemo(
    () => ({
      name: '',
      description: '',
      color: '#FF5733',
      contractId: currentContract?.id || 0,
      coordinates: coordinates,
    }),
    [coordinates, currentContract?.id],
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    setValue('coordinates', coordinates);
    if (currentContract?.id) {
      setValue('contractId', currentContract.id);
    }
  }, [coordinates, currentContract, setValue]);

  const checkZonesOverlap = useCallback(
    (newPolygonCoords: number[][]): boolean => {
      if (!currentContract?.id) return false;

      try {
        const closedCoords = [...newPolygonCoords];
        if (
          closedCoords.length > 0 &&
          (closedCoords[0][0] !== closedCoords[closedCoords.length - 1][0] ||
            closedCoords[0][1] !== closedCoords[closedCoords.length - 1][1])
        ) {
          closedCoords.push([...closedCoords[0]]);
        }

        const newPolygon = turf.polygon([closedCoords]);

        const filteredZones = zones.filter(
          (z) => z.contract_id === currentContract.id,
        );

        return filteredZones.some((zone) => {
          const zonePoints = points
            .filter(
              (p) =>
                p.zone_id === zone.id && p.type === TypePoint.zone_delimiter,
            )
            .map((p) => [p.longitude!, p.latitude!]);

          if (zonePoints.length < 3) return false;

          const closedZonePoints = [...zonePoints];
          if (
            closedZonePoints[0][0] !==
              closedZonePoints[closedZonePoints.length - 1][0] ||
            closedZonePoints[0][1] !==
              closedZonePoints[closedZonePoints.length - 1][1]
          ) {
            closedZonePoints.push([...closedZonePoints[0]]);
          }

          try {
            const existingPolygon = turf.polygon([closedZonePoints]);

            return (
              turf.booleanOverlap(newPolygon, existingPolygon) ||
              turf.booleanContains(existingPolygon, newPolygon) ||
              turf.booleanContains(newPolygon, existingPolygon)
            );
          } catch (err) {
            console.error('Error al analizar intersección de polígonos:', err);
            return false;
          }
        });
      } catch (err) {
        console.error('Error en checkZonesOverlap:', err);
        return false;
      }
    },
    [currentContract, zones, points],
  );

  const onSubmit = useCallback(
    async (data: Zone) => {
      if (isSubmitting) return;

      if (checkZonesOverlap(coordinates)) {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'No se puede crear una zona encima de otra zona existente',
          sticky: true,
          life: 5000,
        });
        return;
      }

      try {
        const createdZone = await dispatch(
          saveZoneAsync({ data, contractId: currentContract?.id || 0 }),
        ).unwrap();

        if (!createdZone?.id) {
          throw new Error('No se pudo obtener el ID de la zona creada.');
        }

        const pointsData: SavePointsProps[] = coordinates.map((coord) => ({
          latitude: coord[1],
          longitude: coord[0],
          type: TypePoint.zone_delimiter,
          zone_id: createdZone.id!,
        }));

        await savePoints(pointsData);

        toast.current?.show({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Zona y puntos guardados correctamente',
        });

        onCloseProp(createdZone, pointsData);
      } catch (error) {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo guardar la zona',
        });
      }
    },
    [
      coordinates,
      currentContract,
      dispatch,
      isSubmitting,
      onCloseProp,
      checkZonesOverlap,
    ],
  );

  const handleCancel = useCallback(() => {
    onCloseProp({} as Zone, []);
  }, [onCloseProp]);

  return (
    <>
      <Toast ref={toast} />

      <div className="bg-gray-50 border border-gray-300 rounded shadow-sm p-4">
        <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200 mb-4 flex items-center gap-2 text-indigo-800">
          <Icon icon="tabler:info-circle" className="text-indigo-500 flex-shrink-0" width="20" />
          <span className="text-sm">
            Se creará una zona con <strong>{coordinates.length}</strong> puntos delimitadores. 
            La zona debe tener un nombre único.
          </span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <Icon icon="tabler:map" width="18" />
                Nombre de la zona
              </label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <InputText 
                    {...field} 
                    className="w-full p-inputtext" 
                    placeholder="Ej. Parque Central"
                    disabled={isSubmitting}
                  />
                )}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <Icon icon="tabler:alert-circle" width="16" />
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <Icon icon="tabler:notes" width="18" />
                Descripción
              </label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <InputTextarea 
                    {...field} 
                    rows={3} 
                    className="w-full p-inputtext" 
                    placeholder="Descripción detallada de la zona (opcional)"
                    disabled={isSubmitting}
                  />
                )}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>

            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <Icon icon="tabler:palette" width="18" />
                Color
              </label>
              <div className="flex items-center gap-3">
                <Controller
                  name="color"
                  control={control}
                  render={({ field }) => (
                    <>
                      <ColorPicker
                        {...field}
                        format="hex"
                        className="w-10 h-10"
                        onChange={(e) => setValue('color', `#${e.value}`)}
                        appendTo="self"
                        disabled={isSubmitting}
                      />
                      <div 
                        className="w-10 h-10 rounded-lg border border-gray-300" 
                        style={{ backgroundColor: control._formValues.color || '#FF5733' }}
                      />
                      <span className="text-sm text-gray-700 font-mono">
                        {control._formValues.color?.toUpperCase() || '#FF5733'}
                      </span>
                    </>
                  )}
                />
              </div>
              {errors.color && (
                <p className="text-red-500 text-sm mt-1">{errors.color.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-gray-200">
            <Button
              type="button"
              onClick={handleCancel}
              className="p-button-outlined p-button-secondary"
              icon={<Icon icon="tabler:x" />}
              label="Cancelar"
              disabled={isSubmitting}
            />
            <Button
              type="submit"
              className="p-button-success"
              icon={<Icon icon="tabler:device-floppy" />}
              label="Guardar Zona"
              disabled={isSubmitting}
              loading={isSubmitting}
            />
          </div>
        </form>
      </div>
    </>
  );
};
