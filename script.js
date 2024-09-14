/* Iteration 4: Make the Everything Work */
const buttonBackground = document.getElementById("button-background");
const imgBackground = document.getElementById("background");

buttonBackground.oninput = ()=>{
  imgBackground.style.fill = buttonBackground.value;
}

const buttonfaceplate = document.getElementById("button-face-plate");
const faceplate = document.getElementById("face-plate");

buttonfaceplate.oninput = ()=>{
  faceplate.style.fill = buttonfaceplate.value;
}

const buttoneyes = document.getElementById("button-eyes");
const eyes = document.getElementById("eyes");

buttoneyes.oninput = ()=>{
  eyes.style.fill = buttoneyes.value;
}

const buttonhelmet = document.getElementById("button-helmet");
const helmet = document.getElementById("helmet");

buttonhelmet.oninput = ()=>{
  helmet.style.fill = buttonhelmet.value;
}