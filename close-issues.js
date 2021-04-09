'use strict'
const fs = require('fs')
const { promisify } = require('util')
const readFile = promisify(fs.readFile)
const split = require('split')
const fun = require('funstream')
const github = require('./github.js')

function sleep (num) {
  return new Promise((resolve) => {
    setTimeout(resolve, num)
  })
}

require('./app')(main)
async function main (args) {
  if (args.length !== 2) {
    console.error('close-issues <label> <messagefile> < issueids')
    return
  }
  const [ label, messageFile ] = args
  const message = await readFile(messageFile, 'utf8')

  await fun(process.stdin).filter(id => id !== '').map(id => Number(id)).forEach(async id => {
    await github.issues.addLabels({
      owner: 'SocialStrata',
      repo: 'crowdstack-pro',
      issue_number: id,
      labels: [ label ]
    })
    await sleep(4000)
    await github.issues.createComment({
      owner: 'SocialStrata',
      repo: 'crowdstack-pro',
      issue_number: id,
      body: message
    })
    await sleep(4000)
    await github.issues.update({
      owner: 'SocialStrata',
      repo: 'crowdstack-pro',
      issue_number: id,
      state: 'closed',
    })
    console.log(id)
    await sleep(4000)
  })
}
