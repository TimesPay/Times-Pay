export function fetcher(url: string, option?: any) {
  return fetch(url, option).then(r => r.json());
}

export const defaultOption = {
  method: "GET",
  mode: "cors",
  headers: {
    "Content-Type": "application/json"
  }
}
