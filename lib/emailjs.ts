import type { ContactFormValues } from "@/lib/validations";

export interface ContactEmailParams extends ContactFormValues {
  reference_id: string;
  time: string;
}

/**
 * Generates a unique Reference ID in the format DU-XXXXXXXX
 */
export function generateReferenceId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "DU-";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Sends contact form details directly to EmailJS from the client
 */
export async function sendContactEmail(data: ContactFormValues): Promise<{ success: boolean; referenceId: string }> {
  const referenceId = generateReferenceId();
  const time = new Date().toLocaleString();

  try {
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      throw new Error("EmailJS environment variables are not fully configured.");
    }

    const templateParams = {
      reference_id: referenceId,
      name: data.name,
      email: data.email,
      type: data.type,
      subject: data.subject,
      message: data.message,
      socialLink: data.socialLink || "Not provided",
      time: time,
    };

    // Dynamically import @emailjs/browser to maintain SSR/Next.js client-safe compilation
    const emailjs = await import("@emailjs/browser");
    
    const result = await emailjs.send(serviceId, templateId, templateParams, publicKey);
    
    if (result.status !== 200) {
      throw new Error(`EmailJS responded with status: ${result.status} - ${result.text}`);
    }

    return { success: true, referenceId };
  } catch (err: any) {
    // Log detailed errors in console only
    console.error("Detailed EmailJS sending error:", err);
    return { success: false, referenceId: "" };
  }
}
