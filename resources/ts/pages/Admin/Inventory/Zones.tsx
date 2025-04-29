import { Icon } from '@iconify/react';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { ColorPicker } from 'primereact/colorpicker';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Subject } from 'rxjs';

import { fetchElementType } from '@/api/service/elementTypeService';
import { fetchTreeTypes } from '@/api/service/treeTypesService';
import { deleteZone, inlineUpdateZone } from '@/api/service/zoneService';
import { fetchElementsAsync } from '@/store/slice/elementSlice';
import { fetchPointsAsync } from '@/store/slice/pointSlice';
import { fetchZonesAsync, updateZoneAsync } from '@/store/slice/zoneSlice';
import { AppDispatch, RootState } from '@/store/store';
import { ElementType } from '@/types/ElementType';
import { Roles } from '@/types/Role';
import { TreeTypes } from '@/types/TreeTypes';
import { Zone } from '@/types/Zone';
import { ZoneEvent } from '@/types/ZoneEvent';

interface ZoneProps {
  onSelectedZone: (zone: Zone) => void;
  onAddElementZone: (zone: Zone) => void;
  stopCreatingElement: (isCreating: boolean) => void;
  isCreatingElement: boolean;
  isDrawingMode?: boolean;
  onSaveZone?: () => void;
  enabledButton?: boolean;
}

interface AddElementProps {
  zone?: Zone;
  isCreatingElement: boolean;
}

export const eventSubject = new Subject<ZoneEvent>();

