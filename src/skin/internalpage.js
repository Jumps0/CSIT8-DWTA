document.addEventListener("DOMContentLoaded", function () {
    const readMoreButtons = document.querySelectorAll(".read-more");
  
    readMoreButtons.forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault();
  
        const card = button.closest(".info-card");
        const extraText = card.querySelector(".extra-text");
  
        if (extraText.style.display === "none" || extraText.style.display === "") {
          extraText.style.display = "block";
          button.textContent = "Read less";
        } else {
          extraText.style.display = "none";
          button.textContent = "Read more";
        }
      });
    });
  });
  