<?php

return [
    'copaDesequilibrada' => [
        ['label' => 'No hay inclinación ni crecimiento desigual', 'value' => 0],
        ['label' => 'Leve inclinación de copa', 'value' => 1],
        ['label' => 'Copa visiblemente inclinada', 'value' => 2],
        ['label' => 'Copa extremadamente inclinada', 'value' => 3],
    ],
    'ramasSobreextendidas' => [
        ['label' => 'Ramas bien estructuradas', 'value' => 0],
        ['label' => 'Pocas ramas sobreextendidas', 'value' => 1],
        ['label' => 'Varias ramas sobreextendidas', 'value' => 2],
        ['label' => 'Ramas sobreextendidas y pesadas', 'value' => 3],
    ],
    'grietas' => [
        ['label' => 'No hay grietas', 'value' => 0],
        ['label' => 'Pequeñas grietas en el tronco', 'value' => 1],
        ['label' => 'Grietas visibles en varias partes', 'value' => 2],
        ['label' => 'Grietas profundas en el tronco', 'value' => 3],
    ],
    'ramasMuertas' => [
        ['label' => 'Sin ramas muertas', 'value' => 0],
        ['label' => 'Algunas ramas muertas', 'value' => 1],
        ['label' => 'Múltiples ramas muertas', 'value' => 2],
        ['label' => 'Gran cantidad de ramas muertas', 'value' => 3],
    ],
    'inclinacion' => [
        ['label' => 'Totalmente vertical', 'value' => 0],
        ['label' => 'Inclinación leve (<5°)', 'value' => 1],
        ['label' => 'Inclinación moderada (5-15°)', 'value' => 2],
        ['label' => 'Inclinación alta (>15°)', 'value' => 3],
    ],
    'bifurcacionesV' => [
        ['label' => 'Bifurcaciones normales', 'value' => 0],
        ['label' => 'Bifurcación en V leve', 'value' => 1],
        ['label' => 'Bifurcación en V pronunciada', 'value' => 2],
        ['label' => 'Bifurcación en V peligrosa', 'value' => 3],
    ],
    'cavidades' => [
        ['label' => 'Sin cavidades', 'value' => 0],
        ['label' => 'Cavidad pequeña', 'value' => 1],
        ['label' => 'Cavidad intermedia', 'value' => 2],
        ['label' => 'Cavidad profunda y estructural', 'value' => 3],
    ],
    'danosCorteza' => [
        ['label' => 'Corteza intacta', 'value' => 0],
        ['label' => 'Corteza con heridas leves', 'value' => 1],
        ['label' => 'Daños significativos en la corteza', 'value' => 2],
        ['label' => 'Corteza muy dañada', 'value' => 3],
    ],
    'levantamientoSuelo' => [
        ['label' => 'Suelo sin alteraciones', 'value' => 0],
        ['label' => 'Ligera elevación del suelo', 'value' => 1],
        ['label' => 'Elevación del suelo visible', 'value' => 2],
        ['label' => 'Suelo severamente levantado', 'value' => 3],
    ],
    'raicesCortadas' => [
        ['label' => 'Raíces intactas', 'value' => 0],
        ['label' => 'Raíces con cortes leves', 'value' => 1],
        ['label' => 'Raíces parcialmente dañadas', 'value' => 2],
        ['label' => 'Raíces severamente cortadas', 'value' => 3],
    ],
    'podredumbreBasal' => [
        ['label' => 'Sin podredumbre', 'value' => 0],
        ['label' => 'Podredumbre inicial', 'value' => 1],
        ['label' => 'Podredumbre visible', 'value' => 2],
        ['label' => 'Podredumbre avanzada', 'value' => 3],
    ],
    'raicesExpuestas' => [
        ['label' => 'Raíces bajo tierra', 'value' => 0],
        ['label' => 'Algunas raíces expuestas', 'value' => 1],
        ['label' => 'Varias raíces expuestas', 'value' => 2],
        ['label' => 'Raíces expuestas y debilitadas', 'value' => 3],
    ],
    'viento' => [
        ['label' => 'Árbol protegido por barreras naturales o edificios, sin viento fuerte constante.', 'value' => 0],
        ['label' => 'Árbol con viento ocasional pero sin impacto significativo en su estabilidad.', 'value' => 1],
        ['label' => 'Árbol expuesto a vientos fuertes frecuentes, lo que puede afectar su estructura.', 'value' => 2],
        ['label' => 'Árbol en zonas abiertas o en pendientes donde el viento sopla con fuerza extrema.', 'value' => 3],
    ],
    'sequia' => [
        ['label' => 'Árbol en zona con humedad estable y acceso a agua constante, sin estrés hídrico.', 'value' => 0],
        ['label' => 'Árbol con acceso moderado al agua, pero con períodos de sequía ocasionales.', 'value' => 1],
        ['label' => 'Árbol en zona con sequías recurrentes, afectando su desarrollo y resistencia.', 'value' => 2],
        ['label' => 'Árbol en zona árida o con sequías prolongadas, alto riesgo de debilitamiento.', 'value' => 3],
    ],
];
