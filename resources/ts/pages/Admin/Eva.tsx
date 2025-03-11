import { useState, useEffect } from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

import { Icon } from '@iconify/react';

import axiosClient from '@/api/axiosClient';
import { useTranslation } from 'react-i18next';
import CrudPanel from '@/components/Admin/CrudPanel';
import { differenceInYears, differenceInMonths } from 'date-fns';

export default function Evas() {
    const [isLoading, setIsLoading] = useState(true);
    const [evas, setEvas] = useState([]);
    const { t } = useTranslation();

    useEffect(() => {
        const fetchEvas = async () => {
            try {
                const response = await axiosClient.get('/admin/evas');
                setEvas(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
            }
        };

        fetchEvas();
    }, []);

    const calculateAge = (dateString: string) => {
        const today = new Date();
        const birthDate = new Date(dateString);
        const years = differenceInYears(today, birthDate);
        const months = differenceInMonths(today, birthDate) % 12;
        if (years == 0) {
            return `${months} ${t('admin.pages.evas.age.months')}`;
        }

        return `${years} ${t('admin.pages.evas.age.years')}, ${months} ${t('admin.pages.evas.age.months')}`;
    };

    return (
        <>
            <CrudPanel title={t('admin.pages.evas.title')}>
                <DataTable
                    loading={isLoading}
                    value={evas}
                    paginator
                    rows={10}
                    stripedRows
                    showGridlines>
                    <Column
                        field="element_id"
                        header={t('admin.pages.evas.columns.element_id')}
                    />
                    <Column
                        header={t('admin.pages.evas.columns.age')}
                        body={(rowData) => calculateAge(rowData.date_birth)}
                    />
                    <Column
                        field="height"
                        header={t('admin.pages.evas.columns.height')}
                    />
                    {/* Actions */}
                    <Column
                        header={t('admin.pages.evas.columns.actions')}
                        body={() => (
                            <div className="flex justify-center space-x-2">
                                <Button>
                                    <Icon icon="tabler:edit" />
                                </Button>
                                <Button>
                                    <Icon icon="tabler:eye" />
                                </Button>
                            </div>
                        )}
                    />
                </DataTable>
            </CrudPanel>
        </>
    );
}
