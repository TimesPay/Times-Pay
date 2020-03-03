import constants from "../utils/constants";

export const fetchCurrencyData = (payload: {
  from: string,
  to:string
}) => {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  return fetch(`${constants["currencySiteURL"]}/${payload.from}`, {
    method: "GET",
    headers: headers,
    mode: "cors",
    referrer: "client",
  })
  .then(res=>{
    let response:any = res.json();
    console.log("fetchCurrencyData", payload, response);
    return response;
  });
}
