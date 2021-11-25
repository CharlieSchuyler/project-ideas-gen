document.body.addEventListener("load", setBackgroundColor());
function setBackgroundColor() {
    console.log("sjidoajo")
    document.body.style.backgroundColor = `rgba(${Math.floor(Math.random() * 255) + 1}, ${Math.floor(Math.random() * 255) + 1},${Math.floor(Math.random() * 255) + 1})`
}

function redirect(){
    window.location.href = "/create";
}

document.addEventListener("keyup", function(event) {
  if (event.keyCode === 32) {
    window.location.reload();
    
  }
});