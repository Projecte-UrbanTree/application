// TreeEvaluationFunctions.tsx
import { t } from 'i18next';
import { useTranslation } from 'react-i18next';

interface EvaluationResult {
  message: string;
  color: string;
}

interface Eva {
  element_id: number;
  date_birth: string;
  height: number;
  diameter: number;
  crown_width: number;
  crown_projection_area: number;
  root_surface_diameter: number;
  effective_root_area: number;
  height_estimation: number;
  unbalanced_crown: number;
  overextended_branches: number;
  cracks: number;
  dead_branches: number;
  inclination: number;
  V_forks: number;
  cavities: number;
  bark_damage: number;
  soil_lifting: number;
  cut_damaged_roots: number;
  basal_rot: number;
  exposed_surface_roots: number;
  wind: number;
  drought: number;
  status: number;
}

export const useTreeEvaluation = () => {
  const { t } = useTranslation();

  const getStatusMessage = (status: number): EvaluationResult => {
    const percentage = (status / 36) * 100;
    if (percentage == 0 && percentage <= 24) {
      return { message: t('admin.pages.evas.status.low'), color: '#6AA84F' };
    }
    if (percentage >= 25 && percentage <= 49) {
      return {
        message: t('admin.pages.evas.status.moderate'),
        color: '#00FF00',
      };
    }
    if (percentage >= 50 && percentage <= 74) {
      return { message: t('admin.pages.evas.status.high'), color: '#FFFF00' };
    }
    if (percentage >= 75 && percentage <= 100) {
      return {
        message: t('admin.pages.evas.status.critical'),
        color: '#FF0000',
      };
    }
    return { message: t('admin.pages.evas.status.pending'), color: 'gray' };
  };

  const calculateStabilityIndex = (
    height: number,
    diameter: number,
  ): EvaluationResult => {
    const index = (height / diameter) * 100;
    if (index < 50) {
      return {
        message: t('admin.pages.evas.stability.stable'),
        color: '#6AA84F',
      };
    } else if (index >= 50 && index <= 80) {
      return {
        message: t('admin.pages.evas.stability.moderate'),
        color: '#00FF00',
      };
    } else if (index > 80) {
      return {
        message: t('admin.pages.evas.stability.highRisk'),
        color: '#FF0000',
      };
    } else {
      return {
        message: t('admin.pages.evas.stability.pending'),
        color: 'gray',
      };
    }
  };

  const calculateGravityHeightRatio = (
    heightEstimation: number,
    height: number,
  ): EvaluationResult => {
    const ratio = heightEstimation / height;
    if (ratio < 0.3) {
      return {
        message: t('admin.pages.evas.gravityHeight.veryStable'),
        color: '#6AA84F',
      };
    } else if (ratio >= 0.3 && ratio <= 0.5) {
      return {
        message: t('admin.pages.evas.gravityHeight.moderateRisk'),
        color: '#00FF00',
      };
    } else if (ratio > 0.5) {
      return {
        message: t('admin.pages.evas.gravityHeight.highRisk'),
        color: '#FF0000',
      };
    } else {
      return {
        message: t('admin.pages.evas.gravityHeight.pending'),
        color: 'gray',
      };
    }
  };

  const calculateRootCrownRatio = (
    effective_root_area: number,
    crown_projection_area: number,
  ): EvaluationResult => {
    const ratio = effective_root_area / crown_projection_area;
    if (ratio > 2) {
      return {
        message: t('admin.pages.evas.rootCrown.veryStable'),
        color: '#6AA84F',
      };
    } else if (ratio > 1.5 && ratio <= 2) {
      return {
        message: t('admin.pages.evas.rootCrown.stable'),
        color: '#00FF00',
      };
    } else if (ratio > 1 && ratio <= 1.5) {
      return {
        message: t('admin.pages.evas.rootCrown.moderateStability'),
        color: '#FFFF00',
      };
    } else if (ratio <= 1) {
      return {
        message: t('admin.pages.evas.rootCrown.highRisk'),
        color: '#FF0000',
      };
    } else {
      return {
        message: t('admin.pages.evas.rootCrown.pending'),
        color: 'gray',
      };
    }
  };

  const calculateWindStabilityIndex = (
    height: number,
    wind: number,
    rootSurfaceDiameter: number,
  ): EvaluationResult => {
    const index = (height * wind) / rootSurfaceDiameter;
    if (index < 0.5) {
      return {
        message: t('admin.pages.evas.windStability.veryStable'),
        color: '#6AA84F',
      };
    } else if (index >= 0.5 && index <= 1) {
      return {
        message: t('admin.pages.evas.windStability.moderateStability'),
        color: '#FFFF00',
      };
    } else if (index > 1) {
      return {
        message: t('admin.pages.evas.windStability.highRisk'),
        color: '#FF0000',
      };
    } else {
      return {
        message: t('admin.pages.evas.windStability.pending'),
        color: 'gray',
      };
    }
  };

  const getSeverityMessage = (value: number): EvaluationResult => {
    switch (value) {
      case 0:
        return {
          message: t('admin.pages.evas.severity.low'),
          color: '#6AA84F',
        };
      case 1:
        return {
          message: t('admin.pages.evas.severity.moderate'),
          color: '#00FF00',
        };
      case 2:
        return {
          message: t('admin.pages.evas.severity.high'),
          color: '#FFFF00',
        };
      case 3:
        return {
          message: t('admin.pages.evas.severity.extreme'),
          color: '#FF0000',
        };
      default:
        return {
          message: t('admin.pages.evas.severity.pending'),
          color: 'gray',
        };
    }
  };

  return {
    getStatusMessage,
    calculateStabilityIndex,
    calculateGravityHeightRatio,
    calculateRootCrownRatio,
    calculateWindStabilityIndex,
    getSeverityMessage,
  };
};

export type { Eva };
