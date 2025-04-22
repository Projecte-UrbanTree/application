import Shepherd from 'shepherd.js';

const startMapTour = () => {
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
        tourName: 'Tour de Botones Básicos del Mapa',
    });

    tour.addStep({
        id: 'scale-control',
        title: 'Control de Escala <div class="shepherd-progress"></div>',
        text: 'Este control muestra la escala del mapa.',
        attachTo: { element: '.map-control-scale', on: 'top' },
        buttons: [
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
            { text: 'Finalizar', action: tour.complete, classes: 'bg-blue-500 text-white' },
        ],
    });

    function updateProgressBar(tour: Shepherd.Tour) {
        const currentStep = tour.getCurrentStep();
        if (!currentStep) return;
        
        const totalSteps = tour.steps.length;
        const currentStepIndex = tour.steps.indexOf(currentStep);
        const progressPercentage = ((currentStepIndex + 1) / totalSteps) * 100;
        
        const progressContainer = currentStep.el?.querySelector('.shepherd-progress');
        if (progressContainer) {
            let progressBar = progressContainer.querySelector('.shepherd-progress-bar');
            if (!progressBar) {
                progressBar = document.createElement('div');
                progressBar.className = 'shepherd-progress-bar';
                progressContainer.innerHTML = '';
                progressContainer.appendChild(progressBar);
                
                const progressText = document.createElement('div');
                progressText.className = 'shepherd-progress-text';
                progressContainer.appendChild(progressText);
            }
            
            (progressBar as HTMLElement).style.width = `${progressPercentage}%`;
            
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

export default startMapTour;