const url = JSON.parse(document.getElementById("mercure-match-found-url").textContent);
const eventSource = new EventSource(url);

eventSource.onmessage = () => {
    location.reload();
}