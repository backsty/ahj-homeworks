import visaImg from '../../img/visa.png';
import mastercardImg from '../../img/mastercard.png';
import mirImg from '../../img/mir.png';

export const CARD_PATTERNS = {
  VISA: {
    pattern: /^4/,
    lengths: [13, 16],
    name: 'visa',
  },
  MASTERCARD: {
    pattern: /^5[1-5]/,
    lengths: [16],
    name: 'mastercard',
  },
  MIR: {
    pattern: /^220[0-4]/,
    lengths: [16],
    name: 'mir',
  },
};

export const CSS_CLASSES = {
  CARD_VALIDATOR: 'card-validator',
  CARD_IMAGES: 'card-images',
  CARD_IMAGE: 'card-image',
  CARD_INPUT: 'card-input',
  VALIDATE_BUTTON: 'validate-btn',
  ACTIVE: 'active',
  INVALID: 'invalid',
  VALID: 'valid',
};

export const CARD_IMAGES = {
  visa: visaImg,
  mastercard: mastercardImg,
  mir: mirImg,
};

export const MESSAGES = {
  VALID_CARD: 'Номер карты валиден',
  INVALID_CARD: 'Неверный номер карты',
  UNKNOWN_TYPE: 'Неизвестный тип карты',
};

export const INPUT_RESTRICTIONS = {
  MAX_LENGTH: 19,
  CHUNK_SIZE: 4,
};