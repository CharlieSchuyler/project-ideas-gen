function redirect() {
  window.location.href = "/add-to-database";
}
//if database is empty
// document.querySelector("#redirect").addEventListener("click", redirect());

//on space bar or button click
document.addEventListener("keydown", () => reloadPage(event));
document.querySelector("#reload").addEventListener("click", () => reloadPage(event));

function reloadPage(event) {
  if (event.keyCode === 32) {
    window.location.reload();
  } else if (event.type === "click") {
    window.location.reload();
  }
}
