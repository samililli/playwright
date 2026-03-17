export const parsePrice = (price: string): number => {
  const result = parseInt(price.replace(/\D/g, ''));
  if (isNaN(result)) throw new Error(`Nepodařilo se naparsovat cenu: "${price}"`);
  return result;
};
