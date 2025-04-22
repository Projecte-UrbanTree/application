import Shepherd from 'shepherd.js';

const startMapTour = () => {
    const tour = new Shepherd.Tour({
        defaultStepOptions: {
            cancelIcon: { enabled: true, label: '×' },
            classes: 'shepherd-theme-minimal bg-white border border-gray-200',
            scrollTo: { behavior: 'smooth', block: 'center' },
            arrow: true,
        },
        useModalOverlay: true,
        tourName: 'Tour de Botones Básicos del Mapa',
    });

    tour.addStep({
        id: 'scale-control',
        title: 'Control de Escala',
        text: 'Este control muestra la escala del mapa.',
        attachTo: { element: '.map-control-scale', on: 'top' },
        buttons: [
            { text: 'Anterior', action: tour.back, classes: 'bg-gray-200 text-gray-700 rounded px-4 py-2' },
            { text: 'Siguiente', action: tour.next, classes: 'bg-blue-500 text-white rounded px-4 py-2' },
        ],
    });

    tour.addStep({
        id: 'fullscreen-control',
        title: 'Control de Pantalla Completa',
        text: 'Haz clic aquí para alternar el modo de pantalla completa.',
        attachTo: { element: '.map-control-fullscreen', on: 'left' },
        buttons: [
            { text: 'Anterior', action: tour.back, classes: 'bg-gray-200 text-gray-700 rounded px-4 py-2' },
            { text: 'Siguiente', action: tour.next, classes: 'bg-blue-500 text-white rounded px-4 py-2' },
        ],
    });

    tour.addStep({
        id: 'geolocate-control',
        title: 'Control de Geolocalización',
        text: 'Haz clic aquí para centrar el mapa en tu ubicación actual.',
        attachTo: { element: '.map-control-geolocate', on: 'left' },
        buttons: [
            { text: 'Anterior', action: tour.back, classes: 'bg-gray-200 text-gray-700 rounded px-4 py-2' },
            { text: 'Siguiente', action: tour.next, classes: 'bg-blue-500 text-white rounded px-4 py-2' },
        ],
    });

    // Step for "Agregar Puntos para las Zonas" button
    tour.addStep({
        id: 'add-points-button',
        title: 'Agregar Puntos para las Zonas',
        text: 'Haz clic en este botón para comenzar a agregar puntos para una nueva zona.',
        attachTo: { element: '.mapbox-gl-draw_polygon', on: 'bottom' },
        buttons: [
            { text: 'Siguiente', action: tour.next, classes: 'bg-blue-500 text-white rounded px-4 py-2' },
        ],
    });

    // Step for "Cancelar Creación" button
    tour.addStep({
        id: 'cancel-creation-button',
        title: 'Cancelar Creación',
        text: 'Haz clic en este botón para cancelar la creación de puntos para la zona.',
        attachTo: { element: '.mapbox-gl-draw_trash', on: 'bottom' },
        buttons: [
            { text: 'Anterior', action: tour.back, classes: 'bg-gray-200 text-gray-700 rounded px-4 py-2' },
            { text: 'Siguiente', action: tour.next, classes: 'bg-green-500 text-white rounded px-4 py-2' },
        ],
    });

    tour.addStep({
        id: 'custom-button-1',
        title: 'Botón Personalizado 1 <div class="shepherd-progress"></div>',
        text: 'Este es el primer botón personalizado.',
        attachTo: { element: '.p-button-outlined.p-button-indigo.p-button-sm.p-button-icon-only:nth-of-type(1)', on: 'bottom' },
        buttons: [
            { text: 'Anterior', action: tour.back, classes: 'border border-gray-300 text-gray-700' },
            { text: 'Siguiente', action: tour.next, classes: 'bg-blue-500 text-white' },
        ],
    });

    tour.addStep({
        id: 'custom-button-2',
        title: 'Botón Personalizado 2 <div class="shepherd-progress"></div>',
        text: 'Este es el segundo botón personalizado.',
        attachTo: { element: '.p-button-outlined.p-button-indigo.p-button-sm.p-button-icon-only:nth-of-type(2)', on: 'bottom' },
        buttons: [
            { text: 'Anterior', action: tour.back, classes: 'border border-gray-300 text-gray-700' },
            { text: 'Siguiente', action: tour.next, classes: 'bg-blue-500 text-white' },
        ],
    });
    
    tour.addStep({
        id: 'custom-button-3',
        title: 'Botón Personalizado 3 <div class="shepherd-progress"></div>',
        text: 'Este es el tercer botón personalizado.',
        attachTo: { element: '.p-button-outlined.p-button-indigo.p-button-sm.p-button-icon-only:nth-of-type(3)', on: 'bottom' },
        buttons: [
            { text: 'Anterior', action: tour.back, classes: 'border border-gray-300 text-gray-700' },
            { text: 'Siguiente', action: tour.next, classes: 'bg-blue-500 text-white' },
        ],
    });

    tour.addStep({
        id: 'custom-button-4',
        title: 'Botón Personalizado 4 <div class="shepherd-progress"></div>',
        text: 'Este es el cuarto botón personalizado.',
        attachTo: { element: '.p-button-outlined.p-button-indigo.p-button-sm.p-button-icon-only:nth-of-type(4)', on: 'bottom' },
        buttons: [
            { text: 'Anterior', action: tour.back, classes: 'border border-gray-300 text-gray-700' },
            { text: 'Siguiente', action: tour.next, classes: 'bg-blue-500 text-white' },
        ],
    });

    tour.addStep({
        id: 'add-element-button',
        title: 'Botón: Afegeix Element <div class="shepherd-progress"></div>',
        text: 'Haz clic en este botón para añadir un nuevo elemento.',
        attachTo: { element: '.p-button-outlined.p-button-indigo.p-button-sm.p-button.p-component[aria-label="Afegeix element"]', on: 'bottom' },
        buttons: [
            { text: 'Anterior', action: tour.back, classes: 'border border-gray-300 text-gray-700' },
            { text: 'Siguiente', action: tour.next, classes: 'bg-blue-500 text-white' },
        ],
    });

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
    `;
    document.head.appendChild(style);

    tour.start();
};

export default startMapTour;
