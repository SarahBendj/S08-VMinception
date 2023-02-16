export const labelModule = {
  /**
   *
   * @param {{id: Number, name: String}} label
   * @param {Number} cardId
   */
  makeLabelInDOM(label, cardId) {
    const labelElm = labelModule.createLabelElm(label);
    const labelContainerElm = document.querySelector(`[data-card-id="${cardId}"] .label-list`);

    labelElm.addEventListener("dblclick", labelModule.removeAssociationWithCard);

    labelContainerElm.append(labelElm);
  },

  /**
   * Méthode qui s'occupe de créer mon élément HTML label
   * @param {{id: Number, name: String}} label
   * @returns
   */
  createLabelElm(label) {
    const labelElm = document.createElement("span");
    labelElm.classList.add("tag");
    labelElm.dataset.labelId = label.id;
    labelElm.textContent = label.name;
    return labelElm;
  },

  async openModalAddLabel(event) {
    // On récupère la modal et on l'ouvre
    const modalElm = document.querySelector("#associateLabelToCardModal");

    modalElm.classList.add("is-active");

    // Je récupère la carte sur laquel on à cliquer sur le bouton +
    const cardElm = event.currentTarget.closest("[data-card-id]");
    const cardId = cardElm.dataset.cardId;
    // Je vais renseigner l'input ayant l'info sur le cardId
    const inputCardIdElm = modalElm.querySelector("input[name=\"cardId\"]");
    inputCardIdElm.value = cardId;

    // Je vais afficher tous les labels dans ma modale
    const labels = await labelModule.getAllLabels();

    const labelsContainerElm = modalElm.querySelector(".list-label");
    // Afin de ne pas voir les mêmes labels s'accumuler à chaque fois que l'on ouvre notre modal, je vide le contenu avant de renseigner les labels
    labelsContainerElm.textContent = "";

    labels.forEach((label) => {
      const labelElm = labelModule.createLabelElm(label);

      labelElm.addEventListener("dblclick", labelModule.handleAssociateToCard)
      labelsContainerElm.append(labelElm);
    });
  },

  /**
   * Appel mon API pour récupérer la liste de mes labels
   * @returns
   */
  async getAllLabels() {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/labels`);
      if(!response.ok) {
        throw new Error(response.status);
      }

      return response.json();
    } catch(e) {
      console.error(e);
      alert(e);
    }
  },

  async handleAssociateToCard(event) {
    const labelElm = event.currentTarget;
    // Le labelId est stocker sur l'élément clicker
    const labelId = labelElm.dataset.labelId;

    // On va chercher ensuite le cardId qui est stocker dans un input hidden dans ma modal
    const inputCardIdElm = document.querySelector("#associateLabelToCardModal input[name=\"cardId\"]")

    const cardId = inputCardIdElm.value;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/cards/${cardId}/labels/${labelId}`, {
        method: "PUT",
      });

      if(!response.ok) {
        throw new Error(response.status);
      }

      // Je récupère ma card avec les labels associés
      const card = await response.json();

      // Je vide toutes les labels affiche dans ma carte
      const labelContainerElm = document.querySelector(`[data-card-id="${card.id}"] .label-list`);

      labelContainerElm.textContent = "";

      card.labels.forEach((label) => {
        labelModule.makeLabelInDOM(label, card.id);
      });
    } catch(e) {
      console.error(e);
      alert(e);
    }
  },
  async removeAssociationWithCard(event) {
    const labelElm = event.currentTarget;
    // Je récupère l'id du label qui est situer sur l'élément cliquer
    const labelId = labelElm.dataset.labelId;

    // Je récupère l'id de ma carte qui est situer au dessus de mon label
    const cardElm = labelElm.closest("[data-card-id]");
    const cardId = cardElm.dataset.cardId;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/cards/${cardId}/labels/${labelId}`, {
        method: "DELETE"
      });

      if(!response.ok) {
        throw new Error(response.status);
      }

      labelElm.remove();
    } catch(e) {
      console.error(e);
      alert(e);
    }
  },
  async showManageLabelsModal() {
    const modalElm = document.querySelector("#manageLabelsModal");
    modalElm.classList.add("is-active");

    try {
      // On récupère tous les labels
      const labels = await labelModule.getAllLabels();

      // On réinitialise le contenu de notre liste de label
      const labelListElm = modalElm.querySelector(".labels-list");
      labelListElm.textContent = "";

      // On ajoute tous les labels dans notre modal sous forme de formulaire
      labels.forEach(label => {
        const formLabelElm = labelModule.createLabelFormElm(label);
        labelListElm.append(formLabelElm);
      })

    } catch (e) {
      alert(e);
    }

  },

  /**
   * Créer ou modifie le label dans notre API suite a une soumission de formulaire
   * @param event
   * @returns {Promise<void>}
   */
  async handleAddLabelForm(event) {
    event.preventDefault();

    // On récupère les données du formulaire dans un formData
    const formData = new FormData(event.currentTarget);

    // Si j'ai un id je suis dans le cas de la modif et donc du PATH, sinon je suis en création et donc en POST
    const labelId = formData.get("id");

    try {
      // Appel de la bonne API pour soit créer soit modifier le label
      const response = await fetch(`${import.meta.env.VITE_API_URL}/labels/${labelId || ""}`, {
        method: labelId ? "PATCH" : "POST",
        body: formData
      });

      if(!response.ok) {
        throw new Error(response.status);
      }

      // On récupère le label retourner par l'API
      const label = await response.json();

      // Dans le cas de la création on rajoute le label dans notre liste de label de la modale
      if(!labelId) {
        // On appel la méthode qui ajoute la carte dans le DOM, on lui passe un objet contenant les données de notre carte (ne pas oublier l'id de notre liste
        const labelElm = labelModule.createLabelFormElm(label);
        document.querySelector("#manageLabelsModal .labels-list").append(labelElm);
        // On réinitialise la valeur name de notre formulaire
        event.target.querySelector("[name=\"name\"]").value = "";
      } else { // Sinon je vais modifier tous les labels associés aux cartes ayant le même id que le label modifier
        const labelToUpdateElms = document.querySelectorAll(`[data-label-id="${labelId}"]`);
        labelToUpdateElms.forEach(labelToUpdateElm => {
          labelToUpdateElm.textContent = label.name;
        })
      }
    } catch (e) {
      alert(e);
    }
  },

  /**
   * Retourne un formulaire pour le label passé en paramètre
   * @param label
   * @returns {HTMLElement}
   */
  createLabelFormElm(label) {
    // Je récupère le formulaire de création de label
    const orignalFormElm = document.getElementById("formAddLabel");
    // On clone le formulaire récupéré
    const formLabelElm = document.importNode(orignalFormElm, true);
    // Un id doit être unique, je le supprime donc pour les autres form que je vais créer
    formLabelElm.removeAttribute("id");

    // On set les données de notre formulaire
    formLabelElm.querySelector("[name=\"name\"]").value = label.name;
    formLabelElm.querySelector("[name=\"id\"]").value = label.id;

    // Je mets un bouton pour gérer la suppresion
    const deleteBtnElm = document.createElement("button");
    deleteBtnElm.classList.add("button", "is-small", "is-danger");
    deleteBtnElm.type = "button";
    deleteBtnElm.textContent = "Supprimer";

    // ajout des événements sur notre label (suppression / modification)
    deleteBtnElm.addEventListener("click", labelModule.handleDeleteLabel);
    formLabelElm.addEventListener("submit", labelModule.handleAddLabelForm);

    formLabelElm.querySelector(".field").append(deleteBtnElm);

    return formLabelElm
  },

  /**
   * Supprime un label
   * @param event
   * @returns {Promise<void>}
   */
  async handleDeleteLabel(event) {
    if(!confirm("Êtes-vous sûr de vouloir supprimer ce label ?")) {
      return;
    }
    event.preventDefault();

    // Récupère l'id du label afin d'appeler l'API pour le supprimer
    const formElm = event.currentTarget.closest("form");
    const labelId = formElm.querySelector("[name=\"id\"]").value;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/labels/${labelId}`, {
        method: "DELETE"
      });

      if(!response.ok) {
        throw new Error(response.status);
      }

      // SI la suppression à fonctionner on va chercher tous les endroits ou le label est mis pour le supprimer
      const labelElms = document.querySelectorAll(`[data-label-id="${labelId}"]`);
      for(const labelElm of labelElms) {
        labelElm.remove();
      }

      // On supprime également le formulaire du label dans notre liste de label
      formElm.remove();
    } catch (e) {
      alert(e);
    }
  }
}
