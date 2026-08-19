import React, { useState } from 'react';
import { enviarPedidoWhatsApp } from '../../utils/whatsappHelper';

export default function FormView({ setView, cart, calculateSubtotal, PRODUCTS_MOCK }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    deliveryType: 'Retiro en tienda',
    paymentMethod: 'Transferencia',
    cashAmount: '',
    notes: ''
  });

  const totalPedido = calculateSubtotal();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const cleanPhone = formData.phone.replace(/\s+/g, '');
    
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(cleanPhone)) {
      alert("Por favor, ingresá un número de celular válido de 10 dígitos (Ej: 3816554433, sin el 0 ni el 15).");
      return;
    }

    if (formData.paymentMethod === 'Efectivo') {
      const cash = parseFloat(formData.cashAmount);
      if (!formData.cashAmount || isNaN(cash)) {
        alert("Por favor, ingresá con cuánto vas a pagar.");
        return;
      }
      if (cash < totalPedido) {
        alert(`El monto con el que vas a pagar ($${cash.toLocaleString('es-AR')}) es menor al total.`);
        return;
      }
    }

    enviarPedidoWhatsApp({ 
      formData: { ...formData, phone: cleanPhone }, 
      cart, 
      totalPedido, 
      PRODUCTS_MOCK 
    });
  };

  return (
    <main className="flex-1 p-4 animate-fadeIn">
      <div className="flex items-center gap-2 mb-6">
        <button 
          type="button" 
          onClick={() => setView('products')} 
          className="w-9 h-9 flex items-center justify-center bg-white rounded-full text-[#E91E63] shadow-md active:scale-90 transition-transform cursor-pointer"
          title="Volver"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </button>
        <h2 className="text-2xl font-black text-[#E91E63] drop-shadow-sm">Datos del Pedido</h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl shadow-xl flex flex-col gap-4 text-gray-800">
        <div>
          <label className="text-xs font-bold text-[#D81B60] uppercase block mb-1">Nombre y Apellido *</label>
          <input 
            type="text" 
            name="name" 
            required 
            value={formData.name} 
            onChange={handleChange} 
            className="w-full bg-rose-50/50 border border-rose-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#E91E63]" 
            placeholder="Ej: Candela Garbini" 
          />
        </div>

        <div>
          <label className="text-xs font-bold text-[#D81B60] uppercase block mb-1">Número de Celular (10 dígitos) *</label>
          <input 
            type="text" 
            name="phone" 
            required 
            maxLength={10} 
            value={formData.phone} 
            onChange={(e) => {
              const onlyNums = e.target.value.replace(/[^0-9]/g, '');
              handleChange({ target: { name: 'phone', value: onlyNums } });
            }} 
            className="w-full bg-rose-50/50 border border-rose-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#E91E63] font-mono tracking-wider" 
            placeholder="Ej: 3816554433" 
          />
        </div>

        <div>
          <label className="text-xs font-bold text-[#D81B60] uppercase block mb-1">Forma de Pago</label>
          <select 
            name="paymentMethod" 
            value={formData.paymentMethod} 
            onChange={handleChange} 
            className="w-full bg-rose-50/50 border border-rose-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#E91E63] font-semibold text-gray-700"
          >
            <option value="Transferencia">Transferencia Bancaria</option>
            <option value="Efectivo">Efectivo (al retirar)</option>
          </select>
        </div>

        {formData.paymentMethod === 'Efectivo' && (
          <div className="animate-slideDown">
            <label className="text-xs font-bold text-[#D81B60] uppercase block mb-1">¿Con cuánto vas a abonar?</label>
            <input 
              type="number" 
              name="cashAmount" 
              required 
              value={formData.cashAmount} 
              onChange={handleChange} 
              className="w-full bg-rose-50/50 border border-rose-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#E91E63]" 
              placeholder={`Total: $${totalPedido}`} 
            />
          </div>
        )}

        <div>
          <label className="text-xs font-bold text-[#D81B60] uppercase block mb-1">Notas o Aclaraciones</label>
          <textarea 
            name="notes" 
            rows="2" 
            value={formData.notes} 
            onChange={handleChange} 
            className="w-full bg-rose-50/50 border border-rose-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#E91E63] resize-none" 
            placeholder="Ej: dedicatoria en tarjeta, horario estimado de retiro..."
          />
        </div>

        <div className="mt-2 p-3 bg-rose-50 rounded-xl border border-rose-100 flex flex-col gap-2 shadow-inner">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-[#D81B60]">Total de tu pedido:</span>
            <span className="text-2xl font-black text-[#E91E63]">${totalPedido.toLocaleString('es-AR')}</span>
          </div>
          <p className="text-[11px] text-gray-500 font-medium">
            Retiro por el local comercial.
          </p>
        </div>

        <button 
          type="submit" 
          className="w-full bg-[#E91E63] text-white py-4 rounded-xl font-bold hover:bg-[#D81B60] transition-colors text-lg shadow-lg active:scale-95 tracking-wider cursor-pointer"
        >
          Confirmar Pedido por WhatsApp
        </button>
      </form>
    </main>
  );
}