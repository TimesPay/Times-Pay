import _zipObject from 'lodash.zipobject';

const spacings = {
  m: 'margin',
  p: 'padding',
};

const sides = {
  '': '',
  t: 'Top',
  r: 'Right',
  b: 'Bottom',
  l: 'Left',
  v: 'Vertical',
  h: 'Horizontal',
};

const aliases = buildAliases(spacings, sides);

export default {
  aliases,

  // "Double" spacing
  nextSize(spacing, index) {
    return spacing * Math.pow(2, index - 1);
  },
};

export function buildAliases(spacings, sides) {
  const keys = buildNames(Object.keys(spacings), Object.keys(sides));
  const vals = buildNames(Object.values(spacings), Object.values(sides));

  return _zipObject(keys, vals);
}

function buildNames(spacings, sides) {
  const names = spacings.map(spacing => sides.map(side => `${spacing}${side}`));

  return names[0].concat(names[1]);
}
