import emailjs from '@emailjs/browser'

/** Port implementation: sends the form fields (user_email, user_nombre, user_motivo, message) via EmailJS. */
export type ContactSender = (form: HTMLFormElement) => Promise<unknown>

const SERVICE_ID = 'service_7uu73vr'
const TEMPLATE_ID = 'template_f3fn78p'
const PUBLIC_KEY = 'IL-G6_SY4KHMiCCqM'

export const sendWithEmailJs: ContactSender = (form) =>
  emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form, PUBLIC_KEY)
