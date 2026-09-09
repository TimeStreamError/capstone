document.getElementById('login-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  await login();
});

// the JST token is 'stored' here for the session
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

  // Show the DIV that displays all the quotes
  showSection("allquotes-section");
  console.log("Starting to get all quotes")
  try { // in case something goes very wrong, beyond stuff handled via status

    //fetch all the quotes via the REST API
    const res = await fetch('/api/quotes', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    // the JST token isn't valid. We need to check the refresh token which is stored in a cookie
    if (res.status == 401) {
        // ask for a new JWT token via refresh token
        console.log("Asking for new JWT token");
        const refreshRes = await fetch('/api/refresh');

        if (!refreshRes.ok) {
          showLogin();
          return;
        }

        const data = await refreshRes.json();
        authToken = data.token
        console.log("Trying fetch again")
        // now we can try the original request again
        const res = await fetch('/api/quotes', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });
    }

    // so initial fetch did not return a 401 Unauthorized status...


    if (!res.ok) {
      // ... but something else went wrong
      const data = await res.json();
      throw new Error(`Failed to retrieve all quotes: ${data.error}`);
      
    }

    // ... and we got a 200 OK status.
    const data = await res.text();
    document.getElementById("allquotes-section").innerHTML = data;

  } catch (error) { // something in the http code went bad (not handled status stuff)
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

function sizeText(containerElement) {
  let low = 6;
  let high = 200;

  while (low <= high) {
    const size = Math.floor((low + high) / 2);

    textElement = containerElement.innerHTML;

    textElement.style.fontSize = size + 'px';

    if (textFits()) {
      // but can it be larger?
      low = size + 1;
    } else {
      // doesn't fit, try smaller
      high = size - 1;
    } 
  }
  textElement.style.fontSize = high + 'px'
}

function textFits(element) {
  return element.scrollHeight <= element.clientHeight;
}