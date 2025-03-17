// BUTTONS
const buttonGenerate = document.getElementById("buttonGenerate")
const buttonClear = document.getElementById("buttonClear")

// NOTE: You will only be able to see these messages by using inspect element on the popup itself. They will not appear on the "main" inspect element.
buttonGenerate.onclick = function(){
  console.log("Generate button has been clicked.");
}

buttonClear.onclick = function(){
  console.log("Clear button has been clicked.");
}