import { StyleSheet } from 'react-native';
import _mapKeys from 'lodash.mapkeys';
import _get from 'lodash.get';
import _padStart from 'lodash.padstart';
import createProxyPolyfill from 'proxy-polyfill/src/proxy';
//
import defaultStrategy from './strategy';
import getDialStyle from './dial';

const Proxy = createProxyPolyfill();

const spaces = Object.values(defaultStrategy.aliases);

const isSpace = new RegExp(`^(${spaces.join('|')})$`);
const isSpaceArray = /^(margin|padding)$/;
const isDial = /^(row|col)([1-9])$/;
const splitProp = /^([a-zA-Z]+)(\d+)$/;

export default class SpaceSheet {
  sizes = [];
  strategy = {};
  shorthands = [];

  styleProxy = null;
  sheetProxy = null;

  constructor(strategy) {
    let spacing;

    if (typeof strategy === 'number') {
      spacing = strategy;
      strategy = null;
    }

    this.strategy = strategy || defaultStrategy;

    if (spacing) {
      this.setSpacing(spacing);
    }
  }

  get styles() {
    if (!this.styleProxy) {
      this.styleProxy = new Proxy(this.createCache(), { get: this._getStyle });
    }

    return this.styleProxy;
  }

  get sheets() {
    if (!this.sheetProxy) {
      this.sheetProxy = new Proxy(this.createCache(), { get: this._getSheet });
    }

    return this.sheetProxy;
  }

  /**
   * Limitation of Proxy polyfill (https://github.com/GoogleChrome/proxy-polyfill)
   *
   * "This means that the properties you want to proxy *must be known at creation time*."
   *
   * Hence we need this method to generate all possible Proxy keys:
   * mb1, pv2, m202, p1030, etc...
   */
  createCache() {
    const shorthands = this.getSizeShorthands();
    const cache = {};

    Object.keys(this.strategy.aliases).forEach(alias => {
      shorthands.forEach(shorthand => {
        cache[`${alias}${shorthand}`] = false;
      });
    });

    for (let dial = 1; dial < 10; dial++) {
      cache[`row${dial}`] = false;
      cache[`col${dial}`] = false;
    }

    return cache;
  }

  /**
   * Generates all possible shorthands combinations:
   * 0001, 0002, ..., 0025, 0030, ..., 0455, 0500, ..., 5554, 5555.
   */
  getSizeShorthands() {
    if (!this.shorthands.length) {
      const total = Math.pow(this.sizes.length, 4);

      let count = 0;

      for (let i = 0; i < total; i++) {
        const rebased = count.toString(this.sizes.length);

        this.shorthands.push(rebased, _padStart(rebased, 4, '0'));

        count++;
      }
    }

    return this.shorthands;
  }

  setSizes(sizes) {
    this.shorthands = [];
    this.styleProxy = null;
    this.sheetProxy = null;
    this.sizes = sizes;
  }

  setSpacing(amount, range = 5) {
    const sizes = [];

    for (let index = 1; index <= range; index++) {
      sizes.push(this.strategy.nextSize(amount, index, range));
    }

    sizes.unshift(0);

    this.setSizes(sizes);
  }

  getStyle({ ...style }) {
    Object.keys(style)
      .filter(name => isSpace.test(name))
      .forEach(name => {
        const val = style[name];

        if (Array.isArray(val)) {
          Object.assign(style, this._getArrayStyle(val, name));

          delete style[name];
        } else {
          style[name] = this._getSize(val);
        }
      });

    return style;
  }

  _getStyle = (cache, prop) => {
    let style = cache[prop];

    if (style) return style;

    let result;

    result = isDial.exec(prop);

    // Is dial?
    if (result) {
      const [, dialType, dial] = result;

      if (dialType === 'col') {
        return getDialStyle('column', dial);
      }

      return getDialStyle('row', dial);
    }

    result = splitProp.exec(prop);

    if (!result) return; // undefined

    const [, alias, size] = result;

    const unalias = this.strategy.aliases[alias];
    const isAlias = typeof unalias !== 'undefined';
    const isSize = size.length === 1;
    const isSizes =
      size.length > 1 && size.length <= 4 && isSpaceArray.test(unalias);

    if (isAlias && (isSize || isSizes)) {
      style = cache[prop] = this._getAliasStyle(alias, size);

      return style;
    }

    // return undefined;
  };

  _getSheet = (cache, prop) => {
    let sheet = cache[prop];

    if (!sheet) {
      const style = this.styles[prop];

      if (!style) return; // undefined

      sheet = cache[prop] = StyleSheet.create({ [prop]: style });
    }

    return sheet[prop];
  };

  _getAliasStyle(alias, size) {
    const unalias = this.strategy.aliases[alias];

    return this.getStyle({
      [unalias]: size.length > 1 ? size.split('') : Number(size),
    });
  }

  _getArrayStyle(arr, type) {
    const sizes = arr.map(val => this._getSize(val));

    let sides = {};

    switch (sizes.length) {
      case 2:
        sides = {
          Vertical: sizes[0],
          Horizontal: sizes[1],
        };
        break;

      case 3:
        sides = {
          Top: sizes[0],
          Horizontal: sizes[1],
          Bottom: sizes[2],
        };
        break;

      case 4:
        sides = {
          Top: sizes[0],
          Right: sizes[1],
          Bottom: sizes[2],
          Left: sizes[3],
        };
        break;

      default:
        break;
    }

    return _mapKeys(sides, (size, side) => `${type}${side}`);
  }

  _getSize(val) {
    return _get(this.sizes, val, val);
  }
}
