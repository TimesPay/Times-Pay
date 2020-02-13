import { payloadToString } from "./payloadToString";

export const get = (payload: any) => {
  const paramString = payloadToString(payload);
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  return fetch(`https://api.1inch.exchange/v1.1/swap?${paramString}`, {
    method: "GET",
    credentials: "omit",
    headers: headers,
    mode: "cors",
    referrer: "client",
  });
}
