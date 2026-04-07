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


$(document).ready(function(){

    $.ajax({
        url: "https://fakestoreapi.com/products?limit=4",
        method: "GET",
        success: function(data){

            const container = document.getElementById("product-container");

            container.innerHTML = ""; 

            data.forEach(function(product){

                const card = `
                <div class="product-card">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.title}">
                    </div>
                    <div class="product-info">
                        <h4>${product.title}</h4>
                        <p class="product-description">${product.category}</p>
                        <div class="price">$${product.price}</div>
                        <button class="quick-view" data-id="${product.id}">
                            Quick View
                        </button>
                    </div>
                </div>
                `;

                container.innerHTML += card;
            });

        },
        error: function(){
            console.log("Error fetching data");
        }

    });

});

$(document).on("click", ".quick-view", function(){

    const id = $(this).data("id");

    $.ajax({
        url: `https://fakestoreapi.com/products/${id}`,
        method: "GET",
        success: function(product){

            $("#modal-title").text(product.title);
            $("#modal-desc").text(product.description);
            $("#modal-rating").text("Rating: " + product.rating.rate);

            $("#modal").show();
        }
    });

});

$("#close").click(function(){
    $("#modal").hide();
});