const hamburger = $(".hamburger");
const navMenu = $("ul");

hamburger.click(function () {
	hamburger.toggleClass("active");
	navMenu.toggleClass("active");
});
