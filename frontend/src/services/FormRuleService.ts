import { DateService } from "./DateService";
import type { FormRule } from "@/interfaces/Auth";
import { useCookies } from "@vueuse/integrations/useCookies";

// Initialize cookies instance for reuse
const cookies = useCookies();

export class FormRuleService {
  // Define reusable email validation rules
  static emailRules: FormRule[] = [
    (value: string) => {
      // Check if the email field is not empty
      if (value) return true;
      return "E-mail is required.";
    },
    (value: string) => {
      // Validate email format using a simple regex
      if (/.+@.+\..+/.test(value)) return true;
      return "It is not a valid email.";
    },
  ];

  // Define reusable password validation rules
  static passwordRules: FormRule[] = [
    (value: string) => {
      // Check if the password field is not empty
      if (value) return true;
      return "Password is required.";
    },
    (value: string) => {
      // Ensure the password is at least 8 characters long
      if (value?.length >= 8) return true;
      return "Password must be greater than 8 characters.";
    },
  ];

  /**
   * Sets a cookie with an expiration date.
   * @param name - The name of the cookie.
   * @param value - The value to store in the cookie.
   * @param expires_at - Unix timestamp for the cookie's expiration.
   */
  static setCookie(name: string, value: string, expires_at: number | null = null): void {
    // Convert the Unix timestamp to a Date object
    const date = expires_at ? DateService.unixToDate(expires_at, true) : null;

    // Set the cookie with the expiration date
    cookies.set(name, value, {
      expires: date instanceof Date ? date : undefined,
    });
  }

  /**
   * Retrieves the value of a cookie by its name.
   * @param name - The name of the cookie to retrieve.
   * @returns The value of the cookie, or undefined if not found.
   */
  static getCookie(name: string): string {
    return cookies.get(name);
  }
}
