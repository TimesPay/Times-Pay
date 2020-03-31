import { BaseURL } from './APIConfig';
export function fetcher(url: string, option?: any) {
  return fetch(url, option).then(r => r.json());
}

export function serverFetcher(url: string, option?: any) {
  let fetch = require("node-fetch");
  return fetch(BaseURL+url, option).then(r => r.json());
}

export const defaultOption = {
  method: "GET",
  mode: "cors",
  headers: {
    "Content-Type": "application/json"
  }
}
