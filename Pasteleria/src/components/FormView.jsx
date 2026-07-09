import React, { useState } from 'react';

export default function FormView({ setView, cart, calculateSubtotal, PRODUCTS_MOCK }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    deliveryType: 'Retiro en tienda',
    paymentMethod: 'Transferencia',
    cashAmount: '',
    address: '',
    notes: ''
  });

  const totalPedido = calculateSubtotal();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleConfirmOrder = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim()) {
      alert("Por favor, completá tu Nombre y Celular.");
      return;
    }
    if (formData.deliveryType === 'Domicilio' && !formData.address.trim()) {
      alert("Por favor, ingresá la dirección para el envío a domicilio.");
      return;
    }

    if (formData.paymentMethod === 'Efectivo') {
      const cash = parseFloat(formData.cashAmount);
      if (!formData.cashAmount || isNaN(cash)) {
        alert("Por favor, ingresá con cuánto vas a pagar.");
        return;
      }
      if (cash < totalPedido) {
        alert(`❌ ¡Ups! El monto con el que vas a pagar ($${cash.toLocaleString('es-AR')}) es menor al total del pedido ($${totalPedido.toLocaleString('es-AR')}). Por favor, corregilo.`);
        return;
      }
    }

    let productsListText = '';
    Object.keys(cart).forEach(productId => {
      const product = PRODUCTS_MOCK.find(p => p.id === parseInt(productId));
      if (product) {
        const qty = cart[productId];
        const totalLine = product.price * qty;
        productsListText += `• ${qty}x ${product.name} ($${totalLine.toLocaleString('es-AR')})\n`;
      }
    });

    let message = `🧁 *Nuevo Pedido - Candela Garbini*\n\n`;
    message += `👤 *Cliente:* ${formData.name}\n`;
    message += `📱 *Celular:* ${formData.phone}\n`;
    message += `📦 *Entrega:* ${formData.deliveryType}\n`;
    if (formData.deliveryType === 'Domicilio') {
      message += `📍 *Dirección:* ${formData.address}\n`;
    }
    message += `💳 *Forma de Pago:* ${formData.paymentMethod}\n`;
    
    if (formData.paymentMethod === 'Efectivo') {
      const vuelto = parseFloat(formData.cashAmount) - totalPedido;
      message += `💵 *Paga con:* $${parseFloat(formData.cashAmount).toLocaleString('es-AR')}\n`;
      if (vuelto > 0) {
        message += `🪙 *Llevar vuelto de:* $${vuelto.toLocaleString('es-AR')}\n`;
      } else {
        message += `🪙 *Paga justo, no llevar vuelto.*\n`;
      }
    }
    
    if (formData.notes.trim()) {
      message += `💬 *Notas:* ${formData.notes}\n`;
    }

    message += `\n🛒 *Detalle del Pedido:*\n${productsListText}\n`;
    message += `💰 *TOTAL A PAGAR:* $${totalPedido.toLocaleString('es-AR')}`;

    const phoneNumber = "543815689490";
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <main className="flex-1 p-4 animate-fadeIn">
      <div className="flex items-center gap-2 mb-6">
        <button 
          type="button"
          onClick={() => setView('products')} 
          className="w-9 h-9 flex items-center justify-center bg-white rounded-full hover:bg-rose-50 text-[#E91E63] shadow-md transition-all active:scale-90"
          title="Volver"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-white drop-shadow-sm">Datos de Envío</h2>
      </div>

      <form onSubmit={handleConfirmOrder} className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl shadow-xl flex flex-col gap-4 text-gray-800">
        <p className="text-xs text-gray-500 text-center font-medium -mt-2">Completa tus datos para confirmar el pedido</p>

        <div>
          <label className="text-xs font-bold text-[#D81B60] uppercase tracking-wider block mb-1">Nombre y Apellido *</label>
          <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full bg-rose-50/50 border border-rose-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#E91E63] font-medium" placeholder="Ej: Candela Garbini" />
        </div>

        <div>
          <label className="text-xs font-bold text-[#D81B60] uppercase tracking-wider block mb-1">Número de Celular *</label>
          <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="w-full bg-rose-50/50 border border-rose-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#E91E63] font-medium" placeholder="Ej: 3816554433" />
        </div>

        <div>
          <label className="text-xs font-bold text-[#D81B60] uppercase tracking-wider block mb-1">Tipo de Entrega</label>
          <select name="deliveryType" value={formData.deliveryType} onChange={handleChange} className="w-full bg-rose-50/50 border border-rose-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#E91E63] font-semibold text-gray-700">
            <option value="Retiro en tienda">Retiro en local (Gratis)</option>
            <option value="Domicilio">Envío a Domicilio</option>
          </select>
        </div>

        {formData.deliveryType === 'Domicilio' && (
          <div className="animate-slideDown">
            <label className="text-xs font-bold text-[#D81B60] uppercase tracking-wider block mb-1">Dirección Completa *</label>
            <input type="text" name="address" required value={formData.address} onChange={handleChange} className="w-full bg-rose-50/50 border border-rose-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#E91E63] font-medium" placeholder="Calle, Número, Barrio o depto" />
          </div>
        )}

        <div>
          <label className="text-xs font-bold text-[#D81B60] uppercase tracking-wider block mb-1">Forma de Pago</label>
          <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="w-full bg-rose-50/50 border border-rose-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#E91E63] font-semibold text-gray-700">
            <option value="Transferencia">Transferencia Bancaria</option>
            <option value="Efectivo">Efectivo</option>
          </select>
        </div>

        {formData.paymentMethod === 'Efectivo' && (
          <div className="animate-slideDown">
            <label className="text-xs font-bold text-[#D81B60] uppercase tracking-wider block mb-1">¿Con cuánto vas a pagar? (Para calcular el vuelto)</label>
            <input type="number" name="cashAmount" required value={formData.cashAmount} onChange={handleChange} className="w-full bg-rose-50/50 border border-rose-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#E91E63] font-medium" placeholder={`Total: $${totalPedido}`} />
          </div>
        )}

        <div>
          <label className="text-xs font-bold text-[#D81B60] uppercase tracking-wider block mb-1">Notas o Comentarios del Pedido</label>
          <textarea name="notes" rows="2" value={formData.notes} onChange={handleChange} className="w-full bg-rose-50/50 border border-rose-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#E91E63] font-medium resize-none" placeholder="Ej: Dedicatoria, horario preferido..."></textarea>
        </div>

        <div className="mt-2 p-3 bg-rose-50 rounded-xl border border-rose-100 flex justify-between items-center shadow-inner">
          <span className="text-sm font-bold text-[#D81B60]">Total de tu pedido:</span>
          <span className="text-2xl font-black text-[#E91E63]">${totalPedido.toLocaleString('es-AR')}</span>
        </div>

        <button type="submit" className="w-full bg-[#E91E63] text-white py-4 rounded-xl font-bold hover:bg-[#D81B60] transition-colors text-lg shadow-lg active:scale-95 tracking-wider">
          Confirmar Pedido 🚀
        </button>
      </form>
    </main>
  );
}