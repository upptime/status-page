describe("Live status", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.wait(2000);
  });
  it("has multiple status boxes", () => {
    cy.get("article.link").should("have.lengthOf.above", 2);
  });
  it("has past issues", () => {
    cy.get("article.down.link").should("have.lengthOf.above", 3);
  });
});
