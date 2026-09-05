document.getElementById('login-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  await login();
});

var authToken;


async function submitQuote(event) {

    event.preventDefault();

    const response = await fetch("/admin/quotes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            quotation: document.getElementById("quote").value,
            author: document.getElementById("author").value
        })
    });

    const html = await response.text();
    document.documentElement.innerHTML = html;
}

async function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const res = await fetch('/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(`Failed to login: ${data.error}`);
    }

    if (data.token) {
      authToken = data.token
      document.getElementById('login-section').innerHTML = `Success!`;
    } else {
      alert('Login failed. Please check your credentials.');
    }
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}

async function signup() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const authorization = document.getElementById('authorization').value

  try {
    const res = await fetch('/admin/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, authorization }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(`Failed to create user: ${data.error}`);
    }
    console.log('User created!');
    await login();
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}

async function allQuotes() {
  showSection("allquotes-section");
  try {
    const res = await fetch('/api/quotes', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(`Failed to retrieve all quotes: ${data.error}`);
      
    }
    const data = await res.text();
    document.getElementById("allquotes-section").innerHTML = data;
  } catch (error) {
    alert:(`Error: ${error.message}`)
  }
}

function showHome() {
  showSection("home-section");
}

function showLogin() {
  showSection("login-section");
}

function showSection(id) {
    document.querySelectorAll("main > div").forEach(section => {
        section.classList.add("hidden");
    });

    document.getElementById(id).classList.remove("hidden");
}