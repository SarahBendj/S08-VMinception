// const { utilsModule } = require('./utils'); Syntaxe équivalente
import { utilsModule } from "./utils";
import { labelModule } from "./label";

export const cardModule = {
  showAddCardModal(event) {
    const modalElm = document.querySelector("#addCardModal");

    modalElm.classList.add("is-active");

    // Ici je vais récupérer l'id de la liste dans laquelle je souhaite ajouter une carte afin de le renseigner dans le formulaire
    // Ainsi lorsque le formulaire sera soumis (submit), je pourrai récupérer l'id de la liste dans laquelle je souhaite ajouter une carte

    const btnAddCardElm = event.currentTarget;

    // Je veux récupérer l'élément parent le plus proche qui dispose de l'attribut data-list-id
    const listElm = btnAddCardElm.closest("[data-list-id]");
    // Les dataset permettent de stocker des informations dans le HTML. On peut facielement intéragir avec ses données en JS grâce à la propriété dataset de l'élément HTML
    // Ici je vais récupérer l'id de la liste dans laquelle je souhaite ajouter une carte
    // dataset.listId va récupérer la valeur de l'attribut data-list-id
    // Le nom des données récupérer dans le dataset passe en camelCase.
    // Par exemple data-list-id devient dataset.listId
    // ici list-id devient listId
    const listId = listElm.dataset.listId;

    // Je spécifie l'id de la liste dans le formulaire. Ainsi lorsque le formulaire sera soumis, je pourrai récupérer l'id de la liste dans laquelle je souhaite ajouter une carte
    const inputListIdElm = modalElm.querySelector("input[name=\"list_id\"]");
    // j'ajoute la valeur de l'id de la liste dans l'input "list_id"
    inputListIdElm.value = listId;
  },

  /**
   * méthode appeler lors de la soumission du formulaire de création de carte
   * @param {SubmitEvent} event
   */
  async handleAddCardForm(event) {
    // J'empêche le comportement par défaut du formulaire (qui recharge la page)
    event.preventDefault();

    // Je récupère mon formulaire (l'élément HTML)
    const formElm = event.currentTarget;

    // Je récupère les données du formulaire
    const formData = new FormData(formElm);

    const listId = formData.get("list_id");
    const nextPosition = document.querySelectorAll(`[data-list-id="${listId}"] [data-card-id]`).length;

    formData.set("position", nextPosition);

    // Le formData est un objet qui contient les données du formulaire, cependant on ne peut pas récupérer directement toutes les données du formData. On va utiliser une méthode qui va tranformer notre formData en objet
    // const card = Object.fromEntries(formData);
    try {
      // J'appel mon API avec les données du formulaire
      const response = await fetch(`${import.meta.env.VITE_API_URL}/cards`, {
        method: "POST",
        body: formData
      });

      if(!response.ok) {
        throw new Error("Une erreur est survenue");
      }

      // Je récupère depuis la réponse de mon API les données
      const card = await response.json();
      // Avec les données du formulaire, je vais créer ma carte dans le DOM
      cardModule.makeCardInDOM(card);

      // Je ferme la modale
      utilsModule.hideModals(event);

      // Je vide le formulaire
      formElm.reset();
    } catch(e) {
      console.error(e);
      alert(e);
    }

  },

  /**
   * Méthode qui va créer une carte dans le DOM
   * @param {{content: String, list_id: Number}} card
   */
  makeCardInDOM(card) {
    // Je récupère le template de carte (gabarit HTML)
    const cardTemplate = document.querySelector("#templateCard");
    // Je clone le template de carte (ctrl + c du template + ctrl + v dans le DOM)
    const cloneCardElm = document.importNode(cardTemplate.content, true);

    // Je vais modifier le contenu de la carte
    const cardContentElm = cloneCardElm.querySelector(".card-content");
    // Je modifie le contenu de la carte
    cardContentElm.textContent = card.content;

    // Je vais modifier le data-card-id pour le faire correspondre à mes données
    const cardElm = cloneCardElm.querySelector("[data-card-id]");
    // Je modifie la valeur de l'attribut data-card-id
    cardElm.dataset.cardId = card.id;

    // Je vais ajouter les écouteurs d'événements
    // Ici lors du click sur le bouton modifier, je vais afficher le formulaire de modification de carte
    const btnEditCardElm = cloneCardElm.querySelector(".btn-edit-card");

    btnEditCardElm.addEventListener("click", cardModule.showEditCardForm);

    // Lors du click sur le bouton de suppression de carte, je vais supprimer la carte
    const btnRemoveCardElm = cloneCardElm.querySelector(".btn-delete-card");

    btnRemoveCardElm.addEventListener("click", cardModule.handleRemoveCard);

    // Lors de la soumission du formulaire, je vais sauvegarder les modifications de la carte
    const formEditCardElm = cloneCardElm.querySelector(".form-edit-card");

    formEditCardElm.addEventListener("submit", cardModule.handleEditCardForm);

    const btnAddLabelElm = cloneCardElm.querySelector(".add-label");
    btnAddLabelElm.addEventListener("click", labelModule.openModalAddLabel)

    // Je vais ajouter la carte dans le DOM
    // Les [] dans un sélecteur CSS permettent de cibler un attribut
    // Ici je vais cibler l'élément qui a l'attribut data-list-id qui a la valeur de l'id de la liste dans laquelle je souhaite ajouter la carte
    // On peut selectionner un attribut par rapport à son nom. Si besoin, on peut également rajouter la valeur de l'attribut
    const cardContainerElm = document.querySelector(`[data-list-id="${card.list_id}"] .panel-block`);

    // J'ajoute la carte dans le DOM
    cardContainerElm.append(cloneCardElm);
  },

  /**
   * Méthode appeler lors du click sur le bouton de modification de carte
   * @param {MouseEvent} event
   */
  showEditCardForm(event) {
    // Je vais annuler le comportement de base du click sur un lien href="#" qui me remet en haut de la page
    event.preventDefault();

    const btnEditCardElm = event.currentTarget;

    // Je vais remonter sur ma Carte afin de pouvoir par la suite récupérer la partie "container" et le "form"
    const cardElm = btnEditCardElm.closest("[data-card-id]");

    // Je récupère le container et la formulaire
    const cardContainerElm = cardElm.querySelector(".card-container");
    const formElm = cardElm.querySelector(".form-edit-card");

    // Je cache le container
    cardContainerElm.classList.add("is-hidden");
    // J'affiche le formulaire
    formElm.classList.remove("is-hidden");
  },

  /**
   * Méthode appeler a la soumission du formulaire de modification de carte
   * @param {SubmitEvent} event
   */
  async handleEditCardForm(event) {
    // J'empêche le comportement par défaut du formulaire (qui recharge la page)
    event.preventDefault();

    // Je récupère mon formulaire (l'élément HTML)
    const formElm = event.currentTarget;

    // Je récupère les données du formulaire
    const formData = new FormData(formElm);

    // Je souhaite récupérer l'id de la carte afin de pouvoir l'envoyer dans l'URL de mon API
    // Cette information est stockée dans l'attribut data-card-id de ma carte, je vais donc récupérer la carte puis la valeur de l'attribut data-card-id
    const cardElm = formElm.closest("[data-card-id]");
    const cardId = cardElm.dataset.cardId;

    try {
      // J'appel mon API avec les données du formulaire
      const response = await fetch(`${import.meta.env.VITE_API_URL}/cards/${cardId}`, {
        method: "PATCH",
        body: formData
      });

      if(!response.ok) {
        throw new Error("Une erreur est survenue");
      }

      // Je récupère depuis la réponse de mon API les données
      const card = await response.json();

      const contentElm = cardElm.querySelector(".card-content");
      contentElm.textContent = card.content;

      // Je vide le formulaire
      formElm.reset();
    } catch(e) {
      console.error(e);
      alert(e);
    }

    // Je vais afficher le container et cacher le formulaire
    const cardContainerElm = cardElm.querySelector(".card-container");

    cardContainerElm.classList.remove("is-hidden");
    formElm.classList.add("is-hidden");
  },

  /**
   * Méthode appeler au click sur le bouton de suppression de carte
   * @param {MouseEvent} event
   */
  async handleRemoveCard(event) {
    // J'annule le comportement par défaut du click sur un lien href="#" qui me remet en haut de la page
    event.preventDefault();

    if(!confirm("Voulez-vous vraiment supprimer cette carte ?")) {
      return;
    }

    // Je récupère le bouton de suppression de carte
    const btnDeleteCardElm = event.currentTarget;

    // Je récupère la carte depuis mon bouton
    const cardElm = btnDeleteCardElm.closest("[data-card-id]");

    // Je récupère l'id de la carte
    const cardId = cardElm.dataset.cardId;

    try {
      // J'appel mon API
      const response = await fetch(`${import.meta.env.VITE_API_URL}/cards/${cardId}`, {
        method: "DELETE"
      });

      if(!response.ok) {
        throw new Error("Une erreur est survenue");
      }

      // Je supprime la carte du DOM
      cardElm.remove();
    } catch(e) {
      console.error(e);
      alert(e);
    }
  },

  handleDropCard(event) {
    // On récupère la liste d'origine, celle d'où viens ma carte
    const originList = event.from.closest("[data-list-id]");
    // On récupère la liste d'arriver, celle où ma carte se situe à la fin
    const targetList = event.to.closest("[data-list-id]");

    // Dans tous les cas, je vais mettre à jours les cartes de la liste d'origine
    cardModule.updateAllCards(originList);

    // Si ma liste d'origin est différente de celle d'arriver, je vais également mettre à jours les cartes situer dans la liste d'arriver
    if(originList !== targetList) {
      cardModule.updateAllCards(targetList);
    }
  },

  /**
   * Méthode permettant de mettre à jour toutes les cartes d'une liste passé en paramètre
   * @param {HTMLDivElement} listElm
   */
  updateAllCards(listElm) {
    // Je récupère l'identifiant de la liste
    const listId = listElm.dataset.listId;
    // On récupère toutes les cartes de la liste spécifier
    const cardElms = listElm.querySelectorAll("[data-card-id]");

    // On boucle sur toutes les cartes pour mettre à jour la position
    cardElms.forEach((cardElm, index) => {
      const cardId = cardElm.dataset.cardId;

      // Je créer un formData vide pour pouvoir y ajouter les données à modifier de ma carte
      const formData = new FormData();
      formData.append("position", index);
      formData.append("list_id", listId);

      fetch(`${import.meta.env.VITE_API_URL}/cards/${cardId}`, {
        method: "PATCH",
        body: formData
      });
    })
  }
}
