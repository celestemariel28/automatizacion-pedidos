import React, { useState, useEffect } from 'react';
import { CakeSlice, Layers, Sparkles, AlertCircle } from 'lucide-react';

export default function CustomCakeForm({
  coveringsList = [],
  portionsList = [],
  fillingsList = [],
  onSubmit
}) {
  const [selectedFloors, setSelectedFloors] = useState(1);
  const [selectedCovering, setSelectedCovering] = useState('');
  const [selectedPortion, setSelectedPortion] = useState(null);
  const [selectedFilling, setSelectedFilling] = useState('');

  useEffect(() => {
    if (coveringsList.length > 0 && !selectedCovering) {
      setSelectedCovering(coveringsList[0].name);
    }
  }, [coveringsList]);

  useEffect(() => {
    if (fillingsList.length > 0 && !selectedFilling) {
      setSelectedFilling(fillingsList[0].name);
    }
  }, [fillingsList]);

  const currentPortions = portionsList.filter(
    (p) =>
      String(p.cake_type).toLowerCase() === String(selectedCovering).toLowerCase() &&
      (parseInt(p.floors, 10) || 1) === selectedFloors
  );

  useEffect(() => {
    if (currentPortions.length > 0) {
      setSelectedPortion(currentPortions[0]);
    } else {
      setSelectedPortion(null);
    }
  }, [selectedFloors, selectedCovering, portionsList]);

  const handleFormSubmit = () => {
    if (!selectedPortion) {
      alert('Por favor seleccioná una cantidad de porciones.');
      return;
    }
    if (!selectedFilling) {
      alert('Por favor seleccioná un relleno para tu torta.');
      return;
    }

    onSubmit({
      floors: selectedFloors,
      covering: selectedCovering,
      portion: selectedPortion,
      filling: selectedFilling
    });
  };

  return (
    <div className="bg-white rounded-3xl p-5 shadow-md border border-pink-100 flex flex-col gap-5 animate-slideDown">
      {/* 1. Pisos */}
      <div>
        <label className="text-xs font-black text-[#D81B60] uppercase block mb-2">1. Cantidad de Pisos</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setSelectedFloors(1)}
            className={`py-3 px-2 rounded-2xl border-2 text-xs font-black transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
              selectedFloors === 1
                ? 'border-[#E91E63] bg-pink-50 text-[#E91E63]'
                : 'border-gray-200 text-gray-700 bg-white hover:border-gray-300'
            }`}
          >
            <CakeSlice className="w-4 h-4 shrink-0" />
            <span>1 Piso</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedFloors(2)}
            className={`py-3 px-2 rounded-2xl border-2 text-xs font-black transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
              selectedFloors === 2
                ? 'border-[#E91E63] bg-pink-50 text-[#E91E63]'
                : 'border-gray-200 text-gray-700 bg-white hover:border-gray-300'
            }`}
          >
            <Layers className="w-4 h-4 shrink-0" />
            <span>2 Pisos</span>
          </button>
        </div>
      </div>

      {/* 2. Coberturas */}
      <div>
        <label className="text-xs font-black text-[#D81B60] uppercase block mb-2">2. Cobertura</label>
        <div className="grid grid-cols-2 gap-2">
          {coveringsList.map((cov) => (
            <button
              key={cov.id}
              type="button"
              onClick={() => setSelectedCovering(cov.name)}
              className={`py-3 px-2 rounded-2xl border-2 text-xs font-black transition-all cursor-pointer ${
                String(selectedCovering).toUpperCase() === String(cov.name).toUpperCase()
                  ? 'border-[#E91E63] bg-pink-50 text-[#E91E63]'
                  : 'border-gray-200 text-gray-700 bg-white hover:border-gray-300'
              }`}
            >
              {cov.name}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Porciones y Precios */}
      <div>
        <label className="text-xs font-black text-[#D81B60] uppercase block mb-2">
          3. Porciones y Precios ({selectedFloors} {selectedFloors === 1 ? 'Piso' : 'Pisos'})
        </label>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {currentPortions.map((portion) => (
            <div
              key={portion.id}
              onClick={() => setSelectedPortion(portion)}
              className={`p-2.5 rounded-xl border-2 flex justify-between items-center cursor-pointer transition-all ${
                selectedPortion?.id === portion.id
                  ? 'border-[#E91E63] bg-pink-50/60 text-[#E91E63]'
                  : 'border-pink-50 hover:border-pink-100 text-gray-800'
              }`}
            >
              <span className="text-xs font-bold">{portion.label}</span>
              <span className="text-xs font-black text-[#E91E63]">
                ${Number(portion.price).toLocaleString('es-AR')}
              </span>
            </div>
          ))}
          {currentPortions.length === 0 && (
            <p className="text-xs text-gray-400 text-center py-2">
              No hay opciones disponibles para {selectedFloors} piso/s en {selectedCovering}.
            </p>
          )}
        </div>
      </div>

      {/* 4. Relleno */}
      <div>
        <label className="text-xs font-black text-[#D81B60] uppercase block mb-1">4. Relleno a Elección (1 solo)</label>
        <p className="text-[11px] text-gray-400 mb-2">Bizcochuelo de vainilla + dulce de leche + 1 relleno:</p>
        <select
          value={selectedFilling}
          onChange={(e) => setSelectedFilling(e.target.value)}
          className="w-full bg-rose-50/50 border border-rose-200 rounded-xl py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-[#E91E63] text-xs font-bold text-gray-800"
        >
          {fillingsList.map((f) => (
            <option key={f.id} value={f.name}>
              {f.name}
            </option>
          ))}
        </select>
      </div>

      {/* Cartel WhatsApp Info */}
      <div className="bg-pink-50/60 border border-pink-200 p-3 rounded-2xl flex items-start gap-2.5 shadow-sm">
        <Sparkles className="w-4 h-4 text-[#E91E63] shrink-0 mt-0.5" />
        <p className="text-[11px] text-pink-950 leading-snug">
          <strong className="text-[#D81B60]">Diseño y decoración:</strong> Podrás adjuntar la foto o imagen de referencia del diseño directamente por WhatsApp al enviar el pedido.
        </p>
      </div>

      {/* Cartel Modificaciones */}
      <div className="bg-rose-50 border-2 border-rose-200/80 p-3 rounded-2xl flex items-start gap-2 shadow-inner">
        <AlertCircle className="w-4 h-4 text-[#D81B60] shrink-0 mt-0.5" />
        <p className="text-[11px] font-bold text-[#D81B60] leading-tight">
          Valor inicial sujeto a modificaciones según complejidad del diseño y cambios en bizcochuelos o rellenos.
        </p>
      </div>

      {/* Botón Continuar */}
      <button
        type="button"
        onClick={handleFormSubmit}
        className="w-full py-4 bg-[#E91E63] text-white font-bold rounded-2xl shadow-lg text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform hover:bg-[#d81b60] cursor-pointer"
      >
        Continuar con el Pedido
      </button>
    </div>
  );
}