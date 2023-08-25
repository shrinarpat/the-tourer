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

const updateUserData = async (form) => {
  try {
    let res = await fetch('http://127.0.0.1:3000/api/v1/users/updateMe', {
      method: 'PATCH',
      body: form,
    });
    res = await res.json();
    if (res.status === 'success') {
      alert('Updated Successfully');
      // window.location.reload(true);
    } else {
      alert(res.message);
    }
  } catch (err) {
    console.log(err);
  }
};

const updateUserPassword = async (
  passwordCurrent,
  password,
  passwordConfirm,
) => {
  try {
    let res = await fetch(
      'http://127.0.0.1:3000/api/v1/users/updateMyPassword',
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ passwordCurrent, password, passwordConfirm }),
      },
    );
    res = await res.json();
    if (res.status === 'success') {
      alert('Password Updated Successfully');
      // window.location.reload(true);
    } else {
      alert(res.message);
    }
  } catch (err) {
    console.log(err);
  }
};

const logout = async () => {
  try {
    let res = await fetch('http://127.0.0.1:3000/api/v1/users/logout');
    res = await res.json();
    if (res.status === 'success') {
      window.location.assign('/');
    } else {
      alert(res.message);
    }
  } catch (err) {
    console.log(err);
  }
};

const loginForm = document.querySelector('.form--login');
const logout_btn = document.querySelector('.nav__el--logout');
const updateUserForm = document.querySelector('.form-user-data');
const updatePasswordForm = document.querySelector('.form-user-settings');

if (loginForm) {
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logout_btn) {
  logout_btn.addEventListener('click', (event) => {
    logout();
  });
}

if (updateUserForm) {
  updateUserForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    updateUserData(form);
  });
}

if (updatePasswordForm) {
  updatePasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    updateUserPassword(passwordCurrent, password, passwordConfirm);
  });
}
