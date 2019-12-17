export const getInitState = store => {
  console.log("getInitState", store);
  return store.initReducer;
};

export const getExchangeState = store => {
  console.log("getExchangeState", store);
  return store.exchangeReducer;
};

export const getDepositState = store => {
  console.log("getDepositState", store);
  return store.depositReducer;
};

export const getPayState = store => {
  console.log("getPayState", store);
  return store.payReducer;
};
