// Los selectores superiores de Pisos (1 o 2) y Coberturas. relacionado con CustonCAkeAdmin
import React from 'react';
import { CakeSlice, Layers } from 'lucide-react';

export default function PortionFilters({
  activeFloors,
  setActiveFloors,
  coverings = [],
  activeType,
  setActiveType
}) {
  return (
    <div className="space-y-2.5 mb-4">
      {/* Selector de Pisos */}
      <div className="flex bg-pink-50 border border-pink-200 p-1 rounded-xl gap-1">
        <button
          type="button"
          onClick={() => setActiveFloors(1)}
          className={`flex-1 py-2 text-xs font-black rounded-lg transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
            activeFloors === 1 ? 'bg-[#E91E63] text-white shadow-sm' : 'text-[#D81B60] hover:bg-pink-100/60'
          }`}
        >
          <CakeSlice className="w-4 h-4 shrink-0" />
          <span>Tortas de 1 Piso</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveFloors(2)}
          className={`flex-1 py-2 text-xs font-black rounded-lg transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
            activeFloors === 2 ? 'bg-[#E91E63] text-white shadow-sm' : 'text-[#D81B60] hover:bg-pink-100/60'
          }`}
        >
          <Layers className="w-4 h-4 shrink-0" />
          <span>Tortas de 2 Pisos</span>
        </button>
      </div>

      {/* Selector de Cobertura */}
      <div className="flex bg-gray-100 p-1 rounded-xl gap-1 overflow-x-auto">
        {coverings.map((cov) => (
          <button
            key={cov.id}
            type="button"
            onClick={() => setActiveType(cov.name.toLowerCase())}
            className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeType.toLowerCase() === cov.name.toLowerCase()
                ? 'bg-white text-[#E91E63] shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {cov.name}
          </button>
        ))}
      </div>
    </div>
  );
}