/* eslint-disable */

// const { default: axios } = require("axios");

const login = async (email, password) => {
  try {
    let res = await fetch('http://127.0.0.1:3000/api/v1/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email, password: password }),
    });
    res = await res.json();
    if (res.status === 'success') {
      alert('Logged in Successfully');
      window.setTimeout(() => {
        window.location.assign('/');
      }, 1500);
    } else {
      alert(res.message);
    }
  } catch (err) {
    console.log(err);
  }
};

document.querySelector('.form').addEventListener('submit', (event) => {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password);
});
