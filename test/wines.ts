import { MCA } from "../mca"
import * as util from 'util'

// adapted from here: http://vxy10.github.io/2016/06/10/intro-MCA/
const wines = [
    {
      name: 'W1',
      oak: 1,
      'expert1:fruity': true,
      'expert1:woody': 3,
      'expert1:coffee': false,
      'expert2:fruity': true,
      'expert2:roasted': false,
      'expert2:vanillin': 3,
      'expert2:woody': false,
      'expert3:fruity': false,
      'expert3:buttery': false,
      'expert3:woody': false
    },
    {
      name: 'W2',
      oak: 2,
      'expert1:fruity': false,
      'expert1:woody': 2,
      'expert1:coffee': true,
      'expert2:fruity': false,
      'expert2:roasted': true,
      'expert2:vanillin': 2,
      'expert2:woody': true,
      'expert3:fruity': false,
      'expert3:buttery': true,
      'expert3:woody': true
    },
    {
      name: 'W3',
      oak: 2,
      'expert1:fruity': false,
      'expert1:woody': 1,
      'expert1:coffee': true,
      'expert2:fruity': false,
      'expert2:roasted': true,
      'expert2:vanillin': 1,
      'expert2:woody': true,
      'expert3:fruity': false,
      'expert3:buttery': true,
      'expert3:woody': true
    },
    {
      name: 'W4',
      oak: 2,
      'expert1:fruity': false,
      'expert1:woody': 1,
      'expert1:coffee': true,
      'expert2:fruity': false,
      'expert2:roasted': true,
      'expert2:vanillin': 1,
      'expert2:woody': true,
      'expert3:fruity': true,
      'expert3:buttery': true,
      'expert3:woody': true
    },
    {
      name: 'W5',
      oak: 1,
      'expert1:fruity': true,
      'expert1:woody': 3,
      'expert1:coffee': false,
      'expert2:fruity': true,
      'expert2:roasted': false,
      'expert2:vanillin': 3,
      'expert2:woody': false,
      'expert3:fruity': true,
      'expert3:buttery': false,
      'expert3:woody': false
    },
    {
      name: 'W6',
      oak: 1,
      'expert1:fruity': true,
      'expert1:woody': 2,
      'expert1:coffee': false,
      'expert2:fruity': true,
      'expert2:roasted': false,
      'expert2:vanillin': 2,
      'expert2:woody': false,
      'expert3:fruity': true,
      'expert3:buttery': false,
      'expert3:woody': false
    }
  ]
  
console.log('basic')
console.log(util.inspect(MCA(wines, {
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
  skipBenzecri: true,
  svdTolerance: 1e-4
}), { depth: Infinity, colors: true }))

console.log('corrected')
console.log(util.inspect(MCA(wines, {
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
}), { depth: Infinity, colors: true }))