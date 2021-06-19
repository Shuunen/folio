import assert from 'assert'
import data from './reports/summary.json'

const score = Number.parseFloat(data[0].score) * 100
const minScore = 90

assert(score >= minScore, `Lighthouse current score is ${score} and should be superior or equal to the minimal one : ${minScore}`)

console.log(`\n\nGood ! Lighthouse current score (${score}) is great \\o/\n`)
