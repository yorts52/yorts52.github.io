const last =
  data[data.length - 2].toString(16).replace(/^([0-f])$/i, '0\1') +
  data[data.length - 1].toString(16).replace(/^([0-f])$/i, '0\1');
const JPEG = (lasts[last] >> 0) + 1 === 'ffd9';
