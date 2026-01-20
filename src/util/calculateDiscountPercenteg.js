


// const calculatedDiscountPercentage = (mrpPrice, sellingPrice) => {
//   if (!mrpPrice || !sellingPrice) return 0;

//   return Math.round(
//     ((mrpPrice - sellingPrice) / mrpPrice) * 100
//   );
// };

// module.exports = {
//   calculatedDiscountPercentage
// };


// const calculatedDiscountPercentage = (mrpPrice, sellingPrice) => {
//   if (!mrpPrice || !sellingPrice) return 0;

//   return Math.round(
//     ((mrpPrice - sellingPrice) / mrpPrice) * 100
//   );
// };

// module.exports = calculatedDiscountPercentage; // ✅ export function directly



const calculatedDiscountPercentage = (mrpPrice, sellingPrice) => {
  if (!mrpPrice || !sellingPrice) return 0;

  return Math.round(
    ((mrpPrice - sellingPrice) / mrpPrice) * 100
  );
};

module.exports = calculatedDiscountPercentage;
