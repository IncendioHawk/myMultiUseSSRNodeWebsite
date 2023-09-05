const generateDudeneyNumbersBtn = document.querySelector(".generate-dudeney-numbers")
const dudeneyNumbersDiv = document.querySelector(".dudeney-numbers")

generateDudeneyNumbersBtn.addEventListener("click", handleClick)

async function handleClick() {
  dudeneyNumbersDiv.innerHTML = ""
  const dudeneyNumbers = generateDudeneyNumbers()
  dudeneyNumbers.forEach(async (i, index) => {
    await sleep(index * 1000)
    const dudeneyNumberSpan = document.createElement("span")
    dudeneyNumberSpan.textContent = i
    dudeneyNumbersDiv.appendChild(dudeneyNumberSpan)
  })
}

function generateDudeneyNumbers() {
  const result = []
  for (let i = 0; i < 54 ** 3; i++) {
    if (Math.cbrt(i) === sumDigits(i)) {
      result.push(i)
    }
  }
  return result
}

function sumDigits(n) {
  return n
    .toString()
    .split("")
    .reduce((a, i) => a + Number(i), 0)
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
