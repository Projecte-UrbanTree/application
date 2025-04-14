import Shepherd from 'shepherd.js';

const startTour = () => {
    const tour = new Shepherd.Tour({
        defaultStepOptions: {
            cancelIcon: { enabled: true, label: '×' },
            classes: 'shepherd-theme-minimal bg-white border border-gray-200',
            scrollTo: { behavior: 'smooth', block: 'center' },
            arrow: true,
        },
        useModalOverlay: true,
        tourName: 'Guía específica',
    });

    // Menú principal
    tour.addStep({
        id: 'menu-dashboard',
        title: 'Dashboard',
        text: 'Accede al panel principal para ver un resumen de la plataforma.',
        attachTo: { element: 'a[href="/admin/dashboard"]', on: 'bottom' },
        buttons: [
            { text: 'Siguiente', action: tour.next, classes: 'bg-blue-500 text-white' },
        ],
    });

    tour.addStep({
        id: 'menu-inventory',
        title: 'Inventario',
        text: 'Consulta y gestiona los recursos disponibles en el inventario.',
        attachTo: { element: 'a[href="/admin/inventory"]', on: 'bottom' },
        buttons: [
            { text: 'Anterior', action: tour.back, classes: 'border border-gray-300 text-gray-700' },
            { text: 'Siguiente', action: tour.next, classes: 'bg-blue-500 text-white' },
        ],
    });

    tour.addStep({
        id: 'menu-settings',
        title: 'Configuración',
        text: 'Accede a las configuraciones generales de la plataforma.',
        attachTo: { element: 'a[href="/admin/settings/contracts"]', on: 'bottom' },
        buttons: [
            { text: 'Anterior', action: tour.back, classes: 'border border-gray-300 text-gray-700' },
            { text: 'Siguiente', action: tour.next, classes: 'bg-blue-500 text-white' },
        ],
    });
        // Dropdown de contratos
    tour.addStep({
        id: 'contract-dropdown',
        title: 'Selector de Contratos',
        text: 'Selecciona un contrato para filtrar los datos mostrados en la plataforma.',
        attachTo: { element: '#contractBtn', on: 'bottom' },
        buttons: [
            { text: 'Anterior', action: tour.back, classes: 'border border-gray-300 text-gray-700' },
            { text: 'Siguiente', action: tour.next, classes: 'bg-blue-500 text-white' },
        ],
    });

    // Selector de idioma
    tour.addStep({
        id: 'language-selector',
        title: 'Selector de Idioma',
        text: 'Cambia el idioma de la plataforma según tus preferencias.',
        attachTo: { element: '.lang-selector', on: 'bottom' },
        buttons: [
            { text: 'Anterior', action: tour.back, classes: 'border border-gray-300 text-gray-700' },
            { text: 'Siguiente', action: tour.next, classes: 'bg-green-500 text-white' },
        ],
    });

    // Avatar
    tour.addStep({
        id: 'avatar',
        title: 'Avatar de Usuario',
        text: 'Haz clic en tu avatar para acceder a las opciones de tu cuenta.',
        attachTo: { element: '.p-avatar', on: 'left' },
        buttons: [
            { text: 'Anterior', action: tour.back, classes: 'border border-gray-300 text-gray-700' },
            { text: 'Siguiente', action: tour.next, classes: 'bg-blue-500 text-white' },
        ],
    });

    // Submenú de inventario
    tour.addStep({
        id: 'submenu-eva',
        title: 'Submenú: EVA',
        text: 'Consulta y analiza los datos de EVA.',
        attachTo: { element: 'a[href="/admin/evas"]', on: 'bottom' },
        buttons: [
            { text: 'Anterior', action: tour.back, classes: 'border border-gray-300 text-gray-700' },
            { text: 'Siguiente', action: tour.next, classes: 'bg-blue-500 text-white' },
        ],
    });

    tour.addStep({
        id: 'submenu-work-orders',
        title: 'Submenú: Órdenes de trabajo',
        text: 'Gestiona las órdenes de trabajo asignadas.',
        attachTo: { element: 'a[href="/admin/work-orders"]', on: 'bottom' },
        buttons: [
            { text: 'Anterior', action: tour.back, classes: 'border border-gray-300 text-gray-700' },
            { text: 'Siguiente', action: tour.next, classes: 'bg-blue-500 text-white' },
        ],
    });

    tour.addStep({
        id: 'submenu-workers',
        title: 'Submenú: Trabajadores',
        text: 'Consulta y administra la información de los trabajadores.',
        attachTo: { element: 'a[href="/admin/workers"]', on: 'bottom' },
        buttons: [
            { text: 'Anterior', action: tour.back, classes: 'border border-gray-300 text-gray-700' },
            { text: 'Siguiente', action: tour.next, classes: 'bg-blue-500 text-white' },
        ],
    });

    // Submenú de recursos
    tour.addStep({
        id: 'submenu-resources',
        title: 'Submenú: Recursos',
        text: 'Gestiona los recursos disponibles en la plataforma.',
        attachTo: { element: 'a[href="/admin/resources"]', on: 'bottom' },
        buttons: [
            { text: 'Anterior', action: tour.back, classes: 'border border-gray-300 text-gray-700' },
            { text: 'Siguiente', action: tour.next, classes: 'bg-blue-500 text-white' },
        ],
    });

    // Submenú de estadísticas
    tour.addStep({
        id: 'submenu-stats',
        title: 'Submenú: Estadísticas',
        text: 'Consulta las estadísticas y gráficos de la plataforma.',
        attachTo: { element: 'a[href="/admin/statistics"]', on: 'bottom' },
        buttons: [
            { text: 'Anterior', action: tour.back, classes: 'border border-gray-300 text-gray-700' },
            { text: 'Siguiente', action: tour.next, classes: 'bg-blue-500 text-white' },
        ],
    });
    tour.addStep({
        id: 'submenu-sensors',
        title: 'Submenú: Sensores',
        text: 'Consulta los registros de actividad de los sensores.',
        attachTo: { element: 'a[href="/admin/sensors"]', on: 'bottom' },
        buttons: [
            { text: 'Anterior', action: tour.back, classes: 'border border-gray-300 text-gray-700' },
            { text: 'Siguiente', action: tour.next, classes: 'bg-blue-500 text-white' },
        ],
    });

    // Estilos personalizados
    const style = document.createElement('style');
    style.textContent = `
        .shepherd-theme-minimal .shepherd-header {
            padding: 1rem 1rem 0;
            border: none;
        }
        .shepherd-theme-minimal .shepherd-title {
            font-size: 1rem;
            font-weight: 600;
            color: #333;
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
    `;
    document.head.appendChild(style);

    tour.start();
};

export default startTour;