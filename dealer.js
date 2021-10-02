const _ = require("lodash")
const singleDeck = require('./singledeck')

function playOneShoe () {
  // Create the variables required for initialising the program
  var numberOfDecksInShoe = 6
  var shoe = []
  var results = []


  // Create and shuffle the Shoe
  while (numberOfDecksInShoe--) {
    var shoe = shoe.concat(singleDeck)
  }
  var shuffledShoe = _.shuffle(shoe)


  // Function that is called at the start of the game in order to comply with baccarat rules
  function beginGame () {
    const firstCardValue = shuffledShoe[0].value
    shuffledShoe = _.drop(shuffledShoe)

    if (firstCardValue == 'A') {
      var burnAmount = 1    
    } else if (firstCardValue == 'J' || firstCardValue == 'Q' || firstCardValue == 'K') {
      var burnAmount = 10
    } else {
      var burnAmount = firstCardValue
    }

    while (burnAmount--) {
      shuffledShoe = _.drop(shuffledShoe)
    }

    return shuffledShoe
  }


  // Draw the top card of the array, and then remove it from the array.
  function drawCard () {
    const topCard = shuffledShoe[0].value
    shuffledShoe = _.drop(shuffledShoe)

    if (topCard == 'A') {
      return 1
    } else if (topCard == 10 || topCard == 'J' || topCard == 'Q' || topCard == 'K') {
      return 0
    } else {
      return topCard
    }
  }

  // Sums all the cards in the hand and then drops the digit in the 10s column
  function calculateHandTotal(hand) {
    handTotal = _.sum(hand)

    return handTotal % 10
  }

  function determineWinner(playerTotal, bankerTotal) {
    if (playerTotal == bankerTotal) {
      return "Tie"
    } else if (playerTotal > bankerTotal) {
      return "Player"
    } else if (playerTotal < bankerTotal) {
      return "Banker"
    }
  }

  // One round of Baccarat
  function coup () {
    var currentPlayerHand = []
    var currentBankerHand = []

    // Deal the 1st 4 cards of the round.
    currentPlayerHand.push(drawCard())
    currentBankerHand.push(drawCard())
    currentPlayerHand.push(drawCard())
    currentBankerHand.push(drawCard())

    // Calculate the han totals.
    var playerTotal = calculateHandTotal(currentPlayerHand)
    var bankerTotal = calculateHandTotal(currentBankerHand)

    // Tableau to determine the winner or if a 3rd card needs to be delt.
    if (playerTotal >= 8 || bankerTotal >= 8) {
      return determineWinner(playerTotal, bankerTotal)
    } else {
      if (playerTotal >= 0 && playerTotal <= 5) {
        currentPlayerHand.push(drawCard())
        playerTotal = calculateHandTotal(currentPlayerHand)
      }
      if (currentPlayerHand.length == 2) {
        if (bankerTotal >= 0 && bankerTotal <= 5) {
          currentBankerHand.push(drawCard())
          bankerTotal = calculateHandTotal(currentBankerHand)
        }
      } else if (currentPlayerHand.length == 3) {
        if (bankerTotal <= 2) {
          currentBankerHand.push(drawCard())
          bankerTotal = calculateHandTotal(currentBankerHand)
        } else if (bankerTotal == 3) {
          if (currentPlayerHand[2] != 8) {
            currentBankerHand.push(drawCard())
            bankerTotal = calculateHandTotal(currentBankerHand)
          }
        } else if (bankerTotal == 4) {
          if (currentPlayerHand[2] == 2 || currentPlayerHand[2] == 3 || currentPlayerHand[2] == 4 || currentPlayerHand[2] == 5 || currentPlayerHand[2] == 6 || currentPlayerHand[2] == 7) {
            currentBankerHand.push(drawCard())
            bankerTotal = calculateHandTotal(currentBankerHand)
          }
        } else if (bankerTotal == 5) {
          if (currentPlayerHand[2] == 4 || currentPlayerHand[2] == 5 || currentPlayerHand[2] == 6 || currentPlayerHand[2] == 7) {
            currentBankerHand.push(drawCard())
            bankerTotal = calculateHandTotal(currentBankerHand)
          }
        } else if (bankerTotal == 6) {
          if (currentPlayerHand[2] == 6 || currentPlayerHand[2] == 7) {
            currentBankerHand.push(drawCard())
            bankerTotal = calculateHandTotal(currentBankerHand)
          }
        }
      }
    }

    return determineWinner(playerTotal, bankerTotal)

  }

  // Run the function that is required when starting the game to burn the current amount of cards.
  beginGame()

  // Once the 7th last card is reached, it is the last time the coup is performed
  while (shuffledShoe.length >= 6) {
    const result = coup()

    results.push(result)
  }

  // Output the results of single shoe
  // console.log(results)

  return results
}

module.exports = playOneShoe
