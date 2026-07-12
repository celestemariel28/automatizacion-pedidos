import React from 'react';

export default function CategoriesView({ filteredCategories, setSelectedCategoryId, setSelectedCategoryName, setView, setSearchQuery }) {
  return (
    <main className="flex-1 p-4 flex flex-col gap-4">
      <h2 className="text-3xl font-extrabold text-white text-center tracking-wide my-2 drop-shadow-md">
        Productos
      </h2>
      
      <div className="flex flex-col gap-4">
        {filteredCategories.map((cat) => (
          <button key={cat.id}
            onClick={() => {
              setSelectedCategoryId(cat.id);
              setSelectedCategoryName(cat.name);
              setSearchQuery(''); 
              setView('products');
            }}
            className="w-full h-28 rounded-2xl overflow-hidden relative shadow-lg hover:scale-[1.02] transition-transform duration-200 group active:scale-95 flex items-center justify-center"
          >
            <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-[#E91E63]/30 mix-blend-multiply" />
            <span className="relative z-10 text-3xl font-black text-white uppercase tracking-widest drop-shadow-[0_4px_4px_rgba(0,0,0,0.6)]">
              {cat.name}
            </span>
          </button>
        ))}
        {filteredCategories.length === 0 && (
          <p className="text-white text-center mt-4">No se encontraron categorías.</p>
        )}
      </div>
    </main>
  );
}