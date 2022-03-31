// ------------------- Partie déclaration des constantes et variable ---------------------
const tabTotal = [];
const tabQuantite = [];
const tabPanier = [];
const objNavigateur = localStorage.getItem("Panier");
const tableauParse = JSON.parse(objNavigateur);
const prenom = document.getElementById("firstName");
const nom = document.getElementById("lastName");
const adresse = document.getElementById("address");
const ville = document.getElementById("city");
const email = document.getElementById("email");
const commander = document.getElementById("order");
let somme = 0;
const contact = {
  firstName: null,
  lastName: null,
  address: null,
  city: null,
  email: null,
};

// ------------------- Partie affichage des articles  ---------------------

for (let index = 0; index < tableauParse.length; index++) {
  const element = tableauParse[index];

  // --------------------------------

  fetch(`http://localhost:3000/api/products/${element.referenceProduit}`)
    .then(function (res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function (datas) {
      const item = document.getElementById("cart__items");
      item.innerHTML += `<article class="cart__item" data-id=${element.referenceProduit} data-color=${element.couleurProduit}>
    <div class="cart__item__img">
      <img src="${datas.imageUrl}" alt=${datas.altTxt}>
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__description">
        <h2>${datas.name}</h2>
        <p>${element.couleurProduit}</p>
        <p>${datas.price} €</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>Qté : </p>
          <input id=quantiteArticle type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${element.quantiteProduit}">
        </div>
        <div class="cart__item__content__settings__delete">
          <p class="deleteItem" id="deleteItem" >Supprimer</p>
        </div>
      </div>
    </div>
  </article>`;

      Bouton();
      modification();
    })
    .catch(function (err) {
      // window.alert("Serveur déconnecté");
    });
}
// ------------------- Partie affichage de la quantite total et Prix total ---------------------

console.log(tabTotal);
for (let index = 0; index < tabTotal.length; index++) {
  somme += tabTotal[index];
}

// console.log(document.getElementById("totalPrice").innerText);

document.getElementById("totalPrice").innerText = somme;

// // J'addition les quantités d'articles et je les affiche

document.getElementById("totalQuantity").innerText = somme;

// ------------------- Partie écoute des champs du formulaire ---------------------
function ecouteChamp(champ) {
  champ.addEventListener("change", (event) => {
    console.log("J'ai un changement sur " + event.target.id);
    contact[event.target.id] = event.target.value;
    console.log("Nouvel objet contact : ");
    console.log(contact);
  });
}

// J'écoute le champs prenom
ecouteChamp(prenom);
// J'écoute le champs Nom
ecouteChamp(nom);
// J'écoute le champs Adresse
ecouteChamp(adresse);
// // J'écoute le champs Ville
ecouteChamp(ville);
// // J'écoute le champs email
ecouteChamp(email);

// ------------------- Partie Modification de la commande ---------------------

// ------------------ Recupération du panier pour modification ------------------------

function recupConvParse() {
  // Je recupère le panier qui est dans le navigateur
  const objNavigateur = localStorage.getItem("Panier");
  // Je parse l'objet du navigateur
  const tableauParse = JSON.parse(objNavigateur);
  return tableauParse;
}

function convertionStringEnvoi(tableauParse) {
  // Je converti le tableau récapitulitif au format JSON
  tableauString = JSON.stringify(tableauParse);
  console.log(tableauParse);
  // J'éfface l'item "Panier" du localStorage
  localStorage.removeItem("Panier");
  // Je stocke le tableau dans le navigateur
  localStorage.setItem("Panier", tableauString);
}

// ------------------ Bouton Supprimé ---------------------------

function Bouton() {
  const nodeList = document.querySelectorAll(`#deleteItem`);
  // const nodeList = document.querySelectorAll(
  //   `article[data-id=${referenceProduit}] > .deleteItem]`
  // );
  // console.log(nodeList.id);
  tabDeleted = Array.prototype.slice.call(nodeList);

  for (let index = 0; index < tabDeleted.length; index++) {
    const element = tabDeleted[index];
    element.addEventListener("click", (event) => {
      // Récupération du parent de l'évènement
      const parent = element.closest(`article`);
      // Récupération des deux attributs "data-id" et "data-color"
      const referenceProduit = parent.getAttribute("data-id");
      const couleurProduit = parent.getAttribute("data-color");
      console.log(referenceProduit);
      console.log(couleurProduit);
      // Je recupère le panier existant
      const tableauParse = recupConvParse();
      console.log(tableauParse);
      // Je recherche l'index de l'objet à supprimer
      const numeroIndex = tableauParse.findIndex(
        (el) =>
          el.referenceProduit === referenceProduit &&
          el.couleurProduit === couleurProduit
      );
      // Je supprime l'objet du tableau
      tableauParse.splice(numeroIndex, 1);
      console.log(tableauParse);
      // Je stringity le tableau et je le renvoi dans le localStorage
      convertionStringEnvoi(tableauParse);

      // Je supprime l'article
      parent.remove();
    });
  }
}

// ------------------ Champ Quantité ------------------------

function modification() {
  const nodeList = document.querySelectorAll(".itemQuantity");
  // console.log(nodeList);
  tabQuantiteModif = Array.prototype.slice.call(nodeList);

  for (let index = 0; index < tabQuantiteModif.length; index++) {
    const element = tabQuantiteModif[index];
    element.addEventListener("change", (event) => {
      // Code a faire pour la modification de la quantité
      console.log("Quantité modifiée");
    });
  }
}

// ------------------- Partie Commande du formulaire ---------------------

function checkEmail(email) {
  const verification =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return verification.test(email);
}

commander.addEventListener("click", (event) => {
  event.preventDefault();
  if (checkEmail(contact.email)) {
    localStorage.setItem("contact", JSON.stringify(contact));
  } else {
    alert(
      "Le mail saisie ne semble pas être valide. Merci de saisir une adresse mail valide."
    );
  }
  console.log(contact);
});
