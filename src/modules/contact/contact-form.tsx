'use client';

import {useActionState} from 'react';
import {useTranslations} from 'next-intl';
import {submitContactForm, type ContactFormState} from './actions';

const initialState: ContactFormState = {
  success: false,
};

export function ContactForm() {
  const t = useTranslations('contact');
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState);

  return (
    <div className="rounded-sm border border-line bg-paper/60 p-6 sm:p-8">
      <div className="mb-6 flex items-center justify-between border-b border-line/60 pb-4">
        <h3 className="font-serif text-xl text-ink sm:text-2xl">{t('formTitle')}</h3>
        <span className="font-mono text-xs text-muted">[FORM_SECURE]</span>
      </div>

      {state.success ? (
        <div className="rounded-sm border border-emerald-500/30 bg-emerald-500/10 p-5 text-emerald-800 dark:text-emerald-300">
          <div className="mb-2 flex items-center gap-2 font-mono text-xs font-semibold uppercase">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Succès / Success
          </div>
          <p className="font-sans text-sm leading-relaxed">{t('formSuccess')}</p>
        </div>
      ) : (
        <form action={formAction} className="space-y-5">
          {state.message && (
            <div className="rounded-sm border border-red-500/30 bg-red-500/10 p-3 font-mono text-xs text-red-700 dark:text-red-400">
              {state.message}
            </div>
          )}

          {/* Name Field */}
          <div>
            <label htmlFor="name" className="mb-1.5 block font-mono text-xs text-muted uppercase">
              {t('formName')} <span className="text-accent">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              disabled={isPending}
              placeholder={t('formNamePlaceholder')}
              className="w-full rounded-sm border border-line bg-paper px-3.5 py-2.5 font-sans text-sm text-ink transition-colors placeholder:text-muted/60 focus:border-accent focus:outline-hidden"
            />
            {state.errors?.name && (
              <p className="mt-1 font-mono text-xs text-red-600 dark:text-red-400">
                {state.errors.name[0]}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="mb-1.5 block font-mono text-xs text-muted uppercase">
              {t('formEmail')} <span className="text-accent">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              disabled={isPending}
              placeholder={t('formEmailPlaceholder')}
              className="w-full rounded-sm border border-line bg-paper px-3.5 py-2.5 font-sans text-sm text-ink transition-colors placeholder:text-muted/60 focus:border-accent focus:outline-hidden"
            />
            {state.errors?.email && (
              <p className="mt-1 font-mono text-xs text-red-600 dark:text-red-400">
                {state.errors.email[0]}
              </p>
            )}
          </div>

          {/* Subject Field */}
          <div>
            <label
              htmlFor="subject"
              className="mb-1.5 block font-mono text-xs text-muted uppercase"
            >
              {t('formSubject')} <span className="text-accent">*</span>
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              required
              disabled={isPending}
              placeholder={t('formSubjectPlaceholder')}
              className="w-full rounded-sm border border-line bg-paper px-3.5 py-2.5 font-sans text-sm text-ink transition-colors placeholder:text-muted/60 focus:border-accent focus:outline-hidden"
            />
            {state.errors?.subject && (
              <p className="mt-1 font-mono text-xs text-red-600 dark:text-red-400">
                {state.errors.subject[0]}
              </p>
            )}
          </div>

          {/* Message Field */}
          <div>
            <label
              htmlFor="message"
              className="mb-1.5 block font-mono text-xs text-muted uppercase"
            >
              {t('formMessage')} <span className="text-accent">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              disabled={isPending}
              placeholder={t('formMessagePlaceholder')}
              className="w-full resize-y rounded-sm border border-line bg-paper px-3.5 py-2.5 font-sans text-sm text-ink transition-colors placeholder:text-muted/60 focus:border-accent focus:outline-hidden"
            />
            {state.errors?.message && (
              <p className="mt-1 font-mono text-xs text-red-600 dark:text-red-400">
                {state.errors.message[0]}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex w-full items-center justify-center rounded-sm bg-ink px-6 py-3 font-sans text-sm font-medium text-paper transition-all hover:bg-ink/85 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {isPending ? (
                <>
                  <svg
                    className="mr-2 -ml-1 h-4 w-4 animate-spin text-paper"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {t('formSending')}
                </>
              ) : (
                <>
                  {t('formSubmit')}
                  <svg
                    className="ml-2 h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
