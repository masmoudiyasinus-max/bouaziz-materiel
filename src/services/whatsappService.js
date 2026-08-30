export const WHATSAPP_PHONE = "+216 70 000 000";
export const WHATSAPP_API_PHONE = "21670000000";
export const SHOWROOM_PHONE_ALT = "+216 71 000 000";

export function buildOrderWhatsAppUrl({
  orderRef,
  fullName,
  phone,
  governorate,
  delegation,
  address,
  notes,
  items = [],
  total = 0,
}) {
  const itemsList = Array.isArray(items)
    ? items
        .map(
          (item) =>
            `• ${Number(item?.quantity) || 1}x ${item?.name || "Article"} (${(
              (Number(item?.price) || 0) * (Number(item?.quantity) || 1)
            ).toFixed(2)} DT)`
        )
        .join("\n")
    : "";

  const text =
    `🛒 *NOUVELLE COMMANDE AGRIPRO* (Réf: ${orderRef})\n\n` +
    `👤 *Client:* ${fullName}\n` +
    `📞 *Téléphone:* ${phone}\n` +
    `📍 *Gouvernorat:* ${governorate} — ${delegation}\n` +
    `🏠 *Adresse:* ${address}\n` +
    (notes ? `📝 *Note:* ${notes}\n` : "") +
    `\n📦 *Articles commandés:*\n${itemsList}\n\n` +
    `🚚 *Frais de livraison:* 8.00 DT\n` +
    `💰 *TOTAL À PAYER:* ${Number(total || 0).toFixed(2)} DT\n` +
    `💵 *Mode:* Paiement à la livraison (Espèces)`;

  return `https://wa.me/${WHATSAPP_API_PHONE}?text=${encodeURIComponent(text)}`;
}

export function buildProductWhatsAppUrl({
  title,
  price,
  quantity = 1,
}) {
  const text = `Bonjour AgriPro Matériel, je souhaite commander :\n📦 *${title}*\n💰 Prix: *${Number(price || 0).toFixed(2)} DT*\n🔢 Quantité: *${quantity}*\n🚚 Livraison nationale`;

  return `https://wa.me/${WHATSAPP_API_PHONE}?text=${encodeURIComponent(text)}`;
}


export function buildContactWhatsAppUrl({ name, phone, subject, message }) {
  const text =
    `📩 *NOUVEAU MESSAGE DE CONTACT*\n` +
    `👤 *Nom:* ${name}\n` +
    `📞 *Téléphone:* ${phone}\n` +
    `📌 *Sujet:* ${subject}\n` +
    `💬 *Message:* ${message}`;

  return `https://wa.me/${WHATSAPP_API_PHONE}?text=${encodeURIComponent(text)}`;
}

export function openWhatsApp(url) {
  if (typeof window !== "undefined" && url) {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}