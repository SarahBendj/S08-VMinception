import Sortable from "sortablejs"
import { listModule } from "./list"
import { utilsModule } from "./utils"
import { cardModule } from "./card"
import { labelModule } from "./label";

// on objet qui contient des fonctions
const app = {

  // fonction d'initialisation, lancée au chargement de la page
  init: function () {
    console.log("app.init !");

    app.addListenerToActions();

    listModule.getListsFromAPI();
  },

  /**
   * Ajoute les écouteurs d'évènements au chargement de ma page
   */
  addListenerToActions() {
    // Je récupère le bouton pour ouvrir la modale d'ajout de liste
    const addListBtnElm = document.querySelector("#addListButton");
    addListBtnElm.addEventListener("click", listModule.showAddListModal);

    // Je vais récupérer les boutons close de mes modales.
    // Lorsque je vais cliquer dessus, je vais fermer la modale
    const closeModalBtnElms = document.querySelectorAll(".modal .close");

    // Je vais boucler sur mes boutons close pour rajouter mon event listener de fermeture de modale
    for(const closeModalBtnElm of closeModalBtnElms) {
      closeModalBtnElm.addEventListener("click", utilsModule.hideModals);
    }
    // closeModalBtnElms.forEach(closeModalBtnElm => {
    //   closeModalBtnElm.addEventListener('click', utilsModule.hideModals);
    // });

    // J'intercepte la soumission du formulaire d'ajout de liste
    const formAddListElm = document.querySelector("#addListModal form");

    formAddListElm.addEventListener("submit", listModule.handleAddListForm);

    // Je récupère tous les boutons pour ouvrir la modale d'ajout de carte
    // Plus utile car on a plus de liste dans le DOM au chargement de la page
    // const addCardBtnElms = document.querySelectorAll('.add-card-btn');

    // for(const addCardBtnElm of addCardBtnElms) {
    //   addCardBtnElm.addEventListener('click', cardModule.showAddCardModal);
    // }

    // Je récupère le formulaire d'ajout de carte
    const formAddCardElm = document.querySelector("#addCardModal form");

    // J'intercepte la soumission du formulaire d'ajout de carte
    formAddCardElm.addEventListener("submit", cardModule.handleAddCardForm);

    // Click sur le bouton de gestion des labels
    const manageLabelsBtnElm = document.querySelector("#manageLabelsButton");
    manageLabelsBtnElm.addEventListener("click", labelModule.showManageLabelsModal);

    // J'intercepte la soumission du formulaire de création de tag pour gérer moi-même côté navigateur
    const formCreateLabel = document.querySelector("#formAddLabel");
    formCreateLabel.addEventListener("submit", labelModule.handleAddLabelForm);

    const cardListContainerElm = document.querySelector(".card-lists");
    Sortable.create(cardListContainerElm, {
      onUpdate: listModule.handleDropList,
    });
  },
};


// on accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init
document.addEventListener("DOMContentLoaded", app.init );
