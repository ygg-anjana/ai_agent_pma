import { PassPayload } from "../types";

// The Google Apps Script Web App URL provided by the user.
// Note: The /a/ path indicates this is an organization-restricted deployment.
const APPS_SCRIPT_URL = "https://script.google.com/a/macros/yougotagift.com/s/AKfycbwXz5kh2JXBF7msDeC7coZ3Xat5qN0xsiGXqmKCP89FGip6cvJpdt5_BTe7b3WrNgT_/exec";

/**
 * Sends the passing result to the Google Apps Script backend.
 * 
 * Strategy:
 * 1. Use 'text/plain' to avoid CORS preflight (OPTIONS requests).
 * 2. Send the payload as a JSON string in the body.
 * 3. This allows the backend to access 'e.postData.contents' and JSON.parse() it directly.
 */
export const sendResultToSlack = async (payload: PassPayload) => {
  // Append timestamp to bypass browser cache
  const url = `${APPS_SCRIPT_URL.trim()}?t=${Date.now()}`;
  
  console.log("Transmitting payload to Google Apps Script (JSON/Text mode)...", payload);

  await fetch(url, {
    method: "POST",
    mode: "no-cors", // Opaque response
    cache: "no-cache",
    credentials: "include", // Required for /a/ domain scripts to authenticate the user
    headers: { 
      // Using text/plain prevents the browser from sending a CORS preflight options request,
      // which Google Apps Script often fails to handle.
      "Content-Type": "text/plain;charset=utf-8" 
    },
    body: JSON.stringify(payload),
  });

  return { status: 0, text: "Transmission sent (opaque response)" };
};