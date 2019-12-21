# react-native-spacesheet

Consistent margin/padding React Native styles.

<img src="spaceship.jpg" />

## Installation

```
$ yarn add react-native-spacesheet
```

## Basic Usage

```js
import SpaceSheet from 'react-native-spacesheet';

const space = new SpaceSheet();

space.setSizes([0, 5, 10, 20, 40]);

space.sheets.mb0; // --> RN style = { marginBottom: 0 }
space.sheets.pv2; // --> RN style = { paddingVertical: 10 }
space.sheets.p34; // --> RN style = { paddingVertical: 20, paddingHorizontal: 40 }
// ...
```

## Recommended Usage

```js
// src/styles/space.js
import SpaceSheet from 'react-native-spacesheet';

const space = new SpaceSheet();

space.setSpacing(5);

export const s = space.styles;
export const ss = space.sheets;

export default space;
```

```js
// src/components/foo.js
import { s, ss } from 'src/styles/space';

// "A box with padding = 10, containing another box with margin horizontal = 40"
export function Foo() {
  return (
    <View style={ss.p2}>
      <View style={styles.container} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...s.row8,
    ...s.mh4,
  },
});
```

## `Proxy` polyfill

React Native does not support [`Proxy`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) object.

Since [`proxy-polyfill`](https://github.com/GoogleChrome/proxy-polyfill) does not support the creation of new properties on `target` proxied object, we need to generate all possible `target` keys before creating the (polyfilled) `Proxy`.

This is not ideal but that's a good enough workaround until React Native supports `Proxy`.

_Note_: This package forces the use of `proxy-polyfill` for consistency accross different environments (simulator, device, remote debugging, iOS, Android, etc...).

### Why keeping the `Proxy` implementation then?

1. Minimum code to remove when RN will support `Proxy`
2. Only keys are generated, not the actual styles computation (still proxied/on-the-fly)

## Sizes "à la Bootstrap v4"

Margin and padding sizes are inspired by [Bootstrap v4 spacing utility system](https://getbootstrap.com/docs/4.0/utilities/spacing/).

Meaning that you don't pass the actual size value to your styles, but its index instead:

```js
const space = new SpaceSheet();

space.setSizes([0, 5, 10, 20, 40]);
//             [0, 1,  2,  3, 4] // Corresponding indexes...

space.getStyle({
  marginTop: 3, // --> size = 20
  paddingHorizontal: 1, // --> size = 5
});
```

This helps you keep a consistent spacing strategy in your React Native project.

## Shorthand notation

You can pass an `array` of sizes to `margin` & `padding` style properties only. Shorthand notation works exactly like in CSS.

```js
// sizes = [0, 5, 10, 20, 40]

{ ...space.styles.m202 }

style={space.sheets.p2002}

{ ...space.styles.ph12 } // Ignored

// - OR -

space.getStyle({
  margin: [2, 0, 2], // --> Top = 10, Horizontal = 0, Bottom = 10
  padding: [2, 0, 0, 2], // --> Top = 10, Right = 0, Bottom = 0, Left = 10
  paddingHorizontal: [1, 2], // Will be ignored
  marginTop: [2], // Will be ignored
});
```

## Spacing `strategy`

You can pass a "spacing strategy" to your `SpaceSheet` instance.

Here is the [default strategy](https://github.com/eightyfive/react-native-spacesheet/blob/master/strategy.js) for instance:

```js
export default {
  aliases: {
    m: 'margin',
    mt: 'marginTop',
    // ...
    p: 'padding',
    pt: 'paddingTop',
    // ...
  },

  // "Double" spacing
  nextSize(spacing, index, range) {
    return spacing * Math.pow(2, index);
  },
};
```

### `strategy.aliases`

Must contain a simple map of aliases mapping to their actual valid style property name.

The default strategy exposes a `buildAliases` helper to facilitate aliases creation:

```js
import { buildAliases } from 'react-native-spacesheet/strategy';

const spacings = {
  Mar: 'margin',
  Pad: 'padding',
};

const sides = {
  '': '',
  T: 'Top',
  R: 'Right',
  B: 'Bottom',
  L: 'Left',
  V: 'Vertical',
  H: 'Horizontal',
};

const aliases = buildAliases(spacings, sides);

// --> { MarR: 'marginRight', ..., PadV: 'paddingVertical', ... }
```

### `strategy.nextSize`

This method is used to calculate the next size, when using [`SpaceSheet.setSpacing`](#setspacingint-amount-int-range--5) API method.

## API

### `sheets` (Proxy)

The `sheets` property is exposed as a [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy), meaning aliased RN sheet will be created (and cached) on-demand.

```js
<View style={space.sheets.mb0} />
```

### `styles` (Proxy)

The `styles` property is exposed as a [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy), meaning aliased plain style will be created (and cached) on-demand.

```js
<View style={styles.container} />;

const styles = StyleSheet.create({
  container: {
    ...space.styles.p3,
    flex: 3,
    flexDirection: 'column-reverse',
    // ...
  },
});
```

### `setSizes(array sizes)`

This is the simplest way to set sizes and their corresponding index.

```js
space.setSizes([4000, 400, 40, 4, 0]);
```

### `setSpacing(int amount, int range = 5)`

This is an alternative way to set sizes and their corresponding index:

```js
// (With default strategy)
space.setSpacing(4);

// --> space.sizes = [0, 4, 8, 16, 32, 64]
//      indexes... = [0, 1, 2,  3,  4, 5]
```

_Note_: `setSpacing` always prepend the value `0` to the result. If you do not want this behavior, use [`setSizes`](#setsizesarray-sizes) instead.

`amount`, the current size `index` (starting at `= 1`!) & `range` are passed to your `strategy.nextSize` method:

```js
  setSpacing(amount, range = 5) {
    this.sizes = [];

    for (let index = 1; index <= range; index++) {
      this.sizes.push(this.strategy.nextSize(amount, index, range));
    }

    this.sizes.unshift(0);
  }
```

#### Spacing strategy examples

```js
// "Double" strategy (default)
strategy.nextSize = (amount, index) => amount * Math.pow(2, index - 1);
space.setSpacing(4, 8);
// -> [0, 4, 8, 16, 32, 64, 128, 256, 512]

// "Linear" strategy
strategy.nextSize = (amount, index) => amount * index;
space.setSpacing(10, 10);
// -> [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

// "Offset" strategy
strategy.nextSize = (amount, index) => amount * index + 30;
space.setSpacing(2, 3);
// -> [0, 32, 34, 36]

// Equivalent strategies
strategy.nextSize = (amount, index, range) => amount * index * range;
space.setSpacing(5, 4);
// -> [0, 20, 40, 60, 80]

strategy.nextSize = (amount, index) => amount * index;
space.setSpacing(20, 4);
// -> [0, 20, 40, 60, 80] (Same as above)
```

### `getStyle`

You can use this method to directly process all sizes without creating the actual RN style.

This is helpful when using with `StyleSheet.create` in the footer of your components:

```js
// src/components/foo.js

// Everything <Foo />...

// sizes = [0, 1, 80, 3]

StyleSheet.create({
  container: space.getStyle({
    marginTop: 2, // --> Will be processed as "80"
    flex: 3,
    flexDirection: 'row',
    // ...
  }),
});
```

## Col / Row – "dial"

You can also specify quick flexbox styles thanks to the magic "dial" properties:

```js
space.sheets.row5;
space.styles.col8;
// ...
```

`(row|col)` gives the main axis direction, while the following `[1-9]` number specifies the [dial number](https://github.com/eightyfive/react-native-col) to align/justify the children against.

See more information about the "dial" shorthand syntax in the [react-native-col](https://github.com/eightyfive/react-native-col) project documentation.

## Credits

- [Aleut CSS](http://aleutcss.github.io/documentation/utilities-spacing/) for the initial idea
- [`react-native-row`](https://github.com/hyrwork/react-native-row/pull/13) for getting me started
- [Bootstrap v4](https://getbootstrap.com/docs/4.0/utilities/spacing/) for the awesome "Size index" idea
