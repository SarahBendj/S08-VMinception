export const utilsModule = {
  /**
   * Méthode qui va gérer la fermeture de la modal que l'on souhaite fermer
   * @param {MouseEvent} event
   */
  hideModals(event) {
    // Je récépère la modale à partir du bouton sur lequel j'ai cliqué
    // Je récupère le bouton qui a déclenché l'évènement
    const btnCloseElm = event.target;

    // Je récupère la modale à partir du bouton
    const modalElm = btnCloseElm.closest(".modal");

    // Je ferme la modale en retirant la class "is-active" dessus
    modalElm.classList.remove("is-active");
  },
}
