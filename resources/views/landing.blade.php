<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Urban Tree 5.0 - Gestión Integral de Espacios Verdes</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Font Awesome -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-gray-50">

  <header class="bg-gradient-to-r from-green-700 to-green-800 text-white text-center py-16 px-4">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl md:text-5xl font-bold mb-6 leading-tight">
        Urban Tree 5.0
      </h1>
      <p class="text-xl mb-8 opacity-90">Plataforma integral para la planificación y ejecución de tareas de mantenimiento</p>
    </div>
  </header>

  <section class="container mx-auto py-16 px-4">
    <h2 class="text-3xl font-bold text-center mb-12">Funcionalidades Principales</h2>
    
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
        <div class="w-12 h-12 bg-green-600 text-white text-xl rounded-lg mb-4 flex items-center justify-center">
          <i class="fas fa-file-contract text-2xl"></i>
        </div>
        <h3 class="text-xl font-semibold mb-3">Gestión de Contratos</h3>
        <ul class="list-disc pl-5 text-gray-600 space-y-2">
          <li>Asignación de representantes</li>
          <li>Configuración de tareas recurrentes</li>
          <li>Plantillas reutilizables</li>
        </ul>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
        <div class="w-12 h-12 bg-green-600 text-white text-xl rounded-lg mb-4 flex items-center justify-center">
          <i class="fas fa-tasks text-2xl"></i>
        </div>
        <h3 class="text-xl font-semibold mb-3">Planificación Inteligente</h3>
        <ul class="list-disc pl-5 text-gray-600 space-y-2">
          <li>Frecuencias personalizadas</li>
          <li>Productividad por tipo de tarea</li>
          <li>Asignación de recursos</li>
        </ul>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
        <div class="w-12 h-12 bg-green-600 text-white text-xl rounded-lg mb-4 flex items-center justify-center">
          <i class="fas fa-chart-line text-2xl"></i>
        </div>
        <h3 class="text-xl font-semibold mb-3">Seguimiento Operativo</h3>
        <ul class="list-disc pl-5 text-gray-600 space-y-2">
          <li>Registro de horas y recursos</li>
          <li>Seguimiento de inventarios</li>
          <li>Reportes automatizados</li>
        </ul>
      </div>
    </div>
  </section>

  <section class="container mx-auto py-16 px-4">
    <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
      <img src="{{ asset('images/urbantree-map.jpg') }}" alt="Interfaz de gestión de zonas verdes" class="w-full h-96 object-cover">
      <div class="p-8 bg-gray-50">
        <h3 class="text-2xl font-bold mb-4">Control Total de tus Espacios Verdes</h3>
        <div class="grid md:grid-cols-2 gap-8">
          <div>
            <h4 class="text-lg font-semibold mb-3">🎯 Funcionalidades Clave</h4>
            <ul class="space-y-2">
              <li class="flex items-center">
                <span class="mr-2">✔️</span>Geolocalización precisa de elementos
              </li>
              <li class="flex items-center">
                <span class="mr-2">✔️</span>Seguimiento de tareas por zonas
              </li>
              <li class="flex items-center">
                <span class="mr-2">✔️</span>Registro de recursos utilizados
              </li>
            </ul>
          </div>
          <div>
            <h4 class="text-lg font-semibold mb-3">📈 Métricas Esenciales</h4>
            <ul class="space-y-2">
              <li class="flex items-center">
                <span class="mr-2">📊</span>Productividad por brigada
              </li>
              <li class="flex items-center">
                <span class="mr-2">⏱️</span>Tiempos de ejecución
              </li>
              <li class="flex items-center">
                <span class="mr-2">🌿</span>Gestión de residuos verdes
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="container mx-auto py-16 px-4">
    <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-xl p-8">
      <h2 class="text-3xl font-bold text-center mb-6">¿Listo para optimizar tu gestión?</h2>
      <p class="text-center text-gray-600 mb-8">Solicita una demostración personalizada</p>
      
      @if($errors->any())
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
          <ul class="list-disc pl-5">
            @foreach($errors->all() as $error)
              <li>{{ $error }}</li>
            @endforeach
          </ul>
        </div>
      @endif

      @if(session('success'))
        <div id="flash-message" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
          {{ session('success') }}
        </div>
        <script>
          setTimeout(function(){
            var flashMessage = document.getElementById('flash-message');
            if(flashMessage){ flashMessage.style.display = 'none'; }
          }, 5000);
        </script>
      @endif

      <form action="/landing-form-data" method="POST" class="space-y-6">
        @csrf
        <div>
          <label class="block text-gray-700 font-semibold mb-2">Nombre completo</label>
          <input type="text" name="name" required class="w-full p-3 border rounded-lg focus:ring-2 ring-green-500 outline-none">
        </div>
        
        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <label class="block text-gray-700 font-semibold mb-2">Correo electrónico</label>
            <input type="email" name="email" required class="w-full p-3 border rounded-lg focus:ring-2 ring-green-500 outline-none">
          </div>
          <div>
            <label class="block text-gray-700 font-semibold mb-2">Teléfono</label>
            <input type="text" name="phone" class="w-full p-3 border rounded-lg focus:ring-2 ring-green-500 outline-none">
          </div>
        </div>

        <div>
          <label class="block text-gray-700 font-semibold mb-2">Mensaje</label>
          <textarea name="message" rows="4" required class="w-full p-3 border rounded-lg focus:ring-2 ring-green-500 outline-none"></textarea>
        </div>

        <button type="submit" class="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-2">
          📩 Enviar Solicitud
        </button>
      </form>
    </div>
  </section>

  <footer class="bg-gray-900 text-white text-center py-6 mt-16">
    <p>&copy; 2025 Urban Tree. Todos los derechos reservados.</p>
    <div class="mt-2">
      <a href="#" class="text-gray-400 hover:text-white mx-2">Política de Privacidad</a>
      <a href="#" class="text-gray-400 hover:text-white mx-2">Términos de Servicio</a>
    </div>
  </footer>

</body>
</html>