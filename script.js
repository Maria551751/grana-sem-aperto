const btnAbrir = document.querySelector('.menu-mobile-btn');
const btnFechar = document.getElementById('btnFechar');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

function toggleMenu() {
    sidebar.classList.toggle('ativo');
    overlay.classList.toggle('ativo');
}

btnAbrir.addEventListener('click', toggleMenu);
btnFechar.addEventListener('click', toggleMenu);
overlay.addEventListener('click', toggleMenu);

// Animações de Reveal
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('ativo');
        }
    });
});

document.querySelectorAll('.revelar').forEach(el => observer.observe(el));