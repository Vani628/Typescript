
  document.addEventListener("DOMContentLoaded", function () {
    var accordionButtons = document.querySelectorAll(".accordion-button");

    accordionButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        var icon = this.querySelector(".icon");
        if (this.classList.contains("collapsed")) {
          icon.textContent = "+";
        } else {
          icon.textContent = "–";
        }
      });
    });
  });
