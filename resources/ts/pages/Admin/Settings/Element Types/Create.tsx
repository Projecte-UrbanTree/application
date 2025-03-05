import { useState, useRef } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axiosClient from "@/api/axiosClient";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { ColorPicker } from "primereact/colorpicker";
import { AutoComplete } from "primereact/autocomplete";
import { Card } from "primereact/card";
import { InputTextarea } from "primereact/inputtextarea";

const iconList = [
    "tabler:home", "tabler:user", "tabler:star", "tabler:check",
    "tabler:times", "tabler:bell", "tabler:calendar", "tabler:camera",
    "tabler:heart", "tabler:settings", "tabler:search", "tabler:lock",
    "tabler:unlock", "tabler:trash", "tabler:edit", "tabler:plus",
    "tabler:minus", "tabler:download", "tabler:upload", "tabler:cloud",
    "tabler:folder", "tabler:file", "tabler:music", "tabler:video",
    "tabler:image", "tabler:map", "tabler:location", "tabler:phone",
    "tabler:mail", "tabler:message", "tabler:chat", "tabler:globe",
    "tabler:link", "tabler:bookmark", "tabler:tag", "tabler:cart",
    "tabler:credit-card", "tabler:wallet", "tabler:gift", "tabler:lightbulb"
];

export default function CreateElementType() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [filteredIcons, setFilteredIcons] = useState<string[]>([]);
    const iconInputRef = useRef(null);

    const initialValues = {
        name: "",
        requires_tree_type: false,
        description: "",
        icon: "",
        color: "#FF0000"
    };

    const validationSchema = Yup.object({
        name: Yup.string().required(t("admin.pages.elementTypes.create.validations.name")),
        requires_tree_type: Yup.boolean().required(t("admin.pages.elementTypes.create.validations.requires_tree_type")),
        description: Yup.string(),
        icon: Yup.string().required(t("admin.pages.elementTypes.create.validations.icon")),
        color: Yup.string().required(),
    });

    const booleanOptions = [
        { label: t("admin.fields.true"), value: true },
        { label: t("admin.fields.false"), value: false }
    ];

    const handleSubmit = async (values: typeof initialValues) => {
        setIsSubmitting(true);
        try {
            await axiosClient.post("/admin/element-types", values);
            navigate("/admin/settings/element-types", { state: { success: t("admin.pages.elementTypes.success") } });
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const searchIcons = (event: { query: string }) => {
        const query = event.query.toLowerCase();
        setFilteredIcons(iconList.filter(icon => icon.includes(query)));
    };

    return (
        <div className="flex items-center justify-center bg-gray-50 p-4 md:p-6">
            <Card className="w-full max-w-3xl shadow-lg">
                <header className="bg-blue-700 px-6 py-4 flex items-center -mt-6 -mx-6 rounded-t-lg">
                    <Button 
                        className="p-button-text mr-4 text-white" 
                        style={{ color: "#fff" }}
                        onClick={() => navigate("/admin/settings/element-types")}>
                        <Icon icon="tabler:arrow-left" className="h-6 w-6" />
                    </Button>
                    <h2 className="text-white text-3xl font-bold">{t("admin.pages.elementTypes.create.title")}</h2>
                </header>
                <div className="p-6">
                    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                        {({ errors, touched, values, setFieldValue }) => (
                            <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium">{t("admin.pages.elementTypes.columns.name")}</label>
                                    <Field name="name" as={InputText} placeholder={t("admin.pages.elementTypes.create.placeholders.name")} className={errors.name && touched.name ? "p-invalid" : ""} />
                                    {errors.name && touched.name && <small className="p-error">{errors.name}</small>}
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium">{t("admin.pages.elementTypes.columns.requires_tree_type")}</label>
                                    <Dropdown
                                        value={values.requires_tree_type}
                                        options={booleanOptions}
                                        onChange={(e) => setFieldValue("requires_tree_type", e.value)}
                                        placeholder={t("admin.pages.elementTypes.create.placeholders.requires_tree_type")}
                                        className={errors.requires_tree_type && touched.requires_tree_type ? "p-invalid" : ""}
                                    />
                                    {errors.requires_tree_type && touched.requires_tree_type && <small className="p-error">{errors.requires_tree_type}</small>}
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium">{t("admin.pages.elementTypes.columns.description")}</label>
                                    <Field name="description" as={InputTextarea} rows={5} placeholder={t("admin.pages.elementTypes.create.placeholders.description")} />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium">Ícono</label>
                                    <AutoComplete
                                        value={values.icon}
                                        suggestions={filteredIcons}
                                        completeMethod={searchIcons}
                                        onChange={(e) => setFieldValue("icon", e.value)}
                                        placeholder={t("admin.pages.elementTypes.create.placeholders.icon")}
                                        itemTemplate={(item) => (
                                            <Icon icon={item} className="text-2xl" />
                                        )}
                                        selectedItemTemplate={(value) =>
                                            value ? <Icon icon={value} className="text-2xl" /> : null
                                        }
                                        className={errors.icon && touched.icon ? "p-invalid" : ""}
                                    />
                                    {errors.icon && touched.icon && (
                                        <small className="p-error">{errors.icon}</small>
                                    )}
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium">{t("admin.pages.elementTypes.columns.color")}</label>
                                    <ColorPicker value={values.color} onChange={(e) => setFieldValue("color", e.value)} placeholder={t("admin.pages.elementTypes.create.placeholders.color")} />
                                </div>

                                <div className="md:col-span-2 flex justify-end mt-4">
                                    <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto"
                                        icon={isSubmitting ? "pi pi-spin pi-spinner" : "pi pi-check"}
                                        label={isSubmitting ? t("admin.pages.elementTypes.create.submittingText") : t("admin.pages.elementTypes.create.submitButton")}
                                    />
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </Card>
        </div>
    );
}
