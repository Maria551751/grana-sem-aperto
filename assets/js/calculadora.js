document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.calc-inputs-vertical input').forEach((input) => {
        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && typeof calcularGSA === 'function') {
                calcularGSA();
            }
        });
    });
});
