import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

export default function CustomCakeView({ setView, onUpdateProductVariants }) {
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoRead, setInfoRead] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Estados dinámicos de Supabase
  const [coveringsList, setCoveringsList] = useState([]);
  const [selectedCovering, setSelectedCovering] = useState('');
  const [portionsList, setPortionsList] = useState([]);
  const [selectedPortion, setSelectedPortion] = useState(null);
  const [fillingsList, setFillingsList] = useState([]);
  const [selectedFilling, setSelectedFilling] = useState('');
  // 🌸 Guardamos el objeto completo { id, title, image_url }
  const [infoSlides, setInfoSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar todo desde Supabase al montar
  useEffect(() => {
    async function loadAllData() {
      try {
        setLoading(true);

        // 1. Cargar slides con título e imagen completa
        const { data: slidesData } = await supabase
          .from('info_slides')
          .select('*')
          .order('order_index', { ascending: true });

        if (slidesData && slidesData.length > 0) {
          setInfoSlides(slidesData);
        }

        // 2. Cargar coberturas
        const { data: coveringsData } = await supabase
          .from('cake_coverings')
          .select('*')
          .eq('available', true)
          .order('id', { ascending: true });

        if (coveringsData && coveringsData.length > 0) {
          setCoveringsList(coveringsData);
          setSelectedCovering(coveringsData[0].name);
        }

        // 3. Cargar porciones
        const { data: portionsData } = await supabase
          .from('custom_cake_portions')
          .select('*')
          .order('price', { ascending: true });

        if (portionsData) {
          setPortionsList(portionsData);
        }

        // 4. Cargar rellenos
        const { data: fillingsData } = await supabase
          .from('fillings')
          .select('*')
          .eq('available', true)
          .order('name', { ascending: true });

        if (fillingsData && fillingsData.length > 0) {
          setFillingsList(fillingsData);
          setSelectedFilling(fillingsData[0].name);
        }
      } catch (err) {
        console.error('Error cargando datos de personalización:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAllData();
  }, []);

  // Filtrar porciones según la cobertura
  const currentPortions = portionsList.filter(p => 
    p.cake_type.toLowerCase() === selectedCovering.toLowerCase()
  );

  useEffect(() => {
    if (currentPortions.length > 0) {
      setSelectedPortion(currentPortions[0]);
    } else {
      setSelectedPortion(null);
    }
  }, [selectedCovering, portionsList]);

  // Controles del carrusel con índice seguro
  const handleNextImage = () => {
    if (infoSlides.length === 0) return;
    setCurrentImageIndex((prev) => (prev + 1) % infoSlides.length);
  };

  const handlePrevImage = () => {
    if (infoSlides.length === 0) return;
    setCurrentImageIndex((prev) => (prev - 1 + infoSlides.length) % infoSlides.length);
  };

  const handleConfirmReadInfo = () => {
    setShowInfoModal(false);
    setInfoRead(true);
  };

  const handleAddToCart = () => {
    if (!infoRead) {
      alert("Debés leer y aceptar la información importante antes de continuar.");
      return;
    }

    if (!selectedCovering) {
      alert("Por favor seleccioná una cobertura.");
      return;
    }

    if (!selectedPortion) {
      alert("Por favor seleccioná una cantidad de porciones.");
      return;
    }

    if (!selectedFilling) {
      alert("Por favor seleccioná un relleno para tu torta.");
      return;
    }

    const titleType = `TORTA PERSONALIZADA (${selectedCovering})`;

    const customItem = {
      productId: `custom-${selectedCovering.toLowerCase()}`,
      productName: titleType,
      variantId: `${selectedPortion.label}-${selectedFilling}`,
      variantLabel: `${selectedPortion.label} | Cobertura: ${selectedCovering} | Relleno: ${selectedFilling}`,
      price: parseFloat(selectedPortion.price),
      quantity: 1,
      maxStock: 99
    };

    if (onUpdateProductVariants) {
      onUpdateProductVariants(`custom-${selectedCovering.toLowerCase()}`, [customItem]);
    }
    setView('form');
  };

  const currentSlide = infoSlides[currentImageIndex] || null;

  return (
    <main className="flex-1 p-4 max-w-md mx-auto w-full pb-20 animate-fadeIn">
      {/* Botón Volver */}
      <div className="flex items-center gap-3 mb-4">
        <button
          type="button"
          onClick={() => setView('categories')}
          className="w-8 h-8 flex items-center justify-center bg-white rounded-full text-[#E91E63] shadow-sm transition-all active:scale-90 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </button>
        <h2 className="text-2xl font-black text-[#E91E63]  capitalize">
          Tortas Personalizadas
        </h2>
      </div>

      <div className={`rounded-3xl p-5 mb-5 border-2 transition-all ${
        infoRead 
          ? 'bg-emerald-50 border-emerald-300' 
          : 'bg-rose-50/30 border-[#E91E63] shadow-lg'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 bg-[#E91E63] text-white rounded-full">
              Paso 1 Obligatorio
            </span>
            <h3 className="font-black text-sm text-[#D81B60] mt-1">Información Importante</h3>
          </div>
          {infoRead && (
            <span className="bg-emerald-500 text-white px-2.5 py-1 rounded-full text-xs font-black flex items-center gap-1 shadow-sm">
              ✓ Leído
            </span>
          )}
        </div>
        <p className="text-xs text-gray-600 mb-3 leading-relaxed">
          {infoRead 
            ? '¡Información confirmada! Ya podés armar tu torta personalizada debajo.' 
            : 'Antes de realizar tu pedido es necesario leer los tiempos de anticipación y condiciones de entrega.'}
        </p>

        <button
          type="button"
          onClick={() => {
            setCurrentImageIndex(0);
            setShowInfoModal(true);
          }}
          className={`w-full py-3 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-transform cursor-pointer ${
            infoRead
              ? 'bg-white border-2 border-emerald-500 text-emerald-700'
              : 'bg-[#E91E63] text-white hover:bg-[#d81b60]'
          }`}
        >
          {infoRead ? '📖 Volver a ver información' : 'Ver Información Importante'}
        </button>
      </div>

      {!infoRead ? (
       <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-3xl p-8 text-center flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 bg-pink-100/70 text-[#E91E63] rounded-full flex items-center justify-center shadow-inner">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>
        </div>
        <h4 className="font-extrabold text-sm text-gray-800">Personalización Bloqueada</h4>
        <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
          Hacé clic arriba en <strong>"Ver Información Importante"</strong> para desbloquear las opciones de cobertura, porciones y rellenos.
        </p>
      </div>
      ) : (
        <div className="bg-white rounded-3xl p-5 shadow-md border border-pink-100 flex flex-col gap-5 animate-slideDown">
          
          <div>
            <label className="text-xs font-black text-[#D81B60] uppercase block mb-2">1. Elegí la Cobertura</label>
            {coveringsList.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {coveringsList.map((cov) => (
                  <button
                    key={cov.id}
                    type="button"
                    onClick={() => setSelectedCovering(cov.name)}
                    className={`py-3 px-2 rounded-2xl border-2 text-xs font-black transition-all cursor-pointer ${
                      selectedCovering.toUpperCase() === cov.name.toUpperCase()
                        ? 'border-[#E91E63] bg-pink-50 text-[#E91E63]'
                        : 'border-gray-200 text-gray-700 bg-white'
                    }`}
                  >
                    {cov.name}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400">Cargando coberturas...</p>
            )}
          </div>

          <div>
            <label className="text-xs font-black text-[#D81B60] uppercase block mb-2">2. Porciones y Precios</label>
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
                  No hay precios cargados para {selectedCovering}. Podés agregarlos en el panel de administrador.
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-[#D81B60] uppercase block mb-1">3. Relleno a Elección (1 solo)</label>
            <p className="text-[11px] text-gray-400 mb-2">Incluye dulce de leche + el relleno que elijas:</p>

            {fillingsList.length > 0 ? (
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
            ) : (
              <p className="text-xs text-gray-400">No hay rellenos disponibles.</p>
            )}
          </div>

          {/* Aclaración WhatsApp */}
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl">
            <p className="text-[11px] text-amber-800 leading-snug">
               <strong>Diseño y foto:</strong> Al enviar el pedido podrás adjuntar por WhatsApp la foto de modelo o referencia que quieras.
            </p>
          </div>

          {/* Botón Continuar */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full py-4 bg-[#E91E63] text-white font-bold rounded-2xl shadow-lg text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform hover:bg-[#d81b60] cursor-pointer"
          >
            Continuar con el Pedido
          </button>
        </div>
      )}

      {/* 🌸 MODAL CARRUSEL CON TÍTULO Y NUMERACIÓN EN VIVO */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl flex flex-col items-center relative max-h-[92vh] overflow-y-auto">
            
            {/* Botón cerrar X */}
            <button
              type="button"
              onClick={() => setShowInfoModal(false)}
              className="absolute top-4 right-4 w-7 h-7 bg-pink-100 text-[#E91E63] rounded-full flex items-center justify-center hover:bg-pink-200 font-bold cursor-pointer active:scale-90 transition-transform"
            >
              ✕
            </button>

            {/* Título de la diapositiva actual */}
            <h3 className="font-black text-sm text-[#D81B60] mb-1 uppercase text-center pr-6">
              {currentSlide?.title || 'Información Importante'}
            </h3>

            {/* Contenedor de la Imagen */}
            <div className="w-full rounded-2xl overflow-hidden shadow-inner border border-gray-100 mb-3 bg-gray-50 flex items-center justify-center min-h-[300px]">
              {currentSlide ? (
                <img
                  key={currentSlide.id || currentImageIndex}
                  src={currentSlide.image_url}
                  alt={currentSlide.title || `Información ${currentImageIndex + 1}`}
                  className="w-full h-auto max-h-[55vh] object-contain animate-fadeIn"
                />
              ) : (
                <p className="text-xs text-gray-400 p-4 text-center">
                  No hay imágenes cargadas aún.
                </p>
              )}
            </div>

            {/* Controles de Navegación */}
            {infoSlides.length > 1 && (
              <div className="flex items-center justify-between w-full px-4 mb-4">
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="w-10 h-10 bg-pink-100 hover:bg-pink-200 text-[#E91E63] rounded-full flex items-center justify-center shadow-sm active:scale-90 transition-transform cursor-pointer"
                  title="Anterior"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>

                {/* Indicadores de puntos interactivos */}
                <div className="flex items-center gap-1.5">
                  {infoSlides.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        idx === currentImageIndex ? 'w-6 bg-[#E91E63]' : 'w-2 bg-pink-200'
                      }`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleNextImage}
                  className="w-10 h-10 bg-pink-100 hover:bg-pink-200 text-[#E91E63] rounded-full flex items-center justify-center shadow-sm active:scale-90 transition-transform cursor-pointer"
                  title="Siguiente"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>
            )}

            {/* Botón de Confirmación */}
            <button
              type="button"
              onClick={handleConfirmReadInfo}
              className="w-full py-3.5 bg-emerald-600 text-white font-bold rounded-2xl text-xs shadow-lg active:scale-95 transition-transform hover:bg-emerald-700 cursor-pointer"
            >
              Leí y acepto la información ✓
            </button>
          </div>
        </div>
      )}
    </main>
  );
}