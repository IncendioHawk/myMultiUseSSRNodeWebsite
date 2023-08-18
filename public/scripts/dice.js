const dice = document.querySelector(".dice")
const rollDiceBtn = document.querySelector(".roll-dice-btn")
const numberOfSidesInput = document.querySelector(".number-of-sides")
const numberOfDiceInput = document.querySelector(".number-of-dice")
const resultsDiv = document.querySelector(".results")

rollDiceBtn.addEventListener("click", handleClick)

const digits = {
  1: "one",
  2: "two",
  3: "three",
  4: "four",
  5: "five",
  6: "six",
  7: "seven",
  8: "eight",
  9: "nine",
}
let rolling = false

async function handleClick() {
  if (numberOfSidesInput.value === "") {
    alert("Please select a number of sides")
    return
  }
  if (numberOfDiceInput.value === "") {
    alert("Please select a number of dice")
    return
  }
  if (!rolling) {
    resultsDiv.innerHTML = ""
    rolling = true
    rollDiceBtn.innerText = "Cancel"
    rollDiceBtn.style.borderColor = "hsl(calc(var(--color-base-hue) + 100), 50%, 40%)"
    dice.classList.add("rolling")
    const numbers = rollDice(numberOfSidesInput.value, numberOfDiceInput.value)
    numbers.forEach(async (n) => {
      if (n > 6) {
        const addends = findAddends(n)
      }
      const face = document.createElement("div")
      face.classList.add("face", digits[n], "results-die")
      for (let i = 1; i <= n; i++) {
        face.innerHTML += "<span></span>"
      }
      await sleep((n - 1) * 1000)
      resultsDiv.appendChild(face)
    })
  } else {
    rolling = false
    rollDiceBtn.innerText = "Roll"
    rollDiceBtn.style.borderColor = "hsl(var(--color-base-hue), 50%, 40%)"
    dice.classList.remove("rolling")
  }
}

function rollDice(numberOfSides, numberOfDice) {
  const numbers = []
  for (let i = 1; i <= numberOfDice; i++) {
    numbers.push(Math.floor(Math.random() * numberOfSides + 1))
  }
  return numbers
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function findAddends(number, initialNumber, list = []) {
  const x1 = Math.trunc(number / 6)
  const x2 = number - x1
  list.push(x1)
  if (number / 6 === 1) return list
  findAddends(x2, initialNumber, list)
}

function sumArray(arr) {
  return arr.reduce((acc, i) => {
    return acc + i
  }, 0)
}
