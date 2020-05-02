import { BaseURL } from './APIConfig';
export function fetcher(url: string, option?: any) {
  if(option && typeof url == "string"){
    if(option.params){
      let newURL = new URL(url, BaseURL);
      let paramKey = Object.keys(option.params);
      for(let key in paramKey) {
        newURL.searchParams.set(paramKey[key], option.params[paramKey[key]]);
      }
      url = newURL.toString();
    }
  }
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
