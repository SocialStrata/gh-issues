'use strict'
const fs = require('fs')
const ndjson = require('ndjson')
const fun = require('funstream')
const moment = require('moment')
const Bluebird = require('bluebird')
require('./app')(main)

function moreThanDaysAgo (days, date) {
  return moment(date).isBefore(moment().subtract(days, 'days'))
}

async function main () {
  await fun(fs.createReadStream('issue-list.ndjson')).pipe(ndjson()).filter(issue => {
    return moreThanDaysAgo(180, issue.updated_at)
  }).forEach(issue => {
    console.log(issue.number)
  })
}