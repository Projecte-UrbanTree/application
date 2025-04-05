import { Icon } from '@iconify/react';
import { differenceInMonths, differenceInYears, format } from 'date-fns';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Message } from 'primereact/message';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Tooltip } from 'primereact/tooltip';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import axiosClient from '@/api/axiosClient';
import { Eva, useTreeEvaluation } from '@/utils/treeEvaluation';

export default function ShowEva() {
  const { id } = useParams<{ id: string }>();
  const [eva, setEva] = useState<Eva | null>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    getStatusMessage,
    calculateStabilityIndex,
    calculateGravityHeightRatio,
    calculateRootCrownRatio,
    calculateWindStabilityIndex,
    getSeverityMessage,
  } = useTreeEvaluation();

  useEffect(() => {
    const fetchEva = async () => {
      try {
        const response = await axiosClient.get(`/admin/evas/${id}`);
        setEva(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setErrorMessage(t('admin.pages.evas.show.loadError'));
        setIsLoading(false);
      }
    };

    fetchEva();

    if (location.state?.success) {
      setSuccessMessage(location.state.success);
    } else if (location.state?.error) {
      setErrorMessage(location.state.error);
    }
  }, [id, location, t]);

  const getStatusBadge = (message: string, color: string, tooltip?: string) => {
    const baseColor = color;
    const textColor = getContrastColor(baseColor);

    return (
      <span
        className="ml-2 px-3 py-1 rounded-full text-center font-medium shadow-sm cursor-pointer"
        style={{
          backgroundColor: baseColor,
          color: textColor,
        }}
        data-pr-tooltip={tooltip}
        data-pr-position="top">
        {message}
      </span>
    );
  };

  const getContrastColor = (hexColor: string) => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.5 ? '#000000' : '#ffffff';
  };

  const calculateAgeDiff = (dateString: string) => {
    const now = new Date();
    const birth = new Date(dateString);
    const years = differenceInYears(now, birth);
    const months = differenceInMonths(now, birth) % 12;
    return `${years} ${t('admin.pages.evas.form.yearsShort')} ${months} ${t('admin.pages.evas.form.monthsShort')}`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <ProgressSpinner
          style={{ width: '50px', height: '50px' }}
          strokeWidth="4"
        />
      </div>
    );
  }

  if (!eva) {
    return (
      <div className="p-4">
        <Message severity="error" text={t('admin.pages.evas.show.notFound')} />
      </div>
    );
  }

  const { message, color } = getStatusMessage(eva.status);
  const stabilityIndex = calculateStabilityIndex(eva.height, eva.diameter);
  const gravityHeightRatio = calculateGravityHeightRatio(
    eva.height_estimation,
    eva.height,
  );
  const rootCrownRatio = calculateRootCrownRatio(
    eva.effective_root_area,
    eva.crown_projection_area,
  );
  const windStabilityIndex = calculateWindStabilityIndex(
    eva.height,
    eva.crown_width,
    eva.effective_root_area,
  );

  return (
    <>
      <Tooltip target=".tooltip-target" />
      <div className="flex items-center mb-6">
        <Button
          icon={<Icon icon="tabler:arrow-left" className="h-5 w-5" />}
          className="p-button-text text-gray-600 hover:text-indigo-600 mr-3"
          onClick={() => navigate('/admin/evas')}
        />
        <h2 className="text-2xl font-semibold text-gray-800">
          {t('admin.pages.evas.show.title')}
        </h2>
        <Button
          icon={<Icon icon="tabler:edit" className="h-5 w-5" />}
          className="p-button-text text-gray-600 hover:text-indigo-600 ml-auto"
          onClick={() => navigate(`/admin/evas/edit/${id}`)}
        />
      </div>

      {successMessage && (
        <Message
          severity="success"
          text={successMessage}
          className="mb-4 w-full"
        />
      )}

      {errorMessage && (
        <Message severity="error" text={errorMessage} className="mb-4 w-full" />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="border border-gray-300 bg-white shadow-md">
          <div className="p-0">
            <div className="bg-gray-100 p-4 rounded-t-lg border-b">
              <h2 className="text-lg font-bold text-gray-800">
                {t('admin.pages.evas.show.generalInfo')}
              </h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <p className="text-gray-500 text-xs uppercase font-semibold">
                    {t('admin.pages.evas.show.element')}
                  </p>
                  <p className="text-gray-800">ID: {eva.element_id}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase font-semibold">
                    {t('admin.pages.evas.form.height')}
                  </p>
                  <p className="text-gray-800">{eva.height} m</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase font-semibold">
                    {t('admin.pages.evas.form.diameter')}
                  </p>
                  <p className="text-gray-800">{eva.diameter} cm</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase font-semibold">
                    {t('admin.pages.evas.form.age')}
                  </p>
                  <p className="text-gray-800">
                    {calculateAgeDiff(eva.date_birth)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase font-semibold">
                    {t('admin.pages.evas.form.dateBirth')}
                  </p>
                  <p className="text-gray-800">
                    {format(new Date(eva.date_birth), 'dd/MM/yyyy')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="border border-gray-300 bg-white shadow-md md:col-span-2">
          <div className="p-0">
            <div className="bg-gray-100 p-4 rounded-t-lg border-b">
              <h2 className="text-lg font-bold text-gray-800">
                {t('admin.pages.evas.indexCalculation')}
              </h2>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <p className="flex items-center justify-between">
                  <span
                    className="flex items-center tooltip-target"
                    data-pr-tooltip={t(
                      'admin.pages.evas.show.statusFactorInfo',
                    )}
                    data-pr-position="right">
                    <strong>{t('admin.pages.evas.treeStatusFactor')}:</strong>
                    <Icon
                      icon="tabler:info-circle"
                      className="h-5 w-5 ml-2 text-indigo-600"
                    />
                  </span>
                  {getStatusBadge(message, color)}
                </p>

                <p className="flex items-center justify-between">
                  <span
                    className="flex items-center tooltip-target"
                    data-pr-tooltip={t(
                      'admin.pages.evas.show.formulas.stabilityIndex',
                      {
                        formula: 'height / diameter',
                      },
                    )}
                    data-pr-position="right">
                    <strong>{t('admin.pages.evas.stabilityIndex')}:</strong>
                    <Icon
                      icon="tabler:info-circle"
                      className="h-5 w-5 ml-2 text-indigo-600"
                    />
                  </span>
                  {getStatusBadge(stabilityIndex.message, stabilityIndex.color)}
                </p>

                <p className="flex items-center justify-between">
                  <span
                    className="flex items-center tooltip-target"
                    data-pr-tooltip={t(
                      'admin.pages.evas.show.formulas.gravityHeightRatio',
                      {
                        formula: 'height_estimation / height',
                      },
                    )}
                    data-pr-position="right">
                    <strong>{t('admin.pages.evas.gravityHeightRatio')}:</strong>
                    <Icon
                      icon="tabler:info-circle"
                      className="h-5 w-5 ml-2 text-indigo-600"
                    />
                  </span>
                  {getStatusBadge(
                    gravityHeightRatio.message,
                    gravityHeightRatio.color,
                  )}
                </p>

                <p className="flex items-center justify-between">
                  <span
                    className="flex items-center tooltip-target"
                    data-pr-tooltip={t(
                      'admin.pages.evas.show.formulas.rootCrownRatio',
                      {
                        formula: 'effective_root_area / crown_projection_area',
                      },
                    )}
                    data-pr-position="right">
                    <strong>{t('admin.pages.evas.rootCrownRatio')}:</strong>
                    <Icon
                      icon="tabler:info-circle"
                      className="h-5 w-5 ml-2 text-indigo-600"
                    />
                  </span>
                  {getStatusBadge(rootCrownRatio.message, rootCrownRatio.color)}
                </p>

                <p className="flex items-center justify-between">
                  <span
                    className="flex items-center tooltip-target"
                    data-pr-tooltip={t(
                      'admin.pages.evas.show.formulas.windStabilityIndex',
                      {
                        formula: '(height * crown_width) / effective_root_area',
                      },
                    )}
                    data-pr-position="right">
                    <strong>{t('admin.pages.evas.windStabilityIndex')}:</strong>
                    <Icon
                      icon="tabler:info-circle"
                      className="h-5 w-5 ml-2 text-indigo-600"
                    />
                  </span>
                  {getStatusBadge(
                    windStabilityIndex.message,
                    windStabilityIndex.color,
                  )}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="border border-gray-300 bg-white shadow-sm mb-6">
        <div className="p-0">
          <div className="bg-gray-100 p-4 rounded-t-lg border-b">
            <h2 className="text-lg font-bold text-gray-800">
              {t('admin.pages.evas.environmentalFactors')}
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">
                  {t('admin.pages.evas.windExposure')}
                </h3>
                {getStatusBadge(
                  getSeverityMessage(eva.wind).message,
                  getSeverityMessage(eva.wind).color,
                )}
              </div>
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">
                  {t('admin.pages.evas.droughtExposure')}
                </h3>
                {getStatusBadge(
                  getSeverityMessage(eva.drought).message,
                  getSeverityMessage(eva.drought).color,
                )}
              </div>
              <div className="border rounded-lg p-4 bg-gray-50 md:col-span-2">
                <h3 className="flex items-center text-sm font-semibold mb-3">
                  <Icon
                    icon="tabler:chart-donut-4"
                    className="h-5 w-5 mr-2 text-green-600"
                  />
                  {t('admin.pages.evas.show.treeStructure')}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <div className="text-center">
                    <div className="text-xs text-gray-500">
                      {t('admin.pages.evas.form.crown_width')}
                    </div>
                    <div className="font-medium">{eva.crown_width} m</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">
                      {t('admin.pages.evas.form.crown_projection_area')}
                    </div>
                    <div className="font-medium">
                      {eva.crown_projection_area} m²
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">
                      {t('admin.pages.evas.form.root_surface_diameter')}
                    </div>
                    <div className="font-medium">
                      {eva.root_surface_diameter} m
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">
                      {t('admin.pages.evas.form.effective_root_area')}
                    </div>
                    <div className="font-medium">
                      {eva.effective_root_area} m²
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="border border-gray-300 bg-white shadow-sm mb-4">
        <div className="p-0">
          <div className="bg-gray-100 p-3 rounded-t-lg border-b">
            <h2 className="flex items-center text-lg font-bold text-gray-800">
              <Icon icon="tabler:tree" className="h-5 w-5 mr-2" />
              {t('admin.pages.evas.show.treeCondition')}
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-3">
                <h3 className="flex items-center text-sm font-semibold mb-3 border-b pb-2">
                  <Icon
                    icon="tabler:leaf"
                    className="h-5 w-5 mr-2 text-green-600"
                  />
                  {t('admin.pages.evas.edit.crownBranches')}
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">
                      {t('admin.pages.evas.form.unbalanced_crown')}
                    </span>
                    {getStatusBadge(
                      getSeverityMessage(eva.unbalanced_crown).message,
                      getSeverityMessage(eva.unbalanced_crown).color,
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">
                      {t('admin.pages.evas.form.overextended_branches')}
                    </span>
                    {getStatusBadge(
                      getSeverityMessage(eva.overextended_branches).message,
                      getSeverityMessage(eva.overextended_branches).color,
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">
                      {t('admin.pages.evas.form.cracks')}
                    </span>
                    {getStatusBadge(
                      getSeverityMessage(eva.cracks).message,
                      getSeverityMessage(eva.cracks).color,
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">
                      {t('admin.pages.evas.form.dead_branches')}
                    </span>
                    {getStatusBadge(
                      getSeverityMessage(eva.dead_branches).message,
                      getSeverityMessage(eva.dead_branches).color,
                    )}
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-3">
                <h3 className="flex items-center text-sm font-semibold mb-3 border-b pb-2">
                  <Icon
                    icon="tabler:column"
                    className="h-5 w-5 mr-2 text-brown-600"
                  />
                  {t('admin.pages.evas.edit.trunk')}
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">
                      {t('admin.pages.evas.form.inclination')}
                    </span>
                    {getStatusBadge(
                      getSeverityMessage(eva.inclination).message,
                      getSeverityMessage(eva.inclination).color,
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">
                      {t('admin.pages.evas.form.V_forks')}
                    </span>
                    {getStatusBadge(
                      getSeverityMessage(eva.V_forks).message,
                      getSeverityMessage(eva.V_forks).color,
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">
                      {t('admin.pages.evas.form.cavities')}
                    </span>
                    {getStatusBadge(
                      getSeverityMessage(eva.cavities).message,
                      getSeverityMessage(eva.cavities).color,
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">
                      {t('admin.pages.evas.form.bark_damage')}
                    </span>
                    {getStatusBadge(
                      getSeverityMessage(eva.bark_damage).message,
                      getSeverityMessage(eva.bark_damage).color,
                    )}
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-3">
                <h3 className="flex items-center text-sm font-semibold mb-3 border-b pb-2">
                  <Icon
                    icon="tabler:plant-2"
                    className="h-5 w-5 mr-2 text-amber-700"
                  />
                  {t('admin.pages.evas.edit.roots')}
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">
                      {t('admin.pages.evas.form.soil_lifting')}
                    </span>
                    {getStatusBadge(
                      getSeverityMessage(eva.soil_lifting).message,
                      getSeverityMessage(eva.soil_lifting).color,
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">
                      {t('admin.pages.evas.form.cut_damaged_roots')}
                    </span>
                    {getStatusBadge(
                      getSeverityMessage(eva.cut_damaged_roots).message,
                      getSeverityMessage(eva.cut_damaged_roots).color,
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">
                      {t('admin.pages.evas.form.basal_rot')}
                    </span>
                    {getStatusBadge(
                      getSeverityMessage(eva.basal_rot).message,
                      getSeverityMessage(eva.basal_rot).color,
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">
                      {t('admin.pages.evas.form.exposed_surface_roots')}
                    </span>
                    {getStatusBadge(
                      getSeverityMessage(eva.exposed_surface_roots).message,
                      getSeverityMessage(eva.exposed_surface_roots).color,
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}
