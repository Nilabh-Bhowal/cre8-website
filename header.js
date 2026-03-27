fetch("header.html")
    .then(res => res.text())
    .then(html => {
        document.getElementById("header-container").innerHTML = html;

        // Highlight the current page after loading
        const currentPage = window.location.pathname.split("/").pop() || "index.html";
        const navLinks = document.querySelectorAll(".nav-links a");

        navLinks.forEach(link => {
            const linkPage = link.getAttribute("href");
            if(linkPage === currentPage || (linkPage === "index.html" && currentPage === "")) {
                link.classList.add("active");
            }
        });
    })
    .catch(err => console.error("Failed to load header:", err));
