/** Opens a chat with `number` (international format without "+") with `text` already typed in. */
export const whatsappUrl = (number: string, text: string): string =>
  `https://wa.me/${number}?text=${encodeURIComponent(text)}`
