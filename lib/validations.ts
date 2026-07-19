import { z } from "zod";

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be under 100 characters"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(255, "Email must be under 255 characters"),
  type: z.enum(
    ["general", "collaboration", "sponsorship", "partnership", "technical", "community"],
    {
      message: "Please select a contact type",
    }
  ),
  subject: z
    .string()
    .min(3, "Subject must be at least 3 characters")
    .max(200, "Subject must be under 200 characters"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be under 2000 characters"),
  socialLink: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const loginFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password must be under 128 characters"),
  remember: z.boolean().optional(),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

export const newsletterSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(255, "Email must be under 255 characters"),
});

export type NewsletterValues = z.infer<typeof newsletterSchema>;
