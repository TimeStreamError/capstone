async function submitQuote(event) {

    event.preventDefault();

    const response = await fetch("/api/quotes", {
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