# easy-mca

Module for using [multiple correspondence analysis](https://en.wikipedia.org/wiki/Multiple_correspondence_analysis) to project categorical data into lower dimensional spaces for visualization and exploration.  Consider this a work in progress.

## Example

```js
import MCA from 'easy-mca'

// See test folder for data
const wines = require('wines.json')

console.log(MCA(wines, {
    'expert1:fruity': [ true, false ],
    'expert1:woody': [ 1, 2, 3 ],
    'expert2:fruity': [ true, false ],
    'expert2:roasted': [ true, false ],
    'expert2:vanillin': [ 1, 2, 3 ],
    'expert2:woody': [ true, false ],
    'expert3:fruity': [ true, false ],
    'expert3:buttery': [ true, false ],
    'expert3:woody': [ true, false ],
    'oak': [1, 2]
}, {
  correction: true
}))
```

**Output**

```js
{
  columnFactors: [
    {
      'expert1:fruity': { true: 0.9010312996574121, false: -0.9010312996574116 },
      'expert1:woody': { '1': -0.9655726066390998, '3': 0.9655726066390999 },
      'expert2:fruity': { true: 0.9010312996574116, false: -0.9010312996574116 },
      'expert2:roasted': { true: -0.9010312996574116, false: 0.9010312996574116 },
      'expert2:vanillin': { '1': -0.9655726066390997, '3': 0.9655726066390999 },
      'expert2:woody': { true: -0.9010312996574116, false: 0.9010312996574116 },
      'expert3:fruity': { true: 0.2791261014283348, false: -0.2791261014283348 },
      'expert3:buttery': { true: -0.9010312996574116, false: 0.9010312996574116 },
      'expert3:woody': { true: -0.9010312996574116, false: 0.9010312996574116 },
      oak: { '1': 0.9010312996574116, '2': -0.9010312996574116 }
    },
    {
      'expert1:woody': {
        '1': -0.17568209223157732,
        '2': 0.3513641844631537,
        '3': -0.17568209223157663
      },
      'expert2:vanillin': {
        '1': -0.1756820922315771,
        '2': 0.3513641844631537,
        '3': -0.17568209223157663
      }
    },
    {
      'expert1:fruity': { true: -0.0028969531385564006, false: 0.00289695313855638 },
      'expert1:woody': { '1': -0.023889181564526515, '3': 0.023889181564526536 },
      'expert2:fruity': { true: -0.0028969531385563915, false: 0.0028969531385563915 },
      'expert2:roasted': { true: 0.0028969531385563915, false: -0.0028969531385563915 },
      'expert2:vanillin': { '1': -0.02388918156452648, '3': 0.023889181564526536 },
      'expert2:woody': { true: 0.0028969531385563915, false: -0.0028969531385563915 },
      'expert3:fruity': { true: -0.04472506940078271, false: 0.04472506940078271 },
      'expert3:buttery': { true: 0.0028969531385563915, false: -0.0028969531385563915 },
      'expert3:woody': { true: 0.0028969531385563915, false: -0.0028969531385563915 },
      oak: { '1': -0.0028969531385563915, '2': 0.0028969531385563915 }
    }
  ],
  rowFactors: [
    [ 0.8616749633476822, -0.07856742013183855, 0.02128741065176555 ],
    [ -0.7130442146121512, 0.15713484026367752, 0.019159098981163875 ],
    [ -0.9221118963526588, -0.07856742013183865, 0.005076980490051305 ],
    [ -0.8616749633476826, -0.07856742013183894, -0.02128741065176552 ],
    [ 0.9221118963526594, -0.07856742013183875, -0.005076980490051283 ],
    [ 0.7130442146121508, 0.15713484026367724, -0.019159098981163927 ]
  ],
  explainedVariance: [ 0.9518886893267444, 0.016778523489932903, 0.00038325533115652694 ]
}
```

## API

### `const result = MCA(rows, categories, options?)`

Computes a factor score projection for the data set.

* `rows` is an array of JSON objects
* `categories` is an object whose members are categorical variables and whose values are tuples of categories
* `options` is an optional object with the following possible configuration properties:
    * `skipBenzecri` if turned on, skip Benzerci correction reweighting
    * `skipGreenacre` if turned on, skip Greenacre correction step
    * `tolerance` Truncation for small eigen values.  Anything < `tolerance` is discarded from factor analysis
    * `epsilon` Converge parameter for SVD-js
    * `svdTolerance` Optional convergence test parameter for SVD-js.  Sometimes that library bugs out, and if you pass in a non-zero value here then `easy-mca` will do a bunch of paranoid tests to check convergence.  Normally you don't need to set this thing.

**Returns** An object with two properties

* `rowFactors` is a projection of the data into a low dimensional factor space
* `columnFactors` which is an explanation of the projection in terms of the categories of the inputs
* `explainedVariance` is an array ranking the factor dimensions by how much of the data set's variance they explain

## License

(C) 2021 Mikola Lysenko. MIT License