let complementUrl = new URLSearchParams(window.location.search);
const referenceCommande = complementUrl.get("orderId");

console.log(referenceCommande);

document.getElementById("orderId").innerText = referenceCommande;
