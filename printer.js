const chalk = require('chalk')
const playOneShoe = require('./dealer')

var numberOfShoesToBePlayed = 2000

while (numberOfShoesToBePlayed--) {
  var results = playOneShoe()

  for (let i = 0; i < results.length; i++) {
    if (results[i] == 'Player') {
      console.log(chalk.green(results[i]))
    } else if (results[i] == 'Banker') {
      console.log(chalk.red(results[i]))
    } else if (results[i] == 'Tie') {
      console.log(chalk.blue(results[i]))
    }
  }
}