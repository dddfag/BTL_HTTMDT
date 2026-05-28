export const handleSetShippingMethodValue = (shippingMethod, setShippingMethodValue) => {
  const methodArr = { standard: 30000, express: 80000, "free shipping": 200000 };

  for (let key in methodArr) {
    if (key === shippingMethod) {
      setShippingMethodValue(methodArr[key]);
    }
  }
};
