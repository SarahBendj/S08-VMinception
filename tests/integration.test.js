const frisby = require("frisby");

const API_ENDPOINT = "http://localhost:3000";
const TYPES = frisby.Joi;

describe("LIST routes", () => {
  const LIST_ENDPOINT = `${API_ENDPOINT}/lists`;

  describe("getAllLists", () => {
    it("should return a status of 200 and json headers", function () {
      return frisby
        .get(LIST_ENDPOINT)
        .expect("status", 200)
        .expect("header", "Content-Type", /json/);
    });

    it("should return an array of lists with the right formats", function () {
      return frisby
        .get(LIST_ENDPOINT)
        .expect("jsonTypes", "*", {
          id: TYPES.number().required(),
          position: TYPES.number().required(),
          name: TYPES.string().required()
        });
    });
  });

  describe("createList", () => {
    it("should create and return a new list", async () => {
      return frisby
        .post(LIST_ENDPOINT, {
          position: 42,
          name: "Ma liste de test"
        })
        .expect("jsonTypes", {
          id: TYPES.number().required(),
          position: 42,
          name: "Ma liste de test"
        });
    });
  });
});
