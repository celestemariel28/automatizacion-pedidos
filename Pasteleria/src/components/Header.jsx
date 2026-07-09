import React from 'react';

export default function Header({ view, searchQuery, setSearchQuery, setView }) {
  
  const handleGoHome = () => {
    setView('categories');
    setSearchQuery('');
  };

  const isFormView = view === 'form';

  return (
    <header className="p-4 bg-[#FFC5D3] flex items-center justify-between shadow-sm sticky top-0 z-50">
      <button 
        onClick={handleGoHome}
        className="w-14 h-14 bg-white rounded-full flex items-center justify-center border-2 border-[#D81B60] overflow-hidden shadow-md shrink-0 active:scale-95 transition-transform cursor-pointer focus:outline-none"
        title="Volver al inicio"
      >
        <img 
          src="../public/logo.png" 
          alt="Logo Candela Garbini" 
          className="w-full h-full object-cover object-center"
        />
      </button>
      
      <div className="flex-1 ml-4 relative">
        <input 
          type="text" 
          placeholder={
            isFormView 
              ? "Finalizando pedido... 🛍️" 
              : view === 'categories' ? "Buscar Categorías..." : "Buscar dulces..."
          } 
          value={isFormView ? "" : searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          disabled={isFormView}
          className={`w-full text-sm font-semibold rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-white shadow-md transition-all duration-200 ${
            isFormView 
              ? "bg-[#D81B60]/30 text-rose-100 cursor-not-allowed opacity-80" 
              : "bg-[#E91E63] text-white placeholder-rose-200" 
          }`}
        />
        
        {!isFormView && (
          <div className="absolute left-3 top-2.5 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-rose-200">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.602Z" />
            </svg>
          </div>
        )}
      </div>
    </header>
  );
}