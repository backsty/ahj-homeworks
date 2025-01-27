export default class CoordinatesParser {
  static parse(input) {
    input = input.replace(/[\[\]]/g, '');
    input = input.replace(/[\u2212\u2013\u2014]/g, '-');
    const coords = input.split(',').map(c => c.trim());

    if (coords.length !== 2) {
      throw new Error('Invalid coordinates format');
    }

    const lat = parseFloat(coords[0]);
    const lng = parseFloat(coords[1]);

    if (isNaN(lat) || isNaN(lng)) {
      throw new Error('Coordinates must be numbers');
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      throw new Error('Координаты вне допустимого диапазона');
    }

    return { lat, lng };
  }
}
