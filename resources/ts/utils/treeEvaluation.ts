import { useTranslation } from 'react-i18next';

export interface EvaluationResult {
  message: string;
  color: string;
}

export interface Eva {
  id: number;
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
  years?: number;
  months?: number;
  element?: {
    point?: {
      latitude: number;
      longitude: number;
    },
    element_type?: {
      name: string;
    }
  };
}

export const useTreeEvaluation = () => {
  const { t } = useTranslation();

  const getStatusMessage = (status: number): EvaluationResult => {
    const percentage = (status / 36) * 100;
    if (percentage >= 0 && percentage <= 24) {
      return { message: t('admin.pages.evas.status.low'), color: 'var(--green-500)' };
    }
    if (percentage >= 25 && percentage <= 49) {
      return {
        message: t('admin.pages.evas.status.moderate'),
        color: 'var(--green-600)',
      };
    }
    if (percentage >= 50 && percentage <= 74) {
      return { message: t('admin.pages.evas.status.high'), color: 'var(--yellow-500)' };
    }
    if (percentage >= 75 && percentage <= 100) {
      return {
        message: t('admin.pages.evas.status.critical'),
        color: 'var(--red-500)',
      };
    }
    return { message: t('admin.pages.evas.status.pending'), color: 'var(--gray-500)' };
  };

  const calculateStabilityIndex = (
    height: number,
    diameter: number,
  ): EvaluationResult => {
    const index = (height / diameter) * 100;
    if (index < 50) {
      return {
        message: t('admin.pages.evas.stability.stable'),
        color: 'var(--green-500)',
      };
    } else if (index >= 50 && index <= 80) {
      return {
        message: t('admin.pages.evas.stability.moderate'),
        color: 'var(--green-600)',
      };
    } else if (index > 80) {
      return {
        message: t('admin.pages.evas.stability.highRisk'),
        color: 'var(--red-500)',
      };
    } else {
      return {
        message: t('admin.pages.evas.stability.pending'),
        color: 'var(--gray-500)',
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
        color: 'var(--green-500)',
      };
    } else if (ratio >= 0.3 && ratio <= 0.5) {
      return {
        message: t('admin.pages.evas.gravityHeight.moderateRisk'),
        color: 'var(--green-600)',
      };
    } else if (ratio > 0.5) {
      return {
        message: t('admin.pages.evas.gravityHeight.highRisk'),
        color: 'var(--red-500)',
      };
    } else {
      return {
        message: t('admin.pages.evas.gravityHeight.pending'),
        color: 'var(--gray-500)',
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
        color: 'var(--green-500)',
      };
    } else if (ratio > 1.5 && ratio <= 2) {
      return {
        message: t('admin.pages.evas.rootCrown.stable'),
        color: 'var(--green-600)',
      };
    } else if (ratio > 1 && ratio <= 1.5) {
      return {
        message: t('admin.pages.evas.rootCrown.moderateStability'),
        color: 'var(--yellow-500)',
      };
    } else if (ratio <= 1) {
      return {
        message: t('admin.pages.evas.rootCrown.highRisk'),
        color: 'var(--red-500)',
      };
    } else {
      return {
        message: t('admin.pages.evas.rootCrown.pending'),
        color: 'var(--gray-500)',
      };
    }
  };

  const calculateWindStabilityIndex = (
    height: number,
    crown_width: number,
    rootSurfaceDiameter: number,
  ): EvaluationResult => {
    const index = (height * crown_width) / rootSurfaceDiameter;
    if (index < 0.5) {
      return {
        message: t('admin.pages.evas.windStability.veryStable'),
        color: 'var(--green-500)',
      };
    } else if (index >= 0.5 && index <= 1) {
      return {
        message: t('admin.pages.evas.windStability.moderateStability'),
        color: 'var(--yellow-500)',
      };
    } else if (index > 1) {
      return {
        message: t('admin.pages.evas.windStability.highRisk'),
        color: 'var(--red-500)',
      };
    } else {
      return {
        message: t('admin.pages.evas.windStability.pending'),
        color: 'var(--gray-500)',
      };
    }
  };

  const getSeverityMessage = (value: number): EvaluationResult => {
    switch (value) {
      case 0:
        return {
          message: t('admin.pages.evas.severity.low'),
          color: 'var(--green-500)',
        };
      case 1:
        return {
          message: t('admin.pages.evas.severity.moderate'),
          color: 'var(--green-600)',
        };
      case 2:
        return {
          message: t('admin.pages.evas.severity.high'),
          color: 'var(--yellow-500)',
        };
      case 3:
        return {
          message: t('admin.pages.evas.severity.extreme'),
          color: 'var(--red-500)',
        };
      default:
        return {
          message: t('admin.pages.evas.severity.pending'),
          color: 'var(--gray-500)',
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
