import Shepherd from 'shepherd.js';

const startTour = (navigate: (path: string) => void) => {
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
        id: 'menu-settings',
        title: 'Configuración <div class="shepherd-progress"></div>',
        text: 'Accede a las configuraciones generales de la aplicacion para crear i gestionar los contratos más fácil.',
        attachTo: { element: 'a[href="/admin/settings/contracts"]', on: 'bottom' },
        beforeShowPromise: () => {
            navigate('/admin/settings/contracts');
            return new Promise((resolve) => setTimeout(resolve, 500));
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
                    navigate('/admin/settings/contracts');
                    tour.next();
                },
                classes: 'bg-blue-500 text-white',
            },
        ],
    });

    tour.addStep({
        id: 'submenu-element-types',
        title: 'Submenú: Tipos de Elementos',
        text: 'Administra los tipos de elementos disponibles.',
        attachTo: { element: 'a[href="/admin/settings/element-types"]', on: 'bottom' },
        buttons: [
            { text: 'Anterior', action: tour.back, classes: 'border border-gray-300 text-gray-700' },
            { text: 'Siguiente', action: tour.next, classes: 'bg-blue-500 text-white' },
        ],
    });

    tour.addStep({
        id: 'submenu-tree-types',
        title: 'Submenú: Especies',
        text: 'Gestiona las especies de árboles disponibles.',
        attachTo: { element: 'a[href="/admin/settings/tree-types"]', on: 'bottom' },
        buttons: [
            { text: 'Anterior', action: tour.back, classes: 'border border-gray-300 text-gray-700' },
            { text: 'Siguiente', action: tour.next, classes: 'bg-blue-500 text-white' },
        ],
    });

    tour.addStep({
        id: 'submenu-task-types',
        title: 'Submenú: Tipos de Tareas',
        text: 'Administra los tipos de tareas configurables.',
        attachTo: { element: 'a[href="/admin/settings/task-types"]', on: 'bottom' },
        buttons: [
            { text: 'Anterior', action: tour.back, classes: 'border border-gray-300 text-gray-700' },
            { text: 'Siguiente', action: tour.next, classes: 'bg-blue-500 text-white' },
        ],
    });

    tour.addStep({
        id: 'submenu-resource-types',
        title: 'Submenú: Tipos de Recursos',
        text: 'Gestiona los tipos de recursos disponibles.',
        attachTo: { element: 'a[href="/admin/settings/resource-types"]', on: 'bottom' },
        buttons: [
            { text: 'Anterior', action: tour.back, classes: 'border border-gray-300 text-gray-700' },
            { text: 'Siguiente', action: tour.next, classes: 'bg-blue-500 text-white' },
        ],
    });

    tour.addStep({
        id: 'submenu-users',
        title: 'Submenú: Usuarios',
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
        text: 'Panel donde podrás gestionar la informacion del contrato el qual estes.',
        attachTo: { element: 'a[href="/admin/dashboard"]', on: 'bottom' },
        beforeShowPromise: () => {
            navigate('/admin/dashboard');
            return new Promise((resolve) => setTimeout(resolve, 500));
        },
        buttons: [
            { text: 'Anterior', action: () => {
                navigate('/admin/settings/contracts');
                tour.back();
                }, 
                classes: 'border border-gray-300 text-gray-700' },
            {     
                text: 'Siguiente',
                action: () => {
                    navigate('/admin/dashboard');
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
            return new Promise((resolve) => setTimeout(resolve, 500));
        },
        buttons: [
            {
                text: 'Anterior',
                action: ()=>{
                    navigate('/admin/dashboard');
                    tour.back();
                },
                classes: 'border border-gray-300 text-gray-700',
            },
            {
                text: 'Siguiente',
                action: () => {
                    navigate('/admin/inventory');
                    tour.next();
                },
                classes: 'bg-blue-500 text-white',
            },
        ],
    });

    tour.addStep({
        id: 'contract-dropdown',
        title: 'Selector de Contratos <div class="shepherd-progress"></div>',
        text: 'Selecciona un contrato para filtrar los datos mostrados en la aplicación.',
        attachTo: { element: '#contractBtn', on: 'bottom' },
        buttons: [
            { text: 'Anterior', action: tour.back, classes: 'border border-gray-300 text-gray-700' },
            { text: 'Siguiente', action: tour.next, classes: 'bg-blue-500 text-white' },
        ],
    });

    tour.addStep({
        id: 'language-selector',
        title: 'Selector de Idioma <div class="shepherd-progress"></div>',
        text: 'Cambia el idioma de la aplicación según tus preferencias.',
        attachTo: { element: '.lang-selector', on: 'bottom' },
        buttons: [
            { text: 'Anterior', action: tour.back, classes: 'border border-gray-300 text-gray-700' },
            { text: 'Siguiente', action: tour.next, classes: 'bg-green-500 text-white' },
        ],
    });

    tour.addStep({
        id: 'avatar',
        title: 'Avatar de Usuario <div class="shepherd-progress"></div>',
        text: 'Haz clic en tu avatar para acceder a las opciones de tu cuenta.',
        attachTo: { element: '.p-avatar', on: 'left' },
        buttons: [
            { text: 'Anterior', action: tour.back, classes: 'border border-gray-300 text-gray-700' },
            { text: 'Finalizar', action: tour.next, classes: 'bg-blue-500 text-white' },
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