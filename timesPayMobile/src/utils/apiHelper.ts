import { payloadToString } from "./payloadToString";
import constants from "./constants";

export const get = (payload: any) => {
  const paramString = payloadToString(payload);
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  return fetch(`${constants["dexSiteURL"]}?${paramString}`, {
    method: "GET",
    headers: headers,
    mode: "cors",
    referrer: "client",
  });
}
