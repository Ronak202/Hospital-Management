document.addEventListener("DOMContentLoaded", function() {
    const readMoreBtn = document.getElementById('readMoreBtn');
    const aboutMore = document.getElementById('about-more');

    readMoreBtn.addEventListener('click', () => {
        if (aboutMore.style.display === "none") {
            aboutMore.style.display = "block";
            readMoreBtn.textContent = "Read Less";
        } else {
            aboutMore.style.display = "none";
            readMoreBtn.textContent = "Read More";
        }
    });
});
