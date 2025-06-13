import type { Order, OrderItem } from "./db"

/**
 * Formats an order into a WhatsApp-friendly message
 */
export function formatOrderForWhatsApp(order: Order): string {
  // Create the header with order information
  let message = `*PEDIDO #${order.id.slice(-4)}*\n\n`
  message += `*Cliente:* ${order.clientName}\n`
  message += `*Telefone:* ${order.clientPhone}\n`
  message += `*Data:* ${new Date(order.createdAt).toLocaleString()}\n\n`

  // Add order items
  message += "*ITENS DO PEDIDO:*\n"
  order.items.forEach((item: OrderItem) => {
    message += `• ${item.quantity}x ${item.productName} - R$ ${(item.price * item.quantity).toFixed(2)}\n`
    if (item.observation) {
      message += `   _Obs: ${item.observation}_\n`
    }
  })

  // Add total
  message += `\n*TOTAL: R$ ${order.total.toFixed(2)}*\n\n`

  // Add status
  message += `*Status:* ${getStatusText(order.status)}`

  return encodeURIComponent(message)
}

/**
 * Creates a WhatsApp URL for sharing an order
 */
export function createWhatsAppLink(order: Order, phoneNumber?: string): string {
  // Format the message
  const message = formatOrderForWhatsApp(order)

  // If a phone number is provided, use it, otherwise just open WhatsApp
  const baseUrl = phoneNumber ? `https://wa.me/${phoneNumber.replace(/\D/g, "")}` : "https://wa.me/"

  return `${baseUrl}?text=${message}`
}

/**
 * Get a user-friendly status text
 */
function getStatusText(status: Order["status"]): string {
  switch (status) {
    case "pending":
      return "Pendente"
    case "accepted":
      return "Aceito"
    case "in-progress":
      return "Em Preparo"
    case "ready":
      return "Pronto para Entrega"
    case "delivered":
      return "Entregue"
    default:
      return status
  }
}
