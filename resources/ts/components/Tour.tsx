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
            { text: t('admin.tour.previousButton'), action: () => tour.back(), classes: 'border border-gray-300 text-gray-700' },
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
            { text: t('general.cancel'), action: () => tour.back(), classes: 'border border-gray-300 text-gray-700' },
            { text: t('general.success'), action: () => tour.next(), classes: 'bg-blue-500 text-white' },
        ],
    });

    tour.addStep({
        id: 'contract-dropdown',
        title: `${t('admin.tour.contractDropdown.title')} <div class="shepherd-progress"></div>`,
        text: t('admin.tour.contractDropdown.text'),
        attachTo: { element: '#contractBtn', on: 'bottom' },
        buttons: [
            { text: t('general.cancel'), action: () => tour.back(), classes: 'border border-gray-300 text-gray-700' },
            { text: t('general.success'), action: () => tour.next(), classes: 'bg-blue-500 text-white' },
        ],
    });

    tour.addStep({
        id: 'language-selector',
        title: `${t('admin.tour.languageSelector.title')} <div class="shepherd-progress"></div>`,
        text: t('admin.tour.languageSelector.text'),
        attachTo: { element: '.lang-selector', on: 'bottom' },
        buttons: [
            { text: t('general.cancel'), action: () => tour.back(), classes: 'border border-gray-300 text-gray-700' },
            { text: t('general.success'), action: () => tour.next(), classes: 'bg-green-500 text-white' },
        ],
    });

    tour.addStep({
        id: 'avatar',
        title: `${t('admin.tour.avatar.title')} <div class="shepherd-progress"></div>`,
        text: t('admin.tour.avatar.text'),
        attachTo: { element: '.p-avatar', on: 'left' },
        buttons: [
            { text: t('general.cancel'), action: () => tour.back(), classes: 'border border-gray-300 text-gray-700' },
            { text: t('general.success'), action: () => tour.next(), classes: 'bg-blue-500 text-white' },
        ],
    });
    tour.addStep({
        id: 'menu-settings',
        title: 'Configuración <div class="shepherd-progress"></div>',
        text: 'Accede a las configuraciones generales de la aplicación para crear y gestionar los contratos más fácilmente.',
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
            {
                text: 'Anterior',
                action: tour.back,
                classes: 'border border-gray-300 text-gray-700',
            },
            {
                text: 'Siguiente',
                action: () => {
                    tour.next();
                },
                classes: 'bg-blue-500 text-white',
            },
        ],
    });
    tour.addStep({
        id: 'submenu-element-types',
        title: 'Submenú: Tipos de Elementos <div class="shepherd-progress"></div>',
        text: 'Administra los tipos de elementos disponibles.',
        attachTo: { element: 'a[href="/admin/settings/element-types"]', on: 'bottom' },
        buttons: [
            { text: 'Anterior', action: tour.back, classes: 'border border-gray-300 text-gray-700' },
            { text: 'Siguiente', action: tour.next, classes: 'bg-blue-500 text-white' },
        ],
    });

    tour.addStep({
        id: 'submenu-tree-types',
        title: 'Submenú: Especies <div class="shepherd-progress"></div>',
        text: 'Gestiona las especies de árboles disponibles.',
        attachTo: { element: 'a[href="/admin/settings/tree-types"]', on: 'bottom' },
        buttons: [
            { text: 'Anterior', action: tour.back, classes: 'border border-gray-300 text-gray-700' },
            { text: 'Siguiente', action: tour.next, classes: 'bg-blue-500 text-white' },
        ],
    });

    tour.addStep({
        id: 'submenu-task-types',
        title: 'Submenú: Tipos de Tareas <div class="shepherd-progress"></div>',
        text: 'Administra los tipos de tareas configurables.',
        attachTo: { element: 'a[href="/admin/settings/task-types"]', on: 'bottom' },
        buttons: [
            { text: 'Anterior', action: tour.back, classes: 'border border-gray-300 text-gray-700' },
            { text: 'Siguiente', action: tour.next, classes: 'bg-blue-500 text-white' },
        ],
    });

    tour.addStep({
        id: 'submenu-resource-types',
        title: 'Submenú: Tipos de Recursos <div class="shepherd-progress"></div>',
        text: 'Gestiona los tipos de recursos disponibles.',
        attachTo: { element: 'a[href="/admin/settings/resource-types"]', on: 'bottom' },
        buttons: [
            { text: 'Anterior', action: tour.back, classes: 'border border-gray-300 text-gray-700' },
            { text: 'Siguiente', action: tour.next, classes: 'bg-blue-500 text-white' },
        ],
    });

    tour.addStep({
        id: 'submenu-users',
        title: 'Submenú: Usuarios <div class="shepherd-progress"></div>',
        text: 'Administra los usuarios registrados en la plataforma.',
        attachTo: { element: 'a[href="/admin/settings/users"]', on: 'bottom' },
        buttons: [
            { text: 'Anterior', action: tour.back, classes: 'border border-gray-300 text-gray-700' },
            { text: 'Siguiente', action: tour.next, classes: 'bg-green-500 text-white' },
        ],
    });
        tour.addStep({
        id: 'menu-dashboard',
        title: 'Gestión <div class="shepherd-progress"></div>',
        text: 'Panel donde podrás gestionar la información del contrato en el que estés.',
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
            { text: 'Anterior', action: () => {
                tour.back();
                }, 
                classes: 'border border-gray-300 text-gray-700' },
            {     
                text: 'Siguiente',
                action: () => {
                    tour.next();
                },
                classes: 'bg-blue-500 text-white',
            },
        ],
    });
    tour.addStep({
        id: 'submenu-eva',
        title: 'Submenú: EVA <div class="shepherd-progress"></div>',
        text: 'Consulta y analiza los datos del EVA de cada arból en formato listado.',
        attachTo: { element: 'a[href="/admin/evas"]', on: 'bottom' },
        buttons: [
            { text: 'Anterior', action: tour.back, classes: 'border border-gray-300 text-gray-700' },
            { text: 'Siguiente', action: tour.next, classes: 'bg-blue-500 text-white' },
        ],
    });

    tour.addStep({
        id: 'submenu-work-orders',
        title: 'Submenú: Órdenes de trabajo <div class="shepherd-progress"></div>',
        text: 'Lugar donde se crearan las ordenes de trabajo del dia.',
        attachTo: { element: 'a[href="/admin/work-orders"]', on: 'bottom' },
        buttons: [
            { text: 'Anterior', action: tour.back, classes: 'border border-gray-300 text-gray-700' },
            { text: 'Siguiente', action: tour.next, classes: 'bg-blue-500 text-white' },
        ],
    });

    tour.addStep({
        id: 'submenu-workers',
        title: 'Submenú: Trabajadores <div class="shepherd-progress"></div>',
        text: 'Lugar donde assignaremos a los usuarios en que contrato queremos que trabajen.',
        attachTo: { element: 'a[href="/admin/workers"]', on: 'bottom' },
        buttons: [
            { text: 'Anterior', action: tour.back, classes: 'border border-gray-300 text-gray-700' },
            {
                text: 'Siguiente',
                action: () => {
                    tour.next();
                },
                classes: 'bg-blue-500 text-white',
            },
        ],
    });

    tour.addStep({
        id: 'submenu-resources',
        title: 'Submenú: Recursos <div class="shepherd-progress"></div>',
        text: 'Gestiona los recursos disponibles en el contrato.',
        attachTo: { element: 'a[href="/admin/resources"]', on: 'bottom' },
        buttons: [
            { text: 'Anterior', action: tour.back, classes: 'border border-gray-300 text-gray-700' },
            {
                text: 'Siguiente',
                action: tour.next,
                classes: 'bg-blue-500 text-white',
            },
        ],
    });

    tour.addStep({
        id: 'submenu-stats',
        title: 'Submenú: Estadísticas <div class="shepherd-progress"></div>',
        text: 'Consulta las estadísticas y gráficos.',
        attachTo: { element: 'a[href="/admin/statistics"]', on: 'bottom' },
        buttons: [
            { text: 'Anterior', action: tour.back, classes: 'border border-gray-300 text-gray-700' },
            {
                text: 'Siguiente',
                action: tour.next,
                classes: 'bg-blue-500 text-white',
            },
        ],
    });
    
    tour.addStep({
        id: 'submenu-sensors',
        title: 'Submenú: Sensores <div class="shepherd-progress"></div>',
        text: 'Consulta los registros de actividad de los sensores.',
        attachTo: { element: 'a[href="/admin/sensors"]', on: 'bottom' },
        buttons: [
            { text: 'Anterior', action: tour.back, classes: 'border border-gray-300 text-gray-700' },
            {
                text: 'Siguiente',
                action: tour.next,
                classes: 'bg-blue-500 text-white',
            },
        ],
    });
    tour.addStep({
        id: 'menu-inventory',
        title: 'Inventario <div class="shepherd-progress"></div>',
        text: 'Consulta y gestiona los recursos disponibles en el inventario con la ayuda de un mapa.',
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
            {
                text: 'Anterior',
                action: ()=>{
                    tour.back();
                },
                classes: 'border border-gray-300 text-gray-700',
            },
            {
                text: 'Siguiente',
                action: () => {
                    tour.next();
                },
                classes: 'bg-blue-500 text-white',
            },
        ],
    });

    // Map-related steps from startMapTour
    tour.addStep({
        id: 'scale-control',
        title: 'Control de Escala <div class="shepherd-progress"></div>',
        text: 'Este control muestra la escala del mapa.',
        attachTo: { element: '.map-control-scale', on: 'top' },
        buttons: [
            { text: 'Anterior', action: tour.back, classes: 'bg-gray-200 text-gray-700 rounded px-4 py-2' },
            { text: 'Siguiente', action: tour.next, classes: 'bg-blue-500 text-white rounded px-4 py-2' },
        ],
    });

    tour.addStep({
        id: 'fullscreen-control',
        title: 'Control de Pantalla Completa <div class="shepherd-progress"></div>',
        text: 'Haz clic aquí para alternar el modo de pantalla completa.',
        attachTo: { element: '.map-control-fullscreen', on: 'left' },
        buttons: [
            { text: 'Anterior', action: tour.back, classes: 'bg-gray-200 text-gray-700 rounded px-4 py-2' },
            { text: 'Siguiente', action: tour.next, classes: 'bg-blue-500 text-white rounded px-4 py-2' },
        ],
    });

    tour.addStep({
        id: 'geolocate-control',
        title: 'Control de Geolocalización <div class="shepherd-progress"></div>',
        text: 'Haz clic aquí para centrar el mapa en tu ubicación actual.',
        attachTo: { element: '.map-control-geolocate', on: 'left' },
        buttons: [
            { text: 'Anterior', action: tour.back, classes: 'bg-gray-200 text-gray-700 rounded px-4 py-2' },
            { text: 'Siguiente', action: tour.next, classes: 'bg-blue-500 text-white rounded px-4 py-2' },
        ],
    });

    tour.addStep({
        id: 'add-points-button',
        title: 'Agregar Puntos para las Zonas <div class="shepherd-progress"></div>',
        text: 'Haz clic en este botón para comenzar a agregar puntos para una nueva zona.',
        attachTo: { element: '.mapbox-gl-draw_polygon', on: 'bottom' },
        buttons: [
            { text: 'Anterior', action: tour.back, classes: 'bg-gray-200 text-gray-700 rounded px-4 py-2' },
            { text: 'Siguiente', action: tour.next, classes: 'bg-blue-500 text-white rounded px-4 py-2' },
        ],
    });

    tour.addStep({
        id: 'cancel-creation-button',
        title: 'Cancelar Creación <div class="shepherd-progress"></div>',
        text: 'Haz clic en este botón para cancelar la creación de puntos para la zona.',
        attachTo: { element: '.mapbox-gl-draw_trash', on: 'bottom' },
        buttons: [
            { text: 'Anterior', action: tour.back, classes: 'bg-gray-200 text-gray-700 rounded px-4 py-2' },
            { text: 'Siguiente', action: tour.next, classes: 'bg-green-500 text-white rounded px-4 py-2' },
        ],
    });

    // Custom buttons
    for (let i = 1; i <= 4; i++) {
        tour.addStep({
            id: `custom-button-${i}`,
            title: `Botón Personalizado ${i} <div class="shepherd-progress"></div>`,
            text: `Este es el botón personalizado número ${i}.`,
            attachTo: { element: `.p-button-outlined.p-button-indigo.p-button-sm.p-button-icon-only:nth-of-type(${i})`, on: 'bottom' },
            buttons: [
                { text: 'Anterior', action: tour.back, classes: 'border border-gray-300 text-gray-700' },
                { text: 'Siguiente', action: tour.next, classes: 'bg-blue-500 text-white' },
            ],
        });
    }

    tour.addStep({
        id: 'add-element-button',
        title: 'Botón: Afegeix Element <div class="shepherd-progress"></div>',
        text: 'Haz clic en este botón para añadir un nuevo elemento.',
        attachTo: { element: '.p-button-outlined.p-button-indigo.p-button-sm.p-button.p-component[aria-label="Afegeix element"]', on: 'bottom' },
        buttons: [
            { text: 'Anterior', action: tour.back, classes: 'border border-gray-300 text-gray-700' },
            { text: 'Finalizar', action: tour.complete, classes: 'bg-blue-500 text-white' },
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
            color: #333;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .shepherd-theme-minimal .shepherd-text {
            color: #666;
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
            background: #e9ecef;
            border-radius: 10px;
            overflow: hidden;
            position: relative;
            display: inline-block;
            margin-left: 10px;
        }
        .shepherd-progress-bar {
            height: 100%;
            background: #008037;
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
    `;
    document.head.appendChild(style);

    tour.start();
};

export default startTour;