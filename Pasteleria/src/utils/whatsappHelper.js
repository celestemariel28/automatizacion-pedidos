import { supabase } from '../supabaseClient'; 

export const enviarPedidoWhatsApp = async ({ formData, cart, totalPedido, PRODUCTS_MOCK }) => {
  try {
    const itemsPorProducto = {};
    Object.values(cart).forEach(item => {
      const qty = parseInt(item.quantity, 10) || 0;
      if (qty > 0) {
        if (!itemsPorProducto[item.productId]) {
          itemsPorProducto[item.productId] = [];
        }
        itemsPorProducto[item.productId].push(item);
      }
    });

    for (const [productId, items] of Object.entries(itemsPorProducto)) {
      const { data: currentProduct, error: fetchError } = await supabase
        .from('products')
        .select('variante')
        .eq('id', productId)
        .single();

      if (fetchError || !currentProduct) {
        console.error("Error al obtener stock del producto:", fetchError);
        continue;
      }

      let variantes = currentProduct.variante;
      if (typeof variantes === 'string') {
        try { variantes = JSON.parse(variantes); } catch { variantes = []; }
      }

      const variantesActualizadas = variantes.map(v => {
        const itemComprado = items.find(i => String(i.variantId) === String(v.id));
        if (itemComprado) {
          const nuevoStock = Math.max(0, (parseInt(v.stock, 10) || 0) - itemComprado.quantity);
          return { ...v, stock: nuevoStock };
        }
        return v;
      });

      const { error: updateError } = await supabase
        .from('products')
        .update({ variante: variantesActualizadas })
        .eq('id', productId);

      if (updateError) {
        console.error("Error al actualizar stock en la base de datos:", updateError);
      }
    }
  } catch (err) {
    console.error("Error al procesar el descuento de stock:", err);
  }

  let productsListText = '';
  Object.values(cart).forEach((item) => {
    const qty = parseInt(item.quantity, 10) || 0;
    if (qty > 0) {
      const name = item.productName || item.name || 'Dulce';
      const variant = item.variantLabel ? ` (${item.variantLabel})` : '';
      const price = parseFloat(item.price) || 0;
      const totalLine = price * qty;
      productsListText += `• ${qty}x ${name}${variant} - $${totalLine.toLocaleString('es-AR')}\n`;
    }
  });

  let message = `🧁 *Nuevo Pedido - Candela Garbini*\n\n`;
  message += `👤 *Cliente:* ${formData.name}\n`;
  message += `📱 *Celular:* ${formData.phone}\n`;
  message += `📦 *Entrega:* ${formData.deliveryType || 'Retiro en tienda'}\n`;
  message += `💳 *Forma de Pago:* ${formData.paymentMethod}\n`;

  if (formData.paymentMethod === 'Efectivo') {
    const cash = parseFloat(formData.cashAmount) || 0;
    const vuelto = cash - totalPedido;
    message += `💵 *Paga con:* $${cash.toLocaleString('es-AR')}\n`;
    message += vuelto > 0 ? `🪙 *Llevar vuelto de:* $${vuelto.toLocaleString('es-AR')}\n` : `🪙 *Paga justo, no llevar vuelto.*\n`;
  }

  if (formData.notes && formData.notes.trim()) {
    message += `💬 *Notas:* ${formData.notes.trim()}\n`;
  }

  message += `\n🛒 *Detalle del Pedido:*\n${productsListText}\n`;
  message += `💰 *TOTAL A PAGAR:* $${totalPedido.toLocaleString('es-AR')}`;

  const phoneNumber = "543815689490";
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

  // 4. Redirigimos al WhatsApp con el mensaje cargado
  window.open(whatsappUrl, '_blank');
};