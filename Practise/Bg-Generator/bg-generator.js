const css=document.querySelector("h3");
const col1 = document.querySelector(".color1");
const col2 = document.querySelector(".color2");
var body =document.querySelector(".gradient")
function set_gradient(){
    body.style.background = `linear-gradient(to right, ${col1.value}, ${col2.value})`;
    css.textContent=body.style.background + ";";

}

col1.addEventListener("input",set_gradient);

col2.addEventListener("input",set_gradient);
         