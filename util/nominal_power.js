export const calculateNominalPower = (area) => {
  const wattagePerMeter = 150; // values taken from seemingly reputable

  return wattagePerMeter * area * .001;
};
