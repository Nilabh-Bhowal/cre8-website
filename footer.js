fetch('footer.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('footer').innerHTML = html;
    })
    .catch(error => console.error('Error loading footer:', error));
