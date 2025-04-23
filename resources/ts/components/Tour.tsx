import Shepherd from 'shepherd.js';
import { useTranslation } from 'react-i18next';

const startTour = (navigate: (path: string) => void, t: (key: string) => string) => {
    const tour = new Shepherd.Tour({
        defaultStepOptions: {
            cancelIcon: { enabled: true, label: '×' },
            classes: 'shepherd-theme-minimal bg-white border border-gray-200',
            scrollTo: { behavior: 'smooth', block: 'center' },
            arrow: true,
            when: {
                show() {
                    updateProgressBar(this.tour);
                }
            }
        },
        useModalOverlay: true,
        tourName: 'Guía específica',
    });

    tour.addStep({
        id: 'menu-dashboard',
        title: `${t('admin.tour.menuDashboard.title')} <div class="shepherd-progress"></div>`,
        text: t('admin.tour.menuDashboard.text'),
        attachTo: { element: 'a[href="/admin/dashboard"]', on: 'bottom' },
        beforeShowPromise: () => {
            navigate('/admin/dashboard');
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(true);
                }, 1000);
            });
        },
        buttons: [
            { text: t('admin.tour.nextButton'), action: () => tour.next(), classes: 'bg-blue-500 text-white' },
        ],
    });

    tour.addStep({
        id: 'menu-inventory',
        title: `${t('admin.tour.menuInventory.title')} <div class="shepherd-progress"></div>`,
        text: t('admin.tour.menuInventory.text'),
        attachTo: { element: 'a[href="/admin/inventory"]', on: 'bottom' },
        buttons: [
            { text: t('admin.tour.previousButton'), action: () => tour.back(), classes: 'border border-gray-300 text-gray-700' },
            { text: t('admin.tour.nextButton'), action: () => tour.next(), classes: 'bg-blue-500 text-white' },
        ],
    });

    tour.addStep({
        id: 'menu-settings',
        title: `${t('admin.tour.menuSettings.title')} <div class="shepherd-progress"></div>`,
        text: t('admin.tour.menuSettings.text'),
        attachTo: { element: 'a[href="/admin/settings/contracts"]', on: 'bottom' },
        buttons: [
            { text: t('admin.tour.previousButton'), action: () => tour.back(), classes: 'border border-gray-300 text-gray-700' },
            { text: t('admin.tour.nextButton'), action: () => tour.next(), classes: 'bg-blue-500 text-white' },
        ],
    });

    tour.addStep({
        id: 'contract-dropdown',
        title: `${t('admin.tour.contractDropdown.title')} <div class="shepherd-progress"></div>`,
        text: t('admin.tour.contractDropdown.text'),
        attachTo: { element: '#contractBtn', on: 'bottom' },
        buttons: [
            { text: t('admin.tour.previousButton'), action: () => tour.back(), classes: 'border border-gray-300 text-gray-700' },
            { text: t('admin.tour.nextButton'), action: () => tour.next(), classes: 'bg-blue-500 text-white' },
        ],
    });

    tour.addStep({
        id: 'language-selector',
        title: `${t('admin.tour.languageSelector.title')} <div class="shepherd-progress"></div>`,
        text: t('admin.tour.languageSelector.text'),
        attachTo: { element: '.lang-selector', on: 'bottom' },
        buttons: [
            { text: t('admin.tour.previousButton'), action: () => tour.back(), classes: 'border border-gray-300 text-gray-700' },
            { text: t('admin.tour.nextButton'), action: () => tour.next(), classes: 'bg-blue-500 text-white' },
        ],
    });

    tour.addStep({
        id: 'avatar',
        title: `${t('admin.tour.avatar.title')} <div class="shepherd-progress"></div>`,
        text: t('admin.tour.avatar.text'),
        attachTo: { element: '.p-avatar', on: 'left' },
        buttons: [
            { text: t('admin.tour.previousButton'), action: () => tour.back(), classes: 'border border-gray-300 text-gray-700' },
            { text: t('admin.tour.nextButton'), action: () => tour.next(), classes: 'bg-blue-500 text-white' },
        ],
    });
    tour.addStep({
        id: 'menu-settings',
        title: `${t('admin.tour.menuSettings.title')} <div class="shepherd-progress"></div>`,
        text: t('admin.tour.menuSettings.text'),
        attachTo: { element: '.submenu-contracts', on: 'bottom' },
        beforeShowPromise: () => {
            navigate('/admin/settings/contracts');
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(true);
                }, 1000);
            });
        },
        buttons: [
            { text: t('admin.tour.previousButton'), action: () => tour.back(), classes: 'border border-gray-300 text-gray-700' },
            { text: t('admin.tour.nextButton'), action: () => tour.next(), classes: 'bg-blue-500 text-white' },

        ],
    });
    tour.addStep({
        id: 'submenu-element-types',
        title: `${t('admin.tour.submenuElementTypes.title')} <div class="shepherd-progress"></div>`,
        text: t('admin.tour.submenuElementTypes.text'),
        attachTo: { element: 'a[href="/admin/settings/element-types"]', on: 'bottom' },
        buttons: [
            { text: t('admin.tour.previousButton'), action: () => tour.back(), classes: 'border border-gray-300 text-gray-700' },
            { text: t('admin.tour.nextButton'), action: () => tour.next(), classes: 'bg-blue-500 text-white' },
        ],
    });

    tour.addStep({
        id: 'submenu-tree-types',
        title: `${t('admin.tour.submenuTreeTypes.title')} <div class="shepherd-progress"></div>`,
        text: t('admin.tour.submenuTreeTypes.text'),
        attachTo: { element: 'a[href="/admin/settings/tree-types"]', on: 'bottom' },
        buttons: [
            { text: t('admin.tour.previousButton'), action: () => tour.back(), classes: 'border border-gray-300 text-gray-700' },
            { text: t('admin.tour.nextButton'), action: () => tour.next(), classes: 'bg-blue-500 text-white' },
        ],
    });

    tour.addStep({
        id: 'submenu-task-types',
        title: `${t('admin.tour.submenuTaskTypes.title')} <div class="shepherd-progress"></div>`,
        text: t('admin.tour.submenuTaskTypes.text'),
        attachTo: { element: 'a[href="/admin/settings/task-types"]', on: 'bottom' },
        buttons: [
            { text: t('admin.tour.previousButton'), action: () => tour.back(), classes: 'border border-gray-300 text-gray-700' },
            { text: t('admin.tour.nextButton'), action: () => tour.next(), classes: 'bg-blue-500 text-white' },
        ],
    });

    tour.addStep({
        id: 'submenu-resource-types',
        title: `${t('admin.tour.submenuResourceTypes.title')} <div class="shepherd-progress"></div>`,
        text: t('admin.tour.submenuResourceTypes.text'),
        attachTo: { element: 'a[href="/admin/settings/resource-types"]', on: 'bottom' },
        buttons: [
            { text: t('admin.tour.previousButton'), action: () => tour.back(), classes: 'border border-gray-300 text-gray-700' },
            { text: t('admin.tour.nextButton'), action: () => tour.next(), classes: 'bg-blue-500 text-white' },
        ],
    });

    tour.addStep({
        id: 'submenu-users',
        title: `${t('admin.tour.submenuUsers.title')} <div class="shepherd-progress"></div>`,
        text: t('admin.tour.submenuUsers.text'),
        attachTo: { element: 'a[href="/admin/settings/users"]', on: 'bottom' },
        buttons: [
            { text: t('admin.tour.previousButton'), action: () => tour.back(), classes: 'border border-gray-300 text-gray-700' },
            { text: t('admin.tour.nextButton'), action: () => tour.next(), classes: 'bg-blue-500 text-white' },
        ],
    });

    tour.addStep({
        id: 'menu-dashboard',
        title: `${t('admin.tour.menuDashboard.title')} <div class="shepherd-progress"></div>`,
        text: t('admin.tour.menuDashboard.text'),
        attachTo: { element: '.submenu-dashboard', on: 'bottom' },
        beforeShowPromise: () => {
            navigate('/admin/dashboard');
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(true);
                }, 1000);
            });
        },
        buttons: [
            { text: t('admin.tour.previousButton'), action: () => tour.back(), classes: 'border border-gray-300 text-gray-700' },
            { text: t('admin.tour.nextButton'), action: () => tour.next(), classes: 'bg-blue-500 text-white' },
        ],
    });

    tour.addStep({
        id: 'submenu-eva',
        title: `${t('admin.tour.submenuEva.title')} <div class="shepherd-progress"></div>`,
        text: t('admin.tour.submenuEva.text'),
        attachTo: { element: 'a[href="/admin/evas"]', on: 'bottom' },
        buttons: [
            { text: t('admin.tour.previousButton'), action: () => tour.back(), classes: 'border border-gray-300 text-gray-700' },
            { text: t('admin.tour.nextButton'), action: () => tour.next(), classes: 'bg-blue-500 text-white' },
        ],
    });

    tour.addStep({
        id: 'submenu-work-orders',
        title: `${t('admin.tour.submenuWorkOrders.title')} <div class="shepherd-progress"></div>`,
        text: t('admin.tour.submenuWorkOrders.text'),
        attachTo: { element: 'a[href="/admin/work-orders"]', on: 'bottom' },
        buttons: [
            { text: t('admin.tour.previousButton'), action: () => tour.back(), classes: 'border border-gray-300 text-gray-700' },
            { text: t('admin.tour.nextButton'), action: () => tour.next(), classes: 'bg-blue-500 text-white' },
        ],
    });

    tour.addStep({
        id: 'submenu-workers',
        title: `${t('admin.tour.submenuWorkers.title')} <div class="shepherd-progress"></div>`,
        text: t('admin.tour.submenuWorkers.text'),
        attachTo: { element: 'a[href="/admin/workers"]', on: 'bottom' },
        buttons: [
            { text: t('admin.tour.previousButton'), action: () => tour.back(), classes: 'border border-gray-300 text-gray-700' },
            { text: t('admin.tour.nextButton'), action: () => tour.next(), classes: 'bg-blue-500 text-white' },
        ],
    });

    tour.addStep({
        id: 'submenu-resources',
        title: `${t('admin.tour.submenuResources.title')} <div class="shepherd-progress"></div>`,
        text: t('admin.tour.submenuResources.text'),
        attachTo: { element: 'a[href="/admin/resources"]', on: 'bottom' },
        buttons: [
            { text: t('admin.tour.previousButton'), action: () => tour.back(), classes: 'border border-gray-300 text-gray-700' },
            { text: t('admin.tour.nextButton'), action: () => tour.next(), classes: 'bg-blue-500 text-white' },
        ],
    });

    tour.addStep({
        id: 'submenu-stats',
        title: `${t('admin.tour.submenuStats.title')} <div class="shepherd-progress"></div>`,
        text: t('admin.tour.submenuStats.text'),
        attachTo: { element: 'a[href="/admin/statistics"]', on: 'bottom' },
        buttons: [
            { text: t('admin.tour.previousButton'), action: () => tour.back(), classes: 'border border-gray-300 text-gray-700' },
            { text: t('admin.tour.nextButton'), action: () => tour.next(), classes: 'bg-blue-500 text-white' },
        ],
    });
    
    tour.addStep({
        id: 'submenu-sensors',
        title: `${t('admin.tour.submenuSensors.title')} <div class="shepherd-progress"></div>`,
        text: t('admin.tour.submenuSensors.text'),
        attachTo: { element: 'a[href="/admin/sensors"]', on: 'bottom' },
        buttons: [
            { text: t('admin.tour.previousButton'), action: () => tour.back(), classes: 'border border-gray-300 text-gray-700' },
            { text: t('admin.tour.nextButton'), action: () => tour.next(), classes: 'bg-blue-500 text-white' },
        ],
    });
    tour.addStep({
        id: 'menu-inventory',
        title: `${t('admin.tour.menuInventory.title')} <div class="shepherd-progress"></div>`,
        text: t('admin.tour.menuInventory.text'),
        attachTo: { element: 'a[href="/admin/inventory"]', on: 'bottom' },
        beforeShowPromise: () => {
            navigate('/admin/inventory');
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(true);
                }, 1000);
            });
        },
        buttons: [
            { text: t('admin.tour.previousButton'), action: () => tour.back(), classes: 'border border-gray-300 text-gray-700' },
            { text: t('admin.tour.nextButton'), action: () => tour.next(), classes: 'bg-blue-500 text-white' },
        ],
    });

    // Map-related steps from startMapTour
    tour.addStep({
        id: 'scale-control',
        title: `${t('admin.tour.scaleControl.title')} <div class="shepherd-progress"></div>`,
        text: t('admin.tour.scaleControl.text'),
        attachTo: { element: '.map-control-scale', on: 'top' },
        buttons: [
            { text: t('admin.tour.previousButton'), action: () => tour.back(), classes: 'border border-gray-300 text-gray-700' },
            { text: t('admin.tour.nextButton'), action: () => tour.next(), classes: 'bg-blue-500 text-white' },
        ],
    });

    tour.addStep({
        id: 'fullscreen-control',
        title: `${t('admin.tour.fullscreenControl.title')} <div class="shepherd-progress"></div>`,
        text: t('admin.tour.fullscreenControl.text'),
        attachTo: { element: '.map-control-fullscreen', on: 'left' },
        buttons: [
            { text: t('admin.tour.previousButton'), action: () => tour.back(), classes: 'border border-gray-300 text-gray-700' },
            { text: t('admin.tour.nextButton'), action: () => tour.next(), classes: 'bg-blue-500 text-white' },
        ],
    });

    tour.addStep({
        id: 'geolocate-control',
        title: `${t('admin.tour.geolocateControl.title')} <div class="shepherd-progress"></div>`,
        text: t('admin.tour.geolocateControl.text'),
        attachTo: { element: '.map-control-geolocate', on: 'left' },
        buttons: [
            { text: t('admin.tour.previousButton'), action: () => tour.back(), classes: 'border border-gray-300 text-gray-700' },
            { text: t('admin.tour.nextButton'), action: () => tour.next(), classes: 'bg-blue-500 text-white' },
        ],
    });

    tour.addStep({
        id: 'add-points-button',
        title: `${t('admin.tour.addPointsButton.title')} <div class="shepherd-progress"></div>`,
        text: t('admin.tour.addPointsButton.text'),
        attachTo: { element: '.mapbox-gl-draw_polygon', on: 'bottom' },
        buttons: [
            { text: t('admin.tour.previousButton'), action: () => tour.back(), classes: 'border border-gray-300 text-gray-700' },
            { text: t('admin.tour.nextButton'), action: () => tour.next(), classes: 'bg-blue-500 text-white' },
        ],
    });

    tour.addStep({
        id: 'cancel-creation-button',
        title: `${t('admin.tour.cancelCreationButton.title')} <div class="shepherd-progress"></div>`,
        text: t('admin.tour.cancelCreationButton.text'),
        attachTo: { element: '.mapbox-gl-draw_trash', on: 'bottom' },
        buttons: [
            { text: t('admin.tour.previousButton'), action: () => tour.back(), classes: 'border border-gray-300 text-gray-700' },
            { text: t('admin.tour.nextButton'), action: () => tour.next(), classes: 'bg-blue-500 text-white' },
        ],
    });

    // Custom buttons
    tour.addStep({
        id: 'custom-button-1',
        title: `${t('admin.tour.customButton1.title')} <div class="shepherd-progress"></div>`,
        text: t('admin.tour.customButton1.text'),
        attachTo: { element: '.p-button-outlined.p-button-indigo.p-button-sm.p-button-icon-only:nth-of-type(1)', on: 'bottom' },
        buttons: [
            { text: t('admin.tour.previousButton'), action: () => tour.back(), classes: 'border border-gray-300 text-gray-700' },
            { text: t('admin.tour.nextButton'), action: () => tour.next(), classes: 'bg-blue-500 text-white' },
        ],
    });

    tour.addStep({
        id: 'custom-button-2',
        title: `${t('admin.tour.customButton2.title')} <div class="shepherd-progress"></div>`,
        text: t('admin.tour.customButton2.text'),
        attachTo: { element: '.p-button-outlined.p-button-indigo.p-button-sm.p-button-icon-only:nth-of-type(2)', on: 'bottom' },
        buttons: [
            { text: t('admin.tour.previousButton'), action: () => tour.back(), classes: 'border border-gray-300 text-gray-700' },
            { text: t('admin.tour.nextButton'), action: () => tour.next(), classes: 'bg-blue-500 text-white' },
        ],
    });

    tour.addStep({
        id: 'custom-button-3',
        title: `${t('admin.tour.customButton3.title')} <div class="shepherd-progress"></div>`,
        text: t('admin.tour.customButton3.text'),
        attachTo: { element: '.p-button-outlined.p-button-indigo.p-button-sm.p-button-icon-only:nth-of-type(3)', on: 'bottom' },
        buttons: [
            { text: t('admin.tour.previousButton'), action: () => tour.back(), classes: 'border border-gray-300 text-gray-700' },
            { text: t('admin.tour.nextButton'), action: () => tour.next(), classes: 'bg-blue-500 text-white' },
        ],
    });

    tour.addStep({
        id: 'custom-button-4',
        title: `${t('admin.tour.customButton4.title')} <div class="shepherd-progress"></div>`,
        text: t('admin.tour.customButton4.text'),
        attachTo: { element: '.p-button-outlined.p-button-indigo.p-button-sm.p-button-icon-only:nth-of-type(4)', on: 'bottom' },
        buttons: [
            { text: t('admin.tour.previousButton'), action: () => tour.back(), classes: 'border border-gray-300 text-gray-700' },
            { text: t('admin.tour.nextButton'), action: () => tour.next(), classes: 'bg-blue-500 text-white' },
        ],
    });

    tour.addStep({
        id: 'add-element-button',
        title: `${t('admin.tour.addElementButton.title')} <div class="shepherd-progress"></div>`,
        text: t('admin.tour.addElementButton.text'),
        attachTo: { element: '.p-button-outlined.p-button-indigo.p-button-sm.p-button.p-component[aria-label="Afegeix element"]', on: 'bottom' },
        buttons: [
            { text: t('admin.tour.previousButton'), action: () => tour.back(), classes: 'border border-gray-300 text-gray-700' },
            { text: t('admin.tour.finishButton'), action: () => tour.next(), classes: 'bg-blue-500 text-white' },
        ],
    });

    function updateProgressBar(tour: any) {
        const currentStep = tour.getCurrentStep();
        if (!currentStep) return;
        
        const totalSteps = tour.steps.length;
        const currentStepIndex = tour.steps.indexOf(currentStep);
        const progressPercentage = ((currentStepIndex + 1) / totalSteps) * 100;
        
        let progressBar = currentStep.el.querySelector('.shepherd-progress-bar');
        const progressContainer = currentStep.el.querySelector('.shepherd-progress');
        
        if (progressContainer) {
            if (!progressBar) {
                progressBar = document.createElement('div');
                progressBar.className = 'shepherd-progress-bar';
                progressContainer.innerHTML = '';
                progressContainer.appendChild(progressBar);
                
                const progressText = document.createElement('div');
                progressText.className = 'shepherd-progress-text';
                progressContainer.appendChild(progressText);
            }
            
            progressBar.style.width = `${progressPercentage}%`;
            
            const progressText = progressContainer.querySelector('.shepherd-progress-text');
            if (progressText) {
                progressText.textContent = `${currentStepIndex + 1}/${totalSteps}`;
            }
        }
    }

    const style = document.createElement('style');
    style.textContent = `
        .shepherd-theme-minimal .shepherd-header {
            padding: 1rem 1rem 0;
            border: none;
            position: relative;
        }
        .shepherd-theme-minimal .shepherd-title {
            font-size: 1rem;
            font-weight: 600;
            color: #4f46e5; /* Match layout's primary color */
            display: flex;
            justify-content: space-between;
            align-items: center.
        }
        .shepherd-theme-minimal .shepherd-text {
            color: #374151; /* Neutral gray for readability */
            font-size: 0.9rem;
            padding: 1rem;
        }
        .shepherd-theme-minimal .shepherd-footer {
            padding: 0.75rem 1rem 1rem;
        }
        .minimal-highlight {
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
            border-radius: 0.25rem;
        }
        .shepherd-theme-minimal .shepherd-cancel-icon {
            font-size: 1.25rem;
        }
        
        .shepherd-progress {
            width: 60px;
            height: 20px;
            background: #e5e7eb; /* Light gray background */
            border-radius: 10px;
            overflow: hidden;
            position: relative;
            display: inline-block;
            margin-left: 10px;
        }
        .shepherd-progress-bar {
            height: 100%;
            background: #059669; /* Match layout's primary color */
            transition: width 0.3s ease;
        }
        .shepherd-progress-text {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 0.7rem;
            color: #fff;
            font-weight: bold;
            text-shadow: 0 0 1px rgba(0,0,0,0.5);
        }
        .shepherd-button {
            border-radius: 9999px; /* Fully rounded buttons */
            padding: 0.5rem 1rem;
            font-size: 0.875rem;
            font-weight: 500;
        }
        .shepherd-button:hover {
            opacity: 0.9;
        }
        .shepherd-button.bg-blue-500 {
            background-color: #4f46e5; /* Match layout's primary color */
            color: #fff;
        }
        .shepherd-button.bg-blue-500:hover {
            background-color: #4338ca; /* Darker shade for hover */
        }
        .shepherd-button.border-gray-300 {
            background-color: #4f46e5; /* Match layout's primary color */
            color: #fff;
            border: none;
        }
        .shepherd-button.border-gray-300:hover {
            background-color: #4338ca; /* Darker shade for hover */
        }
    `;
    document.head.appendChild(style);

    tour.start();
};

export default startTour;