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

export default function ElementsTypes() {
    const [isLoading, setIsLoading] = useState(true);
    interface ElementType {
      id: number;
      name: string;
      requires_tree_type: boolean;
      description: string;
      icon: string;
      color: string;
    }

    const [elementTypes, setElementTypes] = useState<ElementType[]>([]);
    const location = useLocation();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const successMsg = location.state?.success;
    const errorMsg = location.state?.error;
    const [msg, setMsg] = useState<string | null>(successMsg || errorMsg || null);

    useEffect(() => {
        const fetchElementTypes = async () => {
            try {
                const response = await axiosClient.get("/admin/element-types");
                setElementTypes(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                setIsLoading(false);
            }
        };
        fetchElementTypes();
    }, []);

    useEffect(() => {
        if (msg) {
            const timer = setTimeout(() => setMsg(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [msg]);

    const handleDelete = async (elementTypeId: number) => {
        if (!window.confirm(t("admin.pages.elementTypes.deleteConfirm"))) return;
        try {
            await axiosClient.delete(`/admin/element-types/${elementTypeId}`);
            setElementTypes(elementTypes.filter((elementype) => elementype.id !== elementTypeId));
            setMsg(t("admin.pages.elementTypes.deletedSuccess"));
        } catch (error) {
            console.error(error);
        }
    };

    const colorBodyTemplate = (rowData: ElementType) => {
        return (
            <div style={{ backgroundColor: `#${rowData.color}`, width: '24px', height: '24px', borderRadius: '10%', margin: '0 auto' }}></div>
        );
    };

    const iconBodyTemplate = (rowData: ElementType) => {
        return rowData.icon ? <Icon icon={rowData.icon} className="text-2xl mx-auto" /> : null;
    };

    const requiresTreeTypeBodyTemplate = (rowData: ElementType) => {
        return rowData.requires_tree_type ? "Si" : "No";
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <ProgressSpinner style={{ width: "50px", height: "50px" }} strokeWidth="4" />
                <span className="mt-2 text-blue-600">{t("admin.pages.elementTypes.loading")}</span>
            </div>
        );
    }

    return (
        <>
            {msg && (
                <Message
                    severity={successMsg || msg === t("admin.pages.elementTypes.deletedSuccess") ? "success" : "error"}
                    text={msg}
                    className="mb-4 w-full"
                />
            )}
            <CrudPanel
                title={t("admin.pages.elementTypes.title")}
                onCreate={() => navigate("/admin/settings/element-types/create")}
            >
                <DataTable
                    value={elementTypes}
                    paginator
                    rows={10}
                    stripedRows
                    showGridlines
                    className="p-datatable-sm"
                >
                    <Column field="name" header={t("admin.pages.elementTypes.columns.name")} />
                    <Column field="requires_tree_type" header={t("admin.pages.elementTypes.columns.requires_tree_type")} body={requiresTreeTypeBodyTemplate} />
                    <Column field="description" header={t("admin.pages.elementTypes.columns.description")} />
                    <Column field="icon" header={t("admin.pages.elementTypes.columns.icon")} body={iconBodyTemplate} style={{ textAlign: 'center' }} />
                    <Column field="color" header={t("admin.pages.elementTypes.columns.color")} body={colorBodyTemplate} style={{ textAlign: 'center' }} />
                    <Column
                        header={t("admin.pages.elementTypes.actions")}
                        body={(rowData: { id: number }) => (
                            <div className="flex justify-center gap-2">
                                <Button
                                    icon={<Icon icon="tabler:edit" className="h-5 w-5" />}
                                    className="p-button-rounded p-button-info"
                                    tooltip={t("admin.pages.elementTypes.editButton")}
                                    tooltipOptions={{ position: "top" }}
                                    onClick={() => navigate(`/admin/settings/element-types/edit/${rowData.id}`)}
                                />
                                <Button
                                    icon={<Icon icon="tabler:trash" className="h-5 w-5" />}
                                    className="p-button-rounded p-button-danger"
                                    tooltip={t("admin.pages.elementTypes.deleteButton")}
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