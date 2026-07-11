import React from 'react';

export default function ProductsView({ filteredProducts, selectedCategoryName, setView, setSearchQuery, cart, addToCart, removeFromCart, calculateSubtotal, isCartEmpty }) {
  return (
    <main className={`flex-1 p-4 transition-all ${Object.keys(cart).length > 0 ? 'pb-40' : 'pb-4'}`}>
      <div className="flex items-center gap-2 mb-6">
        <button 
            onClick={() => { setView('categories'); setSearchQuery(''); }} 
            className="w-9 h-9 flex items-center justify-center bg-white rounded-full hover:bg-rose-50 text-[#E91E63] shadow-md transition-all active:scale-90"
            title="Volver"
            >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
        </button>
        <h2 className="text-3xl font-bold text-white drop-shadow-sm">{selectedCategoryName}</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-4">
        {filteredProducts.map(product => {
          const isAgotado = product.stock === 0;
          const alcanzoLimiteStock = (cart[product.id] || 0) >= product.stock;

          return (
            <div key={product.id} className="w-full h-32 rounded-2xl overflow-hidden relative shadow-lg flex items-center justify-between p-4">
              <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
              
              <div className={`absolute inset-0 ${isAgotado ? 'bg-black/60 backdrop-blur-[1px]' : 'bg-gradient-to-r from-[#E91E63]/40 to-[#E91E63]/20'}`} />
              
              <div className="relative z-10 flex flex-col justify-between h-full max-w-[60%]">
                <div>
                  <h3 className="text-lg font-black text-white leading-tight drop-shadow-md">{product.name}</h3>
                  <p className="text-[11px] text-white/90 font-medium line-clamp-2 mt-0.5 drop-shadow-sm">
                    {isAgotado ? "No disponible por el momento" : product.description}
                  </p>
                </div>
                <p className="text-xl font-black text-white drop-shadow-md">
                  {isAgotado ? '---' : `$${product.price.toLocaleString('es-AR')}`}
                </p>
              </div>
              
              <div className="relative z-10">
                {isAgotado ? (
                  <span className="bg-red-600 text-white font-black text-xs px-3 py-1.5 rounded-xl uppercase tracking-wider shadow-md border border-red-400">
                    Agotado
                  </span>
                ) : (
                  <div className="flex items-center gap-1.5 bg-white/90 p-1.5 rounded-full shadow-lg backdrop-blur-sm">
                    <button 
                      onClick={() => removeFromCart(product.id)} 
                      className={`w-7 h-7 flex items-center justify-center rounded-full font-bold transition-colors ${cart[product.id] ? 'bg-[#E91E63] text-white hover:bg-[#D81B60]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`} 
                      disabled={!cart[product.id]}
                    >
                      −
                    </button>
                    <span className="w-5 text-center font-bold text-[#E91E63]">{cart[product.id] || 0}</span>
                    <button 
                      onClick={() => addToCart(product.id)} 
                      className={`w-7 h-7 flex items-center justify-center rounded-full font-bold transition-colors ${alcanzoLimiteStock ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#E91E63] text-white hover:bg-[#D81B60]'}`}
                      disabled={alcanzoLimiteStock}
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {filteredProducts.length === 0 && (
          <p className="text-white text-center mt-4">No se encontraron productos.</p>
        )}
      </div>

      {!isCartEmpty && (
        <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-[#FFC5D3] border-t-2 border-[#D81B60] shadow-2xl flex flex-col gap-3 rounded-t-3xl z-40">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[#D81B60]">Subtotal:</span>
            <span className="text-2xl font-black text-[#E91E63]">${calculateSubtotal().toLocaleString('es-AR')}</span>
          </div>
          <button onClick={() => setView('form')} className="w-full bg-[#E91E63] text-white py-3.5 rounded-xl font-bold hover:bg-[#D81B60] transition-colors text-lg shadow-lg">
            Continuar Pedido
          </button>
        </footer>
      )}
    </main>
  );
}