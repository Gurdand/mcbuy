window.addEventListener('DOMContentLoaded', () => {

    const accButton = document.querySelector('.account'),
        accModal = document.querySelector('.account-modal'),
        accLogin = document.querySelector('.account-modal__login'),
        registration = document.querySelector('.registr'),
        buttonReg = document.querySelector('.button-reg')
    ;

    accButton.addEventListener('click', () => {
        accLogin.classList.toggle('visible');
    });

    buttonReg.addEventListener('click', () => {
        accLogin.classList.toggle('visible');
        registration.classList.add('visible');

        //let submit = document.querySelector('.reg-submit');

        document.addEventListener('click', (event) => {
            if (!accModal.contains(event.target)) {
                registration.classList.remove('visible');
            }
        });
    });

});