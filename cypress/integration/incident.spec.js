describe("Live status", () => {
  beforeEach(() => {
    cy.visit("/incident/8");
    cy.wait(2000);
  });
  it("has multiple status messages", () => {
    cy.get("article").should("have.lengthOf.above", 1);
  });
});
