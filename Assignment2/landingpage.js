console.log("JS loaded");
const hamburger = document.getElementById("hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", function(){
    console.log("clicked");
    navMenu.classList.toggle("open");
});