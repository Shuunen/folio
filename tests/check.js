const assert = require('assert')
const data = require('./reports/summary.json')
const score = parseFloat(data[0].score) * 100
const lastScore = 88

assert(score >= lastScore, `Lighthouse current score is ${score} and should be superior or equal to last one : ${lastScore}`)

console.log(`\n\nGood ! Lighthouse current score (${score}) is not worse than last one (${lastScore}) \\o/\n`)
