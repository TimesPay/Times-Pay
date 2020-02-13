export const payloadToString = (payload: any) => {
  let payloadString = "";
  for (let param in payload) {
    payloadString += `${param}=${payload[param]}&`
  };
  return payloadString.slice(0, payloadString.length -1);
}
