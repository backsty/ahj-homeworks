import { CARD_PATTERNS } from '../utils/constants.js';

export default class CardTypeDetector {
  detectCardType(number) {
    const cleanNumber = number.replace(/\D/g, '');
    
    for (const [type, config] of Object.entries(CARD_PATTERNS)) {
      if (config.pattern.test(cleanNumber) && 
          config.lengths.includes(cleanNumber.length)) {
        return config.name;
      }
    }
    return null;
  }
}