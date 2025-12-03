
document.addEventListener('DOMContentLoaded', () => {
    const username = document.querySelector('.current-name');

const date = document.querySelector('.date')

const currentDate = new Date().getFullYear()
date.textContent = currentDate;




const new_name = localStorage.getItem('user');
const currentName = JSON.parse(new_name);
username.textContent = currentName ? currentName : 'Guest';

const exploreButton = document.querySelector('.explore');
exploreButton.addEventListener('click', () => {
    window.location.href = 'post.html';
});

const logoutButton = document.querySelector('.logout');
logoutButton.addEventListener('click', () => {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
});



const logoutLink = document.querySelector('.logout a');
logoutLink.addEventListener('click', () => {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
});
    const profileContainer = document.querySelector('.profile-container');
    profileContainer.addEventListener('click', () => {
        window.location.href = 'profile.html';
    });
    

   
});