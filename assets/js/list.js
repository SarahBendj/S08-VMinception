import { utilsModule } from "./utils";
import { cardModule } from "./card";
import Sortable from "sortablejs";
import { labelModule } from "./label";

export const listModule = {
  /**
   * Méthode qui va gérer l'affichage de la modale d'ajout de liste
   * @param {MouseEvent} event
   */
  showAddListModal() {
    // Je récupère la modale
    const addListModalElm = document.querySelector("#addListModal");

    // J'ouvre la modale en rajoutant la class "is-active" dessus
    addListModalElm.classList.add("is-active");
  },

  /**
   * Méthode appeler à la soumission du formulaire d'ajout de liste
   * @param {SubmitEvent} event
   */
  async handleAddListForm(event) {
    // On empêche le comportement par défaut du formulaire (qui recharge la page)
    event.preventDefault();

    // Je récupère mon formulaire (l'élément HTML)
    const formElm = event.currentTarget;
    // La position de ma liste sera la longueur de mon tableau de listes
    const nextPosition = document.querySelectorAll("[data-list-id]").length;

    // Je récupère les données du formulaire
    const formData = new FormData(formElm);

    formData.set("position", nextPosition);

    // Le formData est un objet qui contient les données du formulaire
    // Cependant on ne peut pas récupérer directement toutes les données du formData. On va utiliser une méthode qui va tranformer notre formData en objet
    // const formDataObj = Object.fromEntries(formData);
    // On a plus besoin de transformer notre fromData en objet JS classique, car on va envoyer le formData directement à notre API.

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/lists`, {
        method: "POST",
        body: formData
      });

      if(!response.ok) {
        throw new Error("Erreur de chargement des données");
      }

      // Je récupère les données de ma liste
      const list = await response.json();
      // Avec les données du formulaire, je vais créer ma liste dans le DOM
      listModule.makeListInDOM(list);

      // On réinitialise le formulaire
      formElm.reset();

      // On ferme la modale
      // Je passe mon event pour qu'il puisse récupérer la modale à fermer
      utilsModule.hideModals(event);
    } catch(e) {
      console.error(e);
      alert(e);
    }
  },

  /**
   * Méthode permettant de rajouter une liste dans le DOM
   * @param {{id: Number, name: String}} list
   */
  makeListInDOM(list) {
    // Je récupère le template HTML de ma liste
    const templateListElm = document.querySelector("#templateList");

    // Je vais cloner le template
    const cloneListElm = document.importNode(templateListElm.content, true);

    // Je vais modifier les informations du template cloner pour la faire correspondre mon élément à la liste que je souhaite créer

    // Je vais récupérer le titre de ma liste
    const titleElm = cloneListElm.querySelector(".list-title");
    titleElm.textContent = list.name;

    // Je vais modifier le data-list-id de ma liste pour le faire correspondre a mes données passé en paramètre
    const listElm = cloneListElm.querySelector("[data-list-id]");
    listElm.dataset.listId = list.id;

    // J'ajoute les events listener qui sont attacher à une liste
    const addCardBtnElm = cloneListElm.querySelector(".add-card-btn");
    addCardBtnElm.addEventListener("click", cardModule.showAddCardModal);

    titleElm.addEventListener("dblclick", listModule.showEditForm);

    // Je récupère mon bouton de suppression de liste
    const deleteBtnElm = cloneListElm.querySelector(".remove-list-btn");
    deleteBtnElm.addEventListener("click", listModule.handleDeleteList);

    const editListForm = cloneListElm.querySelector(".edit-list-form");

    editListForm.addEventListener("submit", listModule.handleSubmitEditListForm);

    // Je vais rajouter la posibilité de drag and drop sur mes cartes.
    // Pour cela, je vais récupérer l'élément qui contient mes cartes
    const cardContainerElm = cloneListElm.querySelector(".panel-block");
    Sortable.create(cardContainerElm, {
      group: "card",
      // onUpdate est appeler uniquement lorsque l'on déplace notre carte au seins de la même liste.
      // Si notre carte change de liste, on ne passera pas dedans...
      onEnd: cardModule.handleDropCard
    });

    // Je vais rajouter la liste dans le DOM
    // Je récupère l'élément qui va contenir mes listes
    const listsContainerElm = document.querySelector(".card-lists");
    // Je rajoute ma liste dans le DOM
    listsContainerElm.appendChild(cloneListElm);
  },

  /**
   * Méthode qui va récupérer les listes depuis l'API
   */
  async getListsFromAPI() {
    // Je vais utiliser try/catch pour gérer les erreurs retourner par mes promesses
    try {
      // Je vais dans un premier temps faire ma requête avec fetch pour récupérer une réponse. (attention, fetch retourne une promesse, on n'oublie pas le await devant)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/lists`);

      // Si la requête n'a pas fonctionné, response.ok sera a `false`. Dans ce cas je vais déclancher une erreur à la main pour passé dans mon catch
      if(!response.ok) {
        throw new Error("Erreur de chargement des données");
      }

      // Ici, je vais récupérer depuis le format json (format que mon api retourne) les données.
      // Attention, response.json() retourne une promesse, on n'oublie pas le await devant.
      const lists = await response.json();

      console.log(lists);

      // Je boucle sur chacune de mes villes pour les afficher dans le DOM
      for(const list of lists) {
        listModule.makeListInDOM(list);

        // Pour chaque card de ma liste, je créer la card dans le DOM
        for(const card of list.cards) {
          cardModule.makeCardInDOM(card);

          for(const label of card.labels) {
            labelModule.makeLabelInDOM(label, card.id);
          }
        }
      }
    } catch(e) {
      console.error(e);
      alert(e);
    }
  },

  /**
   * Appeler lors du double click sur le titre de la liste
   * @param {MouseEvent} event
   */
  showEditForm(event) {
    // Je récupère le titre de la liste
    const titleElm = event.currentTarget;
    const formElm = titleElm
      .closest("div") // A partir du titre, je vais récupérer la div parente la plus proche
      .querySelector("form"); // Je descend pour récupérer mon formulaire

    // Je cache le titre et je montre le formulaire
    titleElm.classList.add("is-hidden");
    formElm.classList.remove("is-hidden");
  },

  /**
   * Méthode appeler lors de la soumission du formulaire d'édition de liste
   * @param {SubmitEvent} event
   */
  async handleSubmitEditListForm(event) {
    // On annule le comportement par défaut du formulaire
    event.preventDefault();

    const formElm = event.currentTarget;
    // On récupère les données du formulaire
    const formData = new FormData(formElm);

    // Je souhaite récupérer l'id de la liste afin de pouvoir faire ma requête sur la bonne liste
    // L'id est stocker dans un attribut data-list-id de la div qui contient le formulaire
    const listElm = formElm.closest("[data-list-id]");
    const listId = listElm.dataset.listId;

    // Je récupère mon titre de liste car je vais en avoir besoin dans le cas du success de l'appel API ET dans tous les autres cas
    const titleElm = listElm.querySelector(".list-title");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/lists/${listId}`, {
        method: "PATCH",
        body: formData
      });

      if(!response.ok) {
        throw new Error("Erreur de chargement des données");
      }

      const list = await response.json();
      // Si je suis ici, c'est que la modification c'est bien passé.
      // Je vais donc mettre à jour le titre de ma liste
      titleElm.textContent = list.name;

    } catch(e) {
      console.error(e);
      alert(e);
    }

    // Dans tous les cas, si je suis ici, c'est que ma requête est terminé. Que cela ai réussi ou non.
    // Je vais donc cacher le formulaire et afficher le titre
    formElm.classList.add("is-hidden");
    titleElm.classList.remove("is-hidden");
  },

  /**
   * Méthode appeler lors du click sur le bouton de suppression de liste
   * @param {MouseEvent} event
   */
  async handleDeleteList(event) {
    // On demande a l'utilisateur si il est sur de vouloir supprimer la liste, si il ne l'est pas, on arrête la fonction
    if(!confirm("Etes vous sur de vouloir supprimer cette liste ?")) {
      return;
    }
    const removeBtnElm = event.currentTarget;

    // J'ai besoin de récupérer l'id de ma liste
    const listElm = removeBtnElm.closest("[data-list-id]");
    const listId = listElm.dataset.listId;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/lists/${listId}`, {
        method: "DELETE"
      });

      if(!response.ok) {
        throw new Error("Erreur de chargement des données");
      }

      // Si je suis ici, c'est que ma requête a bien fonctionné
      // Je peux donc supprimer la liste du DOM
      listElm.remove();
    } catch(e) {
      console.error(e);
      alert(e);
    }
  },

  handleDropList() {
    // Je récupère toutes les listes.
    // En les récupérant avec le querySelectorAll elle seront déjà récupérer dans le bon ordre.
    // Ainsi l'index coincidera avec la position de la liste
    const listElms = document.querySelectorAll("[data-list-id]");

    // Je boucle sur chacune des listes pour mettre à jour leur position
    listElms.forEach((listElm, index) => {
      // Je récupère l'id de ma liste
      const listId = listElm.dataset.listId;

      // Je créer un formData vierge (sans données)
      const formData = new FormData();
      // Je rajoute dedans la position de ma liste
      formData.append("position", index);

      // Je fais ma requête pour mettre à jour la position de ma liste
      fetch(`${import.meta.env.VITE_API_URL}/lists/${listId}`, {
        method: "PATCH",
        body: formData
      });
    });
  }
}
