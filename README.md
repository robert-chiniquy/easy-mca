# easy-mca

Module for using [multiple correspondence analysis](https://en.wikipedia.org/wiki/Multiple_correspondence_analysis) to project categorical data into lower dimensional spaces for visualization and exploration.  Consider this a work in progress.

## Example

```
import MCA from 'easy-mca'

// See test folder for data
const wines = require('wines.json)

console.log(MCA(wines, {
    'expert1:fruity': [ true, false ],
    'expert1:woody': [ 1, 2, 3 ],
    'expert2:fruity': [ true, false ],
    'expert2:roasted': [ true, false ],
    'expert2:vanillin': [ 1, 2, 3 ],
    'expert2:woody': [ true, false ],
    'expert3:fruity': [ true, false ],
    'expert3:buttery': [ true, false ],
    'expert3:woody': [ true, false ]
}, {
  correction: true
}))
```

## API

### `const { factorScores, explainedVariance } = MCA(rows, categories, options?)`

Computes a factor score projection for the data set.

* `rows` is an array of JSON objects
* `categories` is an object whose members are categorical variables and whose values are tuples of categories
* `options` is an optional object with the following possible configuration properties:
    * `correction` if turned on, use Bezerci correction for reweighting
    * `epsilon` Converge parameter for SVD
    * `tolerance` Truncation for small eigen values

**Returns** An object with two properties

* `factorScores` is a projection of the data into a low dimensional factor space
* `explainedVariance` is an array ranking the factor dimensions by how much of the data set's variance they explain

## License

(C) 2021 Mikola Lysenko. MIT License