import { payloadToString } from "./payloadToString";

export const get = (payload: any) => {
  const paramString = payloadToString(payload);
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  console.log("get", `https://api.1inch.exchange/v1.1/swap?${paramString}`);
  return fetch(`https://api.1inch.exchange/v1.1/swap?${paramString}`, {
    method: "GET",
    headers: headers,
    mode: "cors",
    referrer: "client",
  });
}
