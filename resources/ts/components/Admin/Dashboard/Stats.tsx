import { Icon } from '@iconify/react';

export function Stats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {/* Widget 1: Usuarios */}
      <div className="bg-gray-50 rounded p-6 flex flex-col items-center justify-center text-center border border-gray-300">
        <div className="text-gray-700 mb-4">
          <Icon icon="tabler:question-mark" width="48px" />
        </div>
        <h2 className="text-lg font-medium text-gray-700">Usuarios</h2>
        <p className="mt-3 text-3xl font-semibold text-gray-900">100</p>
      </div>

      {/* Widget 2: Contratos */}
      <div className="bg-gray-50 rounded p-6 flex flex-col items-center justify-center text-center border border-gray-300">
        <div className="text-gray-700 mb-4">
          <Icon icon="tabler:question-mark" width="48px" />
        </div>
        <h2 className="text-lg font-medium text-gray-700">Contratos</h2>
        <p className="mt-3 text-3xl font-semibold text-gray-900">50</p>
      </div>

      {/* Widget 3: Elementos */}
      <div className="bg-gray-50 rounded p-6 flex flex-col items-center justify-center text-center border border-gray-300">
        <div className="text-gray-700 mb-4">
          <Icon icon="tabler:question-mark" width="48px" />
        </div>
        <h2 className="text-lg font-medium text-gray-700">Elementos</h2>
        <p className="mt-3 text-3xl font-semibold text-gray-900">75</p>
      </div>

      {/* Widget 4: Órdenes de trabajo */}
      <div className="bg-gray-50 rounded p-6 flex flex-col items-center justify-center text-center border border-gray-300">
        <div className="text-gray-700 mb-4">
          <Icon icon="tabler:question-mark" width="48px" />
        </div>
        <h2 className="text-lg font-medium text-gray-700">
          Órdenes de trabajo
        </h2>
        <p className="mt-3 text-3xl font-semibold text-gray-900">30</p>
      </div>
    </div>
  );
}
