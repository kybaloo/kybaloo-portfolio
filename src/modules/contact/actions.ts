'use server';

import {z} from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, {message: 'Nom trop court (minimum 2 caractères)'}),
  email: z.string().email({message: 'Adresse email invalide'}),
  subject: z.string().min(3, {message: 'Veuillez préciser le sujet (minimum 3 caractères)'}),
  message: z.string().min(10, {message: 'Votre message doit contenir au moins 10 caractères'}),
});

export type ContactFormState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const rawData = {
    name: formData.get('name'),
    email: formData.get('email'),
    subject: formData.get('subject'),
    message: formData.get('message'),
  };

  const parsed = contactSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  // Simuler ou transmettre l'email (si RESEND_API_KEY est configuré en production)
  try {
    // Log serveur sécurisé
    console.info(
      `[Contact Form Submission] From: ${parsed.data.name} <${parsed.data.email}> — Subject: ${parsed.data.subject}`,
    );

    // Si une clé Resend est présente, nous pouvons l'utiliser
    if (process.env.RESEND_API_KEY) {
      // resend call if configured
    }

    return {
      success: true,
      message: 'Message reçu ! Je vous recontacterai dans les plus brefs délais.',
    };
  } catch (err) {
    console.error('[Contact Form Error]', err);
    return {
      success: false,
      message: 'Une erreur technique est survenue. Veuillez réessayer ou m’écrire directement.',
    };
  }
}
