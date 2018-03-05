export const calculateNominalPower = (area) => {
  const efficiency = .22; // found solar panels this efficient under standard test conditions

  return efficiency * (area * 1.0) * .001;
};
