var button = document.getElementById("nice");

if (button) {
    button.addEventListener("click", function() {
        console.log("hello");
    });
} else {
    console.warn("Button not found in the DOM!");
}