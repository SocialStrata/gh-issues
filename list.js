'use strict'
const github = require('./github.js')
const fs = require('fs')
const issueList = fs.createWriteStream('issue-list.ndjson')
const prList = fs.createWriteStream('pr-list.ndjson')
require('./app.js')(main)

function closeStream (stream) {
  return new Promise((resolve, reject) => {
    stream.on('error', reject)
    stream.on('close', resolve)
  })
}

async function main () {
  github.paginate(github.rest.issues.listForRepo, {
    owner: 'SocialStrata',
        repo: 'crowdstack-pro',
        state: 'open',
        assignee: 'none',
        per_page: 100
  })
  .then((issues) => {
    issues.forEach(issue => {
      if (issue.pull_request) {
        prList.write(JSON.stringify(issue) + '\n')
      } else {
        issueList.write(JSON.stringify(issue) + '\n')
      }
    })
      prList.end()
      issueList.end()
  })
  .then(Promise.all([closeStream(prList), closeStream(issueList)]));

}
