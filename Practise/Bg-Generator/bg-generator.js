const css=document.querySelector("h3");
const col1 = document.querySelector("color1");
const col2 = document.querySelector("color2");
var body =document.querySelector("gradient")

col1.addEventListener("input",function(){
    body.style.background = "linear-gradient(to right" + col1.value +"," + col2.value + ")";

})

col2.addEventListener("input",function(){
         
})