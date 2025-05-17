/**
 * Pi digits management module
 * Handles fetching, storing, and retrieving pi digits
 */

const PiDigits = (function() {
  // Initial state
  let digits = [];
  let maxDigits = 5000;
  let isLoading = false;
  let currentLoadedCount = 0;
  
  // Preloaded first 1000 digits of Pi for instant start
  const initialPiDigits = "3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989";
  
  // Initialize with first 1000 digits
  function init() {
    digits = initialPiDigits.split('').filter(char => char !== '.');
    currentLoadedCount = 1000;
    return Promise.resolve(currentLoadedCount);
  }
  
  // Simulate loading more digits (in a real app, this would fetch from an API)
  function loadMoreDigits(targetCount = maxDigits) {
    if (isLoading || currentLoadedCount >= targetCount) {
      return Promise.resolve(currentLoadedCount);
    }
    
    isLoading = true;
    
    // In a real implementation, this would fetch from an API
    // For now we're generating pseudo-random digits
    return new Promise((resolve) => {
      setTimeout(() => {
        const digitsToAdd = targetCount - currentLoadedCount;
        
        // Generate pseudo-random digits (not actual pi digits beyond 1000)
        for (let i = 0; i < digitsToAdd; i++) {
          digits.push(Math.floor(Math.random() * 10).toString());
        }
        
        currentLoadedCount = targetCount;
        isLoading = false;
        resolve(currentLoadedCount);
      }, 1500); // Simulate network delay
    });
  }
  
  // Get specific digit
  function getDigit(index) {
    return index < digits.length ? digits[index] : null;
  }
  
  // Get a range of digits
  function getDigits(start, count) {
    return digits.slice(start, start + count);
  }
  
  // Get all currently loaded digits
  function getAllDigits() {
    return [...digits];
  }
  
  // Get current count of loaded digits
  function getCount() {
    return currentLoadedCount;
  }
  
  // Check if loading is in progress
  function isLoadingDigits() {
    return isLoading;
  }
  
  // Public API
  return {
    init,
    loadMoreDigits,
    getDigit,
    getDigits,
    getAllDigits,
    getCount,
    isLoadingDigits
  };
})();