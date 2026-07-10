export const enviarPedidoWhatsApp = ({ formData, cart, totalPedido, PRODUCTS_MOCK }) => {
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
  
  if (formData.deliveryType === 'Domicilio') {
    message += `\n\n🛵 *Nota sobre el envío:* El total anterior no incluye el costo del delivery (se coordina el valor exacto por este chat según tarifa de cadete/Uber al momento de la entrega).`;
  }

  const phoneNumber = "543815689490"; 
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
  
  window.open(whatsappUrl, '_blank');
};