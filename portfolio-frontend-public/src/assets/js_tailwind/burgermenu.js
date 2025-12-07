
const toggleBurgerMenu = () => {
    document.documentElement.classList.toggle('burger');
};

export const isBurgerMenu = () => {
    return document.documentElement.classList.contains('burger');
};

export const closeBurgerMenu = () => {
    document.documentElement.classList.remove('burger');
};
