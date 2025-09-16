/**
 * Formats a balance amount with appropriate abbreviations
 * @param {number|string} balance - The balance amount to format
 * @returns {string} Formatted balance with currency symbol
 */
export const formatBalance = (balance) => {
  if (balance === undefined || balance === null) return '$0.00';
  
  const num = typeof balance === 'string' ? parseFloat(balance) : Number(balance);
  if (isNaN(num)) return '$0.00';
  
  const absNum = Math.abs(num);
  
  if (absNum >= 1_000_000) {
    const millions = num / 1_000_000;
    return `$${millions.toFixed(1).replace(/\.0$/, '')}M`;
  }
  
  if (absNum >= 1_000) {
    const thousands = num / 1_000;
    return `$${thousands.toFixed(1).replace(/\.0$/, '')}k`;
  }
  
  return `$${num.toFixed(2)}`;
};

/**
 * Gets the raw numeric value from a formatted balance string
 * @param {string} formattedBalance - The formatted balance string (e.g., "$1.5k")
 * @returns {number} The numeric value
 */
export const parseFormattedBalance = (formattedBalance) => {
  if (!formattedBalance) return 0;
  
  const match = formattedBalance.match(/\$?([\d,.]+)([kKmMbB]?)/);
  if (!match) return 0;
  
  let value = parseFloat(match[1].replace(/,/g, ''));
  const suffix = match[2].toLowerCase();
  
  if (suffix === 'k') value *= 1_000;
  if (suffix === 'm') value *= 1_000_000;
  if (suffix === 'b') value *= 1_000_000_000;
  
  return value;
};
