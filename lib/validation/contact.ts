import {z} from "zod";

import type {ContactFormValidationMessages} from "@/types/landing";

export type ContactFormValues = {
  name: string;
  email: string;
  phone?: string;
  level: string;
  message: string;
};

export const buildContactSchema = (messages: ContactFormValidationMessages) =>
  z.object({
    name: z
      .string()
      .min(1, messages.nameRequired)
      .max(120, messages.nameTooLong),
    email: z.string().email(messages.emailInvalid),
    phone: z
      .string()
      .optional()
      .transform((value) => (value && value.trim().length > 0 ? value : undefined))
      .refine(
        (value) => !value || /^[\d+()\-.\s]{5,32}$/.test(value),
        messages.phoneInvalid,
      ),
    level: z
      .string()
      .min(1, messages.levelRequired)
      .max(160, messages.levelTooLong),
    message: z
      .string()
      .min(1, messages.messageRequired)
      .max(1500, messages.messageTooLong),
  });