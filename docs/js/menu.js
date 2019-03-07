window.addEventListener('DOMContentLoaded', () => {

    const topMenuLI = document.querySelectorAll('.menu__link'),
        menuButton = document.querySelector('.header__phone-menu'),
        menu = document.querySelector('.menu')
    ;

    topMenuLI.forEach((elem) => {

        if (elem.nextElementSibling) {

            elem.addEventListener('click', () => {

                elem.nextElementSibling.classList.toggle('visible');
                return false;
            })
        }

    });

    menuButton.addEventListener('click', () => {
        menu.classList.toggle('visible-menu');
    });

});