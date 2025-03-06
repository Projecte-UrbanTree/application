import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Badge } from "primereact/badge";
import { Message } from "primereact/message";
import { ProgressSpinner } from "primereact/progressspinner";
import { Icon } from "@iconify/react";
import axiosClient from "@/api/axiosClient";
import { useTranslation } from "react-i18next";
import CrudPanel from "@/components/Admin/CrudPanel";


export default function Contracts() {
    const [isLoading, setIsLoading] = useState(true);
    interface Contract {
        id: number;
        name: string;
        start_date: string;
        end_date: string;
        final_price: string;
        status: number;
    }

    const [contracts, setContracts] = useState<Contract[]>([]);
    const location = useLocation();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const successMsg = location.state?.success;
    const errorMsg = location.state?.error;
    const [msg, setMsg] = useState<string | null>(successMsg || errorMsg || null);

    const statusOptions = [
        { label: t("admin.status.active"), value: 0 },
        { label: t("admin.status.inactive"), value: 1 },
        { label: t("admin.status.completed"), value: 2 }
    ];

    useEffect(() => {
        const fetchContracts = async () => {
            try {
                const response = await axiosClient.get("/admin/contracts");
                setContracts(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                setIsLoading(false);
            }
        };
        fetchContracts();
    }, []);

    useEffect(() => {
        if (msg) {
            const timer = setTimeout(() => setMsg(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [msg]);

    const handleDelete = async (contractId: number) => {
        if (!window.confirm(t("admin.pages.contracts.list.messages.deleteConfirm"))) return;
        try {
            await axiosClient.delete(`/admin/contracts/${contractId}`);
            setContracts(contracts.filter((contract) => contract.id !== contractId));
            setMsg(t("admin.pages.contracts.list.messages.deleteSuccess"));
        } catch (error) {
            console.error(error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <ProgressSpinner style={{ width: "50px", height: "50px" }} strokeWidth="4" />
                <span className="mt-2 text-blue-600">{t("general.loading")}</span>
            </div>
        );
    }

    return (
        <>
            {msg && (
                <Message
                    severity={successMsg || msg === t("admin.pages.contracts.list.messages.deleteSuccess") ? "success" : "error"}
                    text={msg}
                    className="mb-4 w-full"
                />
            )}
            <CrudPanel
                title={t("admin.pages.contracts.title")}
                onCreate={() => navigate("/admin/settings/contracts/create")}
            >
                <DataTable
                    value={contracts}
                    paginator
                    rows={10}
                    stripedRows
                    showGridlines
                    className="p-datatable-sm"
                >
                    <Column field="name" header={t("admin.pages.contracts.list.columns.name")} />
                    <Column field="start_date" header={t("admin.pages.contracts.list.columns.start_date")} />
                    <Column field="end_date" header={t("admin.pages.contracts.list.columns.end_date")} />
                    <Column field="final_price" header={t("admin.pages.contracts.list.columns.final_price")} />
                    <Column field="status" header={t("admin.pages.contracts.list.columns.status")} body={(rowData: Contract) => (
                        <Badge value={statusOptions.find(option => option.value === rowData.status)?.label} />
                    )} />
                    <Column
                        header={t("admin.pages.contracts.list.actions.label")}
                        body={(rowData: { id: number }) => (
                            <div className="flex justify-center gap-2">
                                <Button
                                    icon={<Icon icon="tabler:edit" className="h-5 w-5" />}
                                    className="p-button-rounded p-button-info"
                                    tooltip={t("admin.pages.contracts.list.actions.edit")}
                                    tooltipOptions={{ position: "top" }}
                                    onClick={() => navigate(`/admin/settings/contracts/edit/${rowData.id}`)}
                                />
                                <Button
                                    icon={<Icon icon="tabler:trash" className="h-5 w-5" />}
                                    className="p-button-rounded p-button-danger"
                                    tooltip={t("admin.pages.contracts.list.actions.delete")}
                                    tooltipOptions={{ position: "top" }}
                                    onClick={() => handleDelete(rowData.id)}
                                />
                            </div>
                        )}
                    />
                </DataTable>
            </CrudPanel>
        </>
    );
}
