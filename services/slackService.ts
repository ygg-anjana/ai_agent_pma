import { PassPayload } from "../types";

// The Google Apps Script Web App URL provided by the user.
// The /a/ path indicates this is an organization-restricted deployment.
const APPS_SCRIPT_URL = "https://script.google.com/a/macros/yougotagift.com/s/AKfycbwXz5kh2JXBF7msDeC7coZ3Xat5qN0xsiGXqmKCP89FGip6cvJpdt5_BTe7b3WrNgT_/exec";

/**
 * Sends the passing result to the Google Apps Script backend.
 */
export const sendResultToSlack = async (payload: PassPayload) => {
  // 1. Sanitize URL
  const url = `${APPS_SCRIPT_URL.trim()}?t=${Date.now()}`;
  
  console.log("Transmitting payload to Google Apps Script...", payload);

  // 2. Prepare payload
  // We send as JSON stringified in the body.
  // We use text/plain to avoid CORS preflight, which GAS often rejects.
  const body = JSON.stringify(payload);

  try {
    await fetch(url, {
      method: "POST",
      mode: "no-cors", // Required for GAS Web Apps called from client-side
      cache: "no-cache",
      credentials: "include", // Essential for /a/ (org-restricted) scripts to identify the user
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: body,
    });

    // Since mode is no-cors, we get an opaque response (status 0).
    // We assume success if no network error was thrown.
    return { status: 0, text: "Transmission sent (opaque)" };
    
  } catch (error: any) {
    console.error("Slack Service Transmission Error:", error);
    throw error;
  }
};