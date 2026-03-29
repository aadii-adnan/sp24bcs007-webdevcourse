var button = document.getElementById("nice");
var input=document.getElementById("query");
var ul=document.querySelector("ul")

button.addEventListener("click", function(){
    console.log("click");
      var li= document.createElement("li");
      li.appendChild(document.createTextNode(input.value));
      ul.appendChild(li);
})

if (button) {
    button.addEventLisvartener("click", function() {
        console.log("hello");
    });
} else {
    console.warn("Button not found in the DOM!");
}