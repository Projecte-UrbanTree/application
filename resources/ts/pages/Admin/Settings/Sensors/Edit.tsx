import { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axiosClient from "@/api/axiosClient";
import { useNavigate, useParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";

interface Sensor {
  device_eui: string;
  name: string;
  latitude: number;
  longitude: number;
  contract_id: number;
}

export default function EditSensor() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialValues, setInitialValues] = useState<Sensor | null>(null);

  const validationSchema = Yup.object({
    device_eui: Yup.string().required("Device EUI is required"),
    name: Yup.string().required(t("admin.pages.sensors.form.validation.name_required")),
    latitude: Yup.number().required(t("admin.pages.sensors.form.validation.latitude_required")),
    longitude: Yup.number().required(t("admin.pages.sensors.form.validation.longitude_required")),
    contract_id: Yup.number().required("Contract ID is required"),
  });

  useEffect(() => {
    const fetchSensor = async () => {
      try {
        const response = await axiosClient.get(`/admin/sensor/${id}`);
        setInitialValues(response.data); 
      } catch (error) {
        console.error("Error fetching sensor:", error);
        navigate("/admin/sensors", { state: { error: t("admin.pages.sensors.list.messages.error") } });
      }
    };
    fetchSensor();
  }, [id, navigate, t]);

  const handleSubmit = async (values: Sensor) => {
    setIsSubmitting(true);
    try {
      const response = await axiosClient.put(`/admin/sensor/${id}`, values);
      console.log("Sensor updated:", response.data);
      navigate("/admin/sensors", { state: { success: t("admin.pages.sensors.list.messages.updateSuccess") } });
    } catch (error) {
      console.error("Error updating sensor:", error);
      navigate("/admin/sensors", { state: { error: t("admin.pages.sensors.list.messages.error") } });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!initialValues) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>{t("general.loading")}</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center bg-gray-50 p-4 md:p-6">
      <Card className="w-full max-w-3xl shadow-lg">
        <header className="bg-blue-700 px-6 py-4 flex items-center -mt-6 -mx-6 rounded-t-lg">
          <Button
            className="p-button-text mr-4"
            style={{ color: "#fff" }}
            onClick={() => navigate("/admin/sensors")}
          >
            <Icon icon="tabler:arrow-left" className="h-6 w-6" />
          </Button>
          <h2 className="text-white text-3xl font-bold">
            {t("admin.pages.sensors.form.title.edit")}
          </h2>
        </header>
        <div className="p-6">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ errors, touched }) => (
              <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Icon icon="tabler:tag" className="h-5 w-5 mr-2" />
                    Device EUI
                  </label>
                  <Field
                    name="device_eui"
                    as={InputText}
                    placeholder="Device EUI"
                    className={errors.device_eui && touched.device_eui ? "p-invalid" : ""}
                  />
                  {errors.device_eui && touched.device_eui && (
                    <small className="p-error">{errors.device_eui}</small>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Icon icon="tabler:tag" className="h-5 w-5 mr-2" />
                    {t("admin.fields.name")}
                  </label>
                  <Field
                    name="name"
                    as={InputText}
                    placeholder={t("admin.fields.name")}
                    className={errors.name && touched.name ? "p-invalid" : ""}
                  />
                  {errors.name && touched.name && (
                    <small className="p-error">{errors.name}</small>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Icon icon="tabler:map-pin" className="h-5 w-5 mr-2" />
                    {t("admin.fields.latitude")}
                  </label>
                  <Field
                    name="latitude"
                    as={InputText}
                    placeholder={t("admin.fields.latitude")}
                    className={errors.latitude && touched.latitude ? "p-invalid" : ""}
                  />
                  {errors.latitude && touched.latitude && (
                    <small className="p-error">{errors.latitude}</small>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Icon icon="tabler:map-pin" className="h-5 w-5 mr-2" />
                    {t("admin.fields.longitude")}
                  </label>
                  <Field
                    name="longitude"
                    as={InputText}
                    placeholder={t("admin.fields.longitude")}
                    className={errors.longitude && touched.longitude ? "p-invalid" : ""}
                  />
                  {errors.longitude && touched.longitude && (
                    <small className="p-error">{errors.longitude}</small>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Icon icon="tabler:tag" className="h-5 w-5 mr-2" />
                    Contract ID
                  </label>
                  <Field
                    name="contract_id"
                    as={InputText}
                    placeholder="Contract ID"
                    className={errors.contract_id && touched.contract_id ? "p-invalid" : ""}
                  />
                  {errors.contract_id && touched.contract_id && (
                    <small className="p-error">{errors.contract_id}</small>
                  )}
                </div>
                <div className="md:col-span-2 flex justify-end mt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-auto"
                    icon={isSubmitting ? "pi pi-spin pi-spinner" : "pi pi-check"}
                    label={
                      isSubmitting
                        ? t("admin.pages.sensors.form.submittingText.edit")
                        : t("admin.pages.sensors.form.submitButton.edit")
                    }
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
