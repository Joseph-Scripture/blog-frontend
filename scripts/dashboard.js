const username = document.querySelector('.current-name');

const date = document.querySelector('.date')

const currentDate = new Date().getFullYear()
date.textContent = currentDate;




const new_name = localStorage.getItem('user');
const currentName = JSON.parse(new_name);
username.textContent = currentName ? currentName : 'Guest';