export const Zones = ({
  onSelectedZone,
  onAddElementZone,
  stopCreatingElement,
  isCreatingElement,
  isDrawingMode,
  onSaveZone,
  enabledButton,
}: ZoneProps) => {
  const { t } = useTranslation();
  const [selectedZoneToAdd, setSelectedZoneToAdd] = useState<Zone | null>(null);
  const [elementTypes, setElementTypes] = useState<ElementType[]>([]);
  const [treeTypes, setTreeTypes] = useState<TreeTypes[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [hiddenElementTypes, setHiddenElementTypes] = useState<
    Record<string, boolean>
  >({});
  const [hiddenZones, setHiddenZones] = useState<Record<number, boolean>>({});
  const [selectedZoneToDelete, setSelectedZoneToDelete] = useState<Zone | null>(
    null,
  );
  const [isConfirmDialogVisible, setIsConfirmDialogVisible] = useState(false);
  const [editingZone, setEditingZone] = useState<Zone | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [editingField, setEditingField] = useState<{
    zoneId: number;
    field: 'name' | 'description';
  } | null>(null);
  const [localZoneEdits, setLocalZoneEdits] = useState<
    Record<number, Partial<Zone>>
  >({});
  const [tempColors, setTempColors] = useState<Record<number, string>>({});

  const dispatch = useDispatch<AppDispatch>();
  const toast = useRef<Toast>(null);

  const { zones, loading: zonesLoading } = useSelector(
    (state: RootState) => state.zone,
  );
  const { points, loading: pointsLoading } = useSelector(
    (state: RootState) => state.points,
  );
  const currentContract = useSelector(
    (state: RootState) => state.contract.currentContract,
  );
  const { elements, loading: elementsLoading } = useSelector(
    (state: RootState) => state.element,
  );
  const userValue = useSelector((state: RootState) => state.user);
  const isAdmin = userValue.role === Roles.admin;
  const canCreateElements = userValue.role === Roles.admin || userValue.role === Roles.worker;

  const uniqueZones = useMemo(
    () => Array.from(new Map(zones.map((z) => [z.id, z])).values()),
    [zones],
  );

  const filteredZones = useMemo(
    () =>
      uniqueZones.filter((zone) => {
        if (!searchTerm) return true;
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return (
          zone.name?.toLowerCase().includes(lowerCaseSearchTerm) ||
          zone.description?.toLowerCase().includes(lowerCaseSearchTerm)
        );
      }),
    [uniqueZones, searchTerm],
  );

  const addElementZone = useCallback(
    ({ isCreatingElement, zone }: AddElementProps) => {
      eventSubject.next({ isCreatingElement, zone });
      if (zone) onAddElementZone(zone);
      setSelectedZoneToAdd(zone || null);
      stopCreatingElement(isCreatingElement);
    },
    [onAddElementZone, stopCreatingElement],
  );

  useEffect(() => {
    if (!currentContract) return;

    setIsInitialized(false);

    const loadResources = async () => {
      try {
        setHiddenZones({});
        setHiddenElementTypes({});

        await Promise.all([
          dispatch(fetchZonesAsync()).unwrap(),
          dispatch(fetchPointsAsync()).unwrap(),
          dispatch(fetchElementsAsync()).unwrap(),
        ]);

        eventSubject.next({
          isCreatingElement: false,
          refreshMap: true,
        });

        setIsInitialized(true);
      } catch (error) {
        toast.current?.show({
          severity: 'error',
          summary: t('general.error'),
          detail: t('admin.pages.inventory.zones.toast.loadError'),
        });
      }
    };

    loadResources();
  }, [dispatch, currentContract, t]);

  useEffect(() => {
    const loadTypeData = async () => {
      try {
        const [elementTypesData, treeTypesData] = await Promise.all([
          fetchElementType(),
          fetchTreeTypes(),
        ]);

        setElementTypes(elementTypesData);
        setTreeTypes(treeTypesData);
      } catch (error) {
        toast.current?.show({
          severity: 'error',
          summary: t('general.error'),
          detail: t('admin.pages.inventory.zones.toast.loadTypesError'),
        });
      }
    };

    loadTypeData();
  }, [t]);

  useEffect(() => {
    const subscription = eventSubject.subscribe({
      next: (data: AddElementProps) => {
        if (data.zone || data.isCreatingElement !== undefined) {
          setSelectedZoneToAdd(data.zone || null);
          stopCreatingElement(data.isCreatingElement);
        }
      },
      error: (err) => {
        toast.current?.show({
          severity: 'error',
          summary: t('general.error'),
          detail: t('admin.pages.inventory.zones.toast.eventSystemError'),
        });
      },
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [stopCreatingElement, t]);

  const confirmDeleteZone = useCallback((zone: Zone) => {
    setSelectedZoneToDelete(zone);
    setIsConfirmDialogVisible(true);
  }, []);

  const handleDeleteZone = async (zoneId: number) => {
    try {
      await deleteZone(zoneId);

      toast.current?.show({
        severity: 'success',
        summary: t('general.success'),
        detail: t('admin.pages.inventory.zones.toast.deleteSuccess'),
      });

      await Promise.all([
        dispatch(fetchZonesAsync()).unwrap(),
        dispatch(fetchPointsAsync()).unwrap(),
        dispatch(fetchElementsAsync()).unwrap(),
      ]);

      eventSubject.next({
        isCreatingElement: false,
        refreshMap: true,
      });
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: t('general.error'),
        detail: t('admin.pages.inventory.zones.toast.deleteError'),
      });
    }
  };

  const countElementsByTypeInZone = useCallback(
    (zoneId: number) => {
      const pointIdsInZone = new Set(
        points
          .filter((point) => point.zone_id === zoneId)
          .map((point) => point.id),
      );

      const typeCount = elements
        .filter((element) => pointIdsInZone.has(element.point_id!))
        .reduce(
          (acc, element) => {
            if (element.element_type_id) {
              acc[element.element_type_id] =
                (acc[element.element_type_id] || 0) + 1;
            }
            return acc;
          },
          {} as Record<number, number>,
        );

      return typeCount;
    },
    [points, elements],
  );

  const handleViewElements = useCallback(
    (elementTypeId: number, zoneId: number) => {
      const key = `${zoneId}-${elementTypeId}`;
      const isHidden = hiddenElementTypes[key] || false;
      const zoneIsHidden = hiddenZones[zoneId] || false;

      if (zoneIsHidden && !isHidden) {
        toast.current?.show({
          severity: 'warn',
          summary: t('general.warning'),
          detail: t(
            'admin.pages.inventory.zones.toast.showElementsWarningZoneHidden',
          ),
        });
        return;
      }

      setHiddenElementTypes((prev) => ({
        ...prev,
        [key]: !isHidden,
      }));

      eventSubject.next({
        isCreatingElement: false,
        hiddenElementTypes: {
          zoneId,
          elementTypeId,
          hidden: !isHidden,
        },
      });
    },
    [hiddenElementTypes, hiddenZones, t],
  );

  const toggleZoneVisibility = useCallback(
    (zoneId: number) => {
      const isHidden = hiddenZones[zoneId] || false;

      if (!isHidden) {
        setHiddenZones((prev) => ({
          ...prev,
          [zoneId]: true,
        }));

        const elementCounts = countElementsByTypeInZone(zoneId);

        Object.keys(elementCounts).forEach((typeId) => {
          const key = `${zoneId}-${typeId}`;
          setHiddenElementTypes((prev) => ({
            ...prev,
            [key]: true,
          }));
        });

        eventSubject.next({
          isCreatingElement: false,
          hiddenZone: {
            zoneId,
            hidden: true,
          },
        });
      } else {
        setHiddenZones((prev) => ({
          ...prev,
          [zoneId]: false,
        }));

        const elementCounts = countElementsByTypeInZone(zoneId);

        Object.keys(elementCounts).forEach((typeId) => {
          const key = `${zoneId}-${typeId}`;
          setHiddenElementTypes((prev) => ({
            ...prev,
            [key]: false,
          }));
        });

        eventSubject.next({
          isCreatingElement: false,
          hiddenZone: {
            zoneId,
            hidden: false,
          },
        });

        Object.keys(elementCounts).forEach((typeId) => {
          eventSubject.next({
            isCreatingElement: false,
            hiddenElementTypes: {
              zoneId,
              elementTypeId: parseInt(typeId),
              hidden: false,
            },
          });
        });
      }
    },
    [hiddenZones, countElementsByTypeInZone],
  );

  const showAllElementsInZone = useCallback(
    (zoneId: number) => {
      const elementCounts = countElementsByTypeInZone(zoneId);

      Object.keys(elementCounts).forEach((typeId) => {
        const key = `${zoneId}-${typeId}`;
        setHiddenElementTypes((prev) => ({
          ...prev,
          [key]: false,
        }));

        eventSubject.next({
          isCreatingElement: false,
          hiddenElementTypes: {
            zoneId,
            elementTypeId: parseInt(typeId),
            hidden: false,
          },
        });
      });
    },
    [countElementsByTypeInZone],
  );

  const handleColorChange = useCallback((zoneId: number, newColor: string) => {
    setTempColors((prev) => ({
      ...prev,
      [zoneId]: newColor,
    }));
  }, []);

  const handleColorSave = useCallback(
    async (zone: Zone) => {
      const newColor = tempColors[zone.id!];
      if (newColor && newColor !== zone.color) {
        try {
          await dispatch(
            updateZoneAsync({
              id: zone.id!,
              data: { ...zone, color: newColor },
            }),
          ).unwrap();

          toast.current?.show({
            severity: 'success',
            summary: t('general.success'),
            detail: t('admin.pages.inventory.zones.toast.colorUpdateSuccess'),
          });
        } catch (error) {
          toast.current?.show({
            severity: 'error',
            summary: t('general.error'),
            detail: t('admin.pages.inventory.zones.toast.colorUpdateError'),
          });

          setTempColors((prev) => {
            const { [zone.id!]: _, ...rest } = prev;
            return rest;
          });
        }
      }
    },
    [dispatch, t, tempColors],
  );

  const handleInlineEditStart = (
    zoneId: number,
    field: 'name' | 'description',
  ) => {
    setEditingField({ zoneId, field });
  };

  const handleInlineEditChange = (
    zoneId: number,
    field: 'name' | 'description',
    value: string,
  ) => {
    setLocalZoneEdits((prev) => ({
      ...prev,
      [zoneId]: {
        ...prev[zoneId],
        [field]: value,
      },
    }));
  };

  const handleInlineEditBlur = async (
    zone: Zone,
    field: 'name' | 'description',
  ) => {
    const updatedValue = localZoneEdits[zone.id]?.[field];
    if (updatedValue !== undefined && updatedValue !== zone[field]) {
      try {
        await inlineUpdateZone(zone.id!, field, updatedValue);
        toast.current?.show({
          severity: 'success',
          summary: t('general.success'),
          detail: t('admin.pages.inventory.zones.toast.inlineEditSuccess'),
        });
        dispatch(fetchZonesAsync());
      } catch (error) {
        toast.current?.show({
          severity: 'error',
          summary: t('general.error'),
          detail: t('admin.pages.inventory.zones.toast.inlineEditError'),
        });
      }
    }
    setEditingField(null);
    setLocalZoneEdits((prev) => {
      const { [zone.id]: _, ...rest } = prev;
      return rest;
    });
  };

  useEffect(() => {
    if (!isInitialized && zones.length > 0) {
      const timer = setTimeout(() => {
        zones.forEach((zone) => {
          if (zone.id) {
            showAllElementsInZone(zone.id);
          }
        });

        setIsInitialized(true);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [zones, isInitialized, showAllElementsInZone]);

  return (
    <div className="h-full flex flex-col border border-gray-300 bg-gray-50 rounded shadow-sm overflow-hidden">
      <Toast ref={toast} />

      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Icon icon="tabler:map-2" className="text-indigo-600" width="22" />
            {t('admin.pages.inventory.zones.title')}
          </h2>

          {isDrawingMode && isAdmin && (
            <Button
              label={t('admin.pages.inventory.zones.saveZoneButton')}
              icon={<Icon icon="tabler:device-floppy" />}
              onClick={onSaveZone}
              className="p-button-outlined p-button-indigo p-button-sm"
              disabled={!enabledButton}
            />
          )}
        </div>

        {isCreatingElement && (
          <div className="flex items-center justify-between border border-indigo-200 bg-indigo-50 rounded p-2 mb-2">
            <div className="flex items-center gap-2 text-indigo-800">
              <Icon icon="tabler:pencil-plus" width="18" />
              <span className="text-sm font-medium">
                {t('admin.pages.inventory.zones.creatingElementInfo')}
              </span>
            </div>
            <Button
              icon={<Icon icon="tabler:x" />}
              onClick={() => {
                addElementZone({
                  isCreatingElement: false,
                  zone: undefined,
                });
              }}
              className="p-button-outlined p-button-indigo p-button-sm"
              tooltip={t('admin.pages.inventory.zones.cancelCreationTooltip')}
            />
          </div>
        )}

        <span className="p-input-icon-left w-full">
          <i className="pi pi-search" />
          <InputText
            placeholder={t('admin.pages.inventory.zones.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {filteredZones.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-500 p-4">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 flex flex-col items-center w-full mx-auto">
              <Icon
                icon="tabler:map-off"
                width="48"
                className="mb-3 text-gray-400"
              />
              <h3 className="text-center font-semibold text-lg mb-1">
                {t('admin.pages.inventory.zones.emptyState.title')}
              </h3>
              <p className="text-center text-sm mb-3 text-gray-600">
                {searchTerm
                  ? t(
                      'admin.pages.inventory.zones.emptyState.messageWithSearch',
                    )
                  : t('admin.pages.inventory.zones.emptyState.messageDefault')}
              </p>
              {searchTerm && (
                <Button
                  label={t(
                    'admin.pages.inventory.zones.emptyState.clearSearchButton',
                  )}
                  icon={<Icon icon="tabler:eraser" />}
                  className="p-button-outlined p-button-indigo p-button-sm"
                  onClick={() => setSearchTerm('')}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredZones.map((zone: Zone) => {
              const elementCountByType = countElementsByTypeInZone(zone.id!);
              const totalElements = Object.values(elementCountByType).reduce(
                (sum, count) => sum + count,
                0,
              );
              const isHidden = hiddenZones[zone.id!] || false;
              const localEdits = localZoneEdits[zone.id] || {};
              const currentColor =
                tempColors[zone.id!] || zone.color || '#6366F1';

              return (
                <Card
                  key={zone.id}
                  className="border border-gray-300 shadow-sm rounded-lg bg-white overflow-hidden p-0"
                  pt={{
                    root: { className: 'p-0' },
                    content: { className: 'p-0' },
                  }}>
                  <div className="border-b border-gray-200 p-3 flex flex-col gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      {isAdmin && (
                        <ColorPicker
                          value={currentColor.replace('#', '')}
                          onChange={(e) =>
                            handleColorChange(zone.id!, `#${e.value}`)
                          }
                          onHide={() => handleColorSave(zone)}
                          tooltip={t(
                            'admin.pages.inventory.zones.tooltips.changeColor',
                          )}
                          appendTo={document.body}
                        />
                      )}
                      <div className="flex flex-col min-w-0">
                        {isAdmin && editingField?.zoneId === zone.id &&
                        editingField.field === 'name' ? (
                          <InputText
                            value={localEdits.name ?? zone.name}
                            onChange={(e) =>
                              handleInlineEditChange(
                                zone.id!,
                                'name',
                                e.target.value,
                              )
                            }
                            onBlur={() => handleInlineEditBlur(zone, 'name')}
                            autoFocus
                            className="font-semibold text-gray-800 truncate"
                          />
                        ) : (
                          <span
                            className={`font-semibold text-gray-800 truncate ${isAdmin ? 'cursor-pointer' : ''}`}
                            onClick={() => {
                              if (isAdmin) {
                                handleInlineEditStart(zone.id!, 'name');
                              }
                            }}>
                            {localEdits.name ?? zone.name}
                          </span>
                        )}
                        {isAdmin && editingField?.zoneId === zone.id &&
                        editingField.field === 'description' ? (
                          <InputText
                            value={
                              (localEdits.description ?? zone.description) || ''
                            }
                            onChange={(e) =>
                              handleInlineEditChange(
                                zone.id!,
                                'description',
                                e.target.value,
                              )
                            }
                            onBlur={() =>
                              handleInlineEditBlur(zone, 'description')
                            }
                            autoFocus
                            className="text-xs text-gray-500 truncate"
                          />
                        ) : (
                          <span
                            className={`text-xs text-gray-500 truncate ${isAdmin ? 'cursor-pointer' : ''}`}
                            onClick={() => {
                              if (isAdmin) {
                                handleInlineEditStart(zone.id!, 'description');
                              }
                            }}>
                            {(localEdits.description ?? zone.description) ||
                              t('admin.pages.inventory.zones.noDescription')}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        icon={
                          <Icon
                            icon={isHidden ? 'tabler:eye-off' : 'tabler:eye'}
                            width="18"
                          />
                        }
                        className="p-button-outlined p-button-indigo p-button-sm"
                        tooltip={
                          isHidden
                            ? t('admin.pages.inventory.zones.tooltips.showZone')
                            : t('admin.pages.inventory.zones.tooltips.hideZone')
                        }
                        tooltipOptions={{ position: 'top' }}
                        onClick={() => toggleZoneVisibility(zone.id!)}
                      />
                      <Button
                        icon={<Icon icon="tabler:map-pin" width="18" />}
                        className="p-button-outlined p-button-indigo p-button-sm"
                        tooltip={t(
                          'admin.pages.inventory.zones.tooltips.goToZone',
                        )}
                        tooltipOptions={{ position: 'top' }}
                        onClick={() => onSelectedZone(zone)}
                      />
                      {isAdmin && (
                        <>
                          <Button
                            icon={<Icon icon="tabler:plus" width="18" />}
                            className="p-button-outlined p-button-indigo p-button-sm"
                            tooltip={t(
                              'admin.pages.inventory.zones.tooltips.addElement',
                            )}
                            tooltipOptions={{ position: 'top' }}
                            onClick={() =>
                              addElementZone({ isCreatingElement: true, zone })
                            }
                          />
                          <Button
                            icon={<Icon icon="tabler:trash" width="18" />}
                            className="p-button-outlined p-button-indigo p-button-sm"
                            tooltip={t(
                              'admin.pages.inventory.zones.tooltips.deleteZone',
                            )}
                            tooltipOptions={{ position: 'top' }}
                            onClick={() => confirmDeleteZone(zone)}
                          />
                        </>
                      )}
                      {!isAdmin && canCreateElements && (
                        <Button
                          icon={<Icon icon="tabler:plus" width="18" />}
                          className="p-button-outlined p-button-indigo p-button-sm"
                          tooltip={t(
                            'admin.pages.inventory.zones.tooltips.addElement',
                          )}
                          tooltipOptions={{ position: 'top' }}
                          onClick={() =>
                            addElementZone({ isCreatingElement: true, zone })
                          }
                        />
                      )}
                    </div>
                  </div>

                  {(() => {
                    const hasElements = elementTypes.some(
                      (et) => (elementCountByType[et.id!] || 0) > 0,
                    );

                    if (!hasElements) {
                      return (
                        <div className="p-3">
                          <div className="flex flex-col items-center py-4 text-center text-gray-500">
                            <Icon
                              icon="tabler:tree"
                              width="28"
                              className="text-gray-400 mb-2"
                            />
                            <p className="mb-2">
                              {t(
                                'admin.pages.inventory.zones.noElementsInZone',
                              )}
                            </p>
                            {canCreateElements && (
                              <Button
                                label={t(
                                  'admin.pages.inventory.zones.addElementButton',
                                )}
                                icon={<Icon icon="tabler:plus" width="16" />}
                                className="p-button-outlined p-button-indigo p-button-sm"
                                onClick={() =>
                                  addElementZone({
                                    isCreatingElement: true,
                                    zone,
                                  })
                                }
                              />
                            )}
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div className="p-3">
                        <h4 className="text-xs font-bold uppercase text-gray-500 mb-2 flex items-center gap-1">
                          <Icon icon="tabler:list" width="14" />
                          {t('admin.pages.inventory.zones.elementsHeader', {
                            count: totalElements,
                          })}
                        </h4>

                        <div className="space-y-2">
                          {elementTypes.map((elementType) => {
                            const count =
                              elementCountByType[elementType.id!] || 0;
                            if (count === 0) return null;

                            const key = `${zone.id}-${elementType.id}`;
                            const isElementHidden =
                              hiddenElementTypes[key] || false;
                            const zoneIsHidden = hiddenZones[zone.id!] || false;

                            return (
                              <div
                                key={elementType.id}
                                className={`flex justify-between items-center p-2 rounded-lg ${
                                  isElementHidden || zoneIsHidden
                                    ? 'bg-gray-100'
                                    : 'bg-white'
                                } border border-gray-200 transition-all duration-200`}>
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  <div
                                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                                    style={{
                                      backgroundColor:
                                        elementType.color || '#6366F1',
                                      opacity:
                                        isElementHidden || zoneIsHidden
                                          ? 0.5
                                          : 1,
                                    }}>
                                    {elementType.icon && (
                                      <Icon
                                        icon={
                                          elementType.icon.startsWith('tabler:')
                                            ? elementType.icon
                                            : `tabler:${elementType.icon.replace('mdi:', '')}`
                                        }
                                        width="16"
                                        color={
                                          isElementHidden || zoneIsHidden
                                            ? 'gray-400'
                                            : 'gray-700'
                                        }
                                      />
                                    )}
                                  </div>
                                  <div className="flex flex-col min-w-0">
                                    <span
                                      className={`font-medium truncate ${isElementHidden || zoneIsHidden ? 'text-gray-400' : 'text-gray-700'}`}>
                                      {elementType.name}
                                    </span>
                                  </div>
                                  <Badge
                                    value={count}
                                    style={{
                                      backgroundColor:
                                        elementType.color || '#6366F1',
                                      color: '#fff',
                                    }}
                                    className="ml-auto mr-2"
                                  />
                                </div>

                                <Button
                                  icon={
                                    <Icon
                                      icon={
                                        isElementHidden || zoneIsHidden
                                          ? 'tabler:eye-off'
                                          : 'tabler:eye'
                                      }
                                      width="16"
                                    />
                                  }
                                  className="p-button-outlined p-button-indigo p-button-sm"
                                  onClick={() =>
                                    handleViewElements(
                                      elementType.id!,
                                      zone.id!,
                                    )
                                  }
                                  disabled={zoneIsHidden}
                                  tooltip={
                                    zoneIsHidden
                                      ? t(
                                          'admin.pages.inventory.zones.tooltips.zoneHidden',
                                        )
                                      : isElementHidden
                                        ? t(
                                            'admin.pages.inventory.zones.tooltips.showElements',
                                          )
                                        : t(
                                            'admin.pages.inventory.zones.tooltips.hideElements',
                                          )
                                  }
                                  tooltipOptions={{ position: 'top' }}
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Dialog
        header={
          <div className="flex items-center gap-2 text-red-600">
            <Icon icon="tabler:alert-circle" width="24" />
            <span className="font-semibold">
              {t('admin.pages.inventory.zones.deleteConfirm.title')}
            </span>
          </div>
        }
        visible={isConfirmDialogVisible}
        onHide={() => setIsConfirmDialogVisible(false)}
        className="w-[90vw] md:w-[450px]"
        modal
        blockScroll
        footer={
          <div className="flex justify-end gap-2">
            <Button
              label={t('general.cancel')}
              icon={<Icon icon="tabler:x" />}
              className="p-button-outlined p-button-indigo p-button-sm"
              onClick={() => setIsConfirmDialogVisible(false)}
            />
            <Button
              label={t(
                'admin.pages.inventory.zones.deleteConfirm.deleteButton',
              )}
              icon={<Icon icon="tabler:trash" />}
              className="p-button-outlined p-button-indigo p-button-sm"
              severity="danger"
              onClick={() => {
                if (selectedZoneToDelete?.id) {
                  handleDeleteZone(selectedZoneToDelete.id);
                  setIsConfirmDialogVisible(false);
                }
              }}
            />
          </div>
        }>
        <div className="p-3">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-red-800 font-medium flex items-center gap-2">
              <Icon icon="tabler:alert-triangle" width="20" />
              {t(
                'admin.pages.inventory.zones.deleteConfirm.warningIrreversible',
              )}
            </p>
          </div>

          <p className="mb-3">
            {t('admin.pages.inventory.zones.deleteConfirm.confirmationText', {
              zoneName: selectedZoneToDelete?.name,
            })}
          </p>
          <p className="text-sm flex items-center gap-2 text-gray-600 bg-gray-50 p-2 rounded border border-gray-200">
            <Icon icon="tabler:info-circle" width="18" />
            {t('admin.pages.inventory.zones.deleteConfirm.infoText')}
          </p>
        </div>
      </Dialog>
    </div>
  );
};
