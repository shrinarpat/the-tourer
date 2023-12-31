/* eslint-disable */

// const { default: axios } = require("axios");

const login = async (email, password) => {
  const loginBtn = document.getElementById('btn--login');
  loginBtn.textContent = 'Verifying...';
  try {
    let res = await fetch('/api/v1/users/login', {
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
  loginBtn.textContent = 'Login';
};

const signUpUser = async (name, email, password, passwordConfirm) => {
  const signUpBtn = document.getElementById('btn--signup');
  signUpBtn.textContent = 'Processing...';
  try {
    let res = await fetch('/api/v1/users/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password, passwordConfirm }),
    });

    res = await res.json();
    if (res.status === 'success') {
      alert('You have successfully signed up');
      window.setTimeout(() => {
        window.location.assign('/');
      }, 1500);
    } else {
      alert(res.message);
    }
  } catch (err) {
    console.log(err);
    alert(err.message);
  }
  signUpBtn.textContent = 'Sign Up';
};

const updateUserData = async (form) => {
  try {
    let res = await fetch('/api/v1/users/updateMe', {
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
    let res = await fetch('/api/v1/users/updateMyPassword', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ passwordCurrent, password, passwordConfirm }),
    });
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
    let res = await fetch('/api/v1/users/logout');
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
const alertMessage = document.querySelector('body').dataset.alert;
const signupForm = document.querySelector('.form--signup');

if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const passwordConfirm = e.target[3].value;

    if (password !== passwordConfirm) {
      alert('error, password and passwordConfirm are not the same');
    } else {
      signUpUser(name, email, password, passwordConfirm);
    }
  });
}

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

    const files = document.getElementById('photo').files;
    if (files.length > 0) {
      form.append('photo', files[0]);
    }

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

if (alertMessage) {
  alert(alertMessage);
}
