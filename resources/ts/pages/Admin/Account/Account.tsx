import { useState, useEffect, FormEvent } from "react";
import { useTranslation } from "react-i18next";
import axiosClient from "@/api/axiosClient";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Card } from "primereact/card";
import { useToast } from "@/hooks/useToast";

export default function Account() {
    const { t } = useTranslation();
    const { showToast } = useToast();
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [company, setCompany] = useState("");
    const [dni, setDni] = useState("");

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const [currentPasswordError, setCurrentPasswordError] = useState<string | null>(null);
    const [newPasswordError, setNewPasswordError] = useState<string | null>(null);
    const [confirmNewPasswordError, setConfirmNewPasswordError] = useState<string | null>(null);
    const [nameError, setNameError] = useState<string | null>(null);
    const [surnameError, setSurnameError] = useState<string | null>(null);

    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axiosClient.get("/admin/account");
                setName(response.data.name ?? "");
                setSurname(response.data.surname ?? "");
                setEmail(response.data.email ?? "");
                setCompany(response.data.company ?? "");
                setDni(response.data.dni ?? "");
                setLoading(false);
            } catch (error) {
                setErrorMessage(t("admin.pages.account.messages.errorSaving"));
                setLoading(false);
            }
        };
        fetchUser();
    }, [t]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        setNameError(null);
        setSurnameError(null);
        setCurrentPasswordError(null);
        setNewPasswordError(null);
        setConfirmNewPasswordError(null);
        setErrorMessage(null);

        const nameRegex = /^[A-Za-z0-9 áéíóúÁÉÍÓÚñÑ]*$/;
        if (!nameRegex.test(name)) {
            setNameError(t("admin.pages.account.validation.name_invalid"));
            return;
        }
        if (!nameRegex.test(surname)) {
            setSurnameError(t("admin.pages.account.validation.surname_invalid"));
            return;
        }

        if (currentPassword || newPassword || confirmNewPassword) {
            if (!currentPassword) {
                setCurrentPasswordError(t("admin.pages.account.validation.currentPasswordRequired"));
                return;
            }
            if (newPassword.length < 6) {
                setNewPasswordError(t("admin.pages.account.validation.newPasswordMinLength"));
                return;
            }
            if (newPassword !== confirmNewPassword) {
                setConfirmNewPasswordError(t("admin.pages.account.validation.newPasswordMismatch"));
                return;
            }
        }

        try {
            await axiosClient.put("/admin/account", {
                name,
                surname,
                email,
                company
            });
            if (currentPassword && newPassword) {
                await axiosClient.put("/admin/account/password", {
                    currentPassword,
                    newPassword,
                    newPassword_confirmation: confirmNewPassword
                });
            }

            showToast("success", t("general.success"), t("admin.pages.account.messages.profileUpdated"));

        } catch (error: any) {
            if (error.response?.data?.error === "La contraseña actual no es correcta") {
                setCurrentPasswordError(t("admin.pages.account.messages.passwordCurrentWrong"));
            } else {
                setErrorMessage(error.response?.data?.error || t("admin.pages.account.messages.errorSaving"));
            }
        }
    };

    const handleLogout = async () => {
        try {
            await axiosClient.post("/logout");
        } catch (err) {
        }
        localStorage.removeItem("authToken");
        window.location.href = "/login";
    };

    const handleReturn = () => {
        window.location.href = "/admin/dashboard";
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                {t("general.loading")}
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center bg-gray-50 p-4 md:p-6">
            <Card className="w-full max-w-3xl shadow-lg">
                <header className="bg-blue-700 px-6 py-4 flex items-center -mt-6 -mx-6 rounded-t-lg">
                    <h2 className="text-white text-3xl font-bold">
                        {t("admin.pages.account.title")}
                    </h2>
                </header>
                <div className="p-6">
                    {errorMessage && (
                        <div className="p-4 mb-4 bg-red-100 text-red-700">
                            {errorMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <h3 className="col-span-2 text-lg font-bold">
                            {t("admin.pages.account.basicInfo")}
                        </h3>

                        <div className="flex flex-col">
                            <label>{t("admin.fields.name")}</label>
                            <InputText
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            {nameError && (
                                <small className="p-error">
                                    {nameError}
                                </small>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <label>{t("admin.fields.surname")}</label>
                            <InputText
                                value={surname}
                                onChange={(e) => setSurname(e.target.value)}
                            />
                            {surnameError && (
                                <small className="p-error">
                                    {surnameError}
                                </small>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <label>{t("admin.fields.email")}</label>
                            <InputText
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label>{t("admin.fields.dni")}</label>
                            <InputText
                                value={dni}
                                disabled
                            />
                        </div>

                        <h3 className="col-span-2 text-lg font-bold mt-4">
                            {t("admin.pages.account.security")}
                        </h3>

                        <div className="flex flex-col col-span-2">
                            <label>{t("admin.fields.password")}</label>
                            <Password
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                feedback={false}
                            />
                            {currentPasswordError && (
                                <small className="p-error">{currentPasswordError}</small>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <label>{t("admin.fields.password")} (nueva)</label>
                            <Password
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                feedback={false}
                            />
                            {newPasswordError && (
                                <small className="p-error">{newPasswordError}</small>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <label>{t("admin.fields.password")} (confirmar)</label>
                            <Password
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                feedback={false}
                            />
                            {confirmNewPasswordError && (
                                <small className="p-error">{confirmNewPasswordError}</small>
                            )}
                        </div>

                        <div className="col-span-2 flex justify-between mt-4">
                            <Button type="submit">
                                {t("admin.pages.account.actions.save")}
                            </Button>
                            <Button type="button" onClick={handleReturn}>
                                {t("admin.pages.account.actions.return")}
                            </Button>
                            <Button type="button" className="p-button-danger" onClick={handleLogout}>
                                {t("admin.pages.account.actions.logout")}
                            </Button>
                        </div>
                    </form>
                </div>
            </Card>
        </div>
    );
}
