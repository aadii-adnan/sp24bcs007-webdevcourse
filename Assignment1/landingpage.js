console.log("JS loaded");
const hamburger = document.getElementById("hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", function(){
    console.log("clicked");
    navMenu.classList.toggle("open");
});

//So that if user cicks on any link the menu closes

const navLinks = document.querySelectorAll(".nav-menu a");

navLinks.forEach(function(link){
    link.addEventListener("click", function(){
        navMenu.classList.remove("open");
    });
});

// Adding a function so that if user clicks on anything outside hamburger and menu it closes

document.addEventListener ("click", function(event){
    const isclick_onNavmenu = navMenu.contains(event.target);
    const isclick_onHamburger = hamburger.contains(event.target);

    if (!isclick_onHamburger && !isclick_onNavmenu){
        navMenu.classList.remove("open");
    }


})