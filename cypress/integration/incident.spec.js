describe("Incident details", () => {
  beforeEach(() => {
    cy.intercept("GET", /\/repos\/upptime\/upptime\/issues\/8(?:\?.*)?$/, {
      body: {
        body: "A deterministic incident fixture.",
        closed_at: "2020-08-10T11:18:56Z",
        created_at: "2020-08-09T06:43:36Z",
        state: "closed",
        title: "Scheduled Maintenance of Example Domain",
      },
    }).as("getIncident");
    cy.intercept("GET", /\/repos\/upptime\/upptime\/issues\/8\/comments(?:\?.*)?$/, {
      body: [
        {
          body: "**Investigating:** We are investigating this issue.",
          created_at: "2020-08-09T06:43:36Z",
          html_url: "https://github.com/upptime/upptime/issues/8#issuecomment-1",
          user: { html_url: "https://github.com/AnandChowdhary", login: "AnandChowdhary" },
        },
        {
          body: "**Fixed:** This issue is resolved.",
          created_at: "2020-08-09T11:08:06Z",
          html_url: "https://github.com/upptime/upptime/issues/8#issuecomment-2",
          user: { html_url: "https://github.com/AnandChowdhary", login: "AnandChowdhary" },
        },
      ],
    }).as("getIncidentComments");

    cy.visit("/incident/8", {
      onBeforeLoad(win) {
        win.localStorage.clear();
      },
    });
    cy.wait(["@getIncident", "@getIncidentComments"]);
  });

  it("renders incident comments without depending on public GitHub data", () => {
    cy.contains("Scheduled Maintenance of Example Domain");
    cy.contains("article", "Investigating:").should("contain", "We are investigating this issue.");
    cy.contains("article", "Fixed:").should("contain", "This issue is resolved.");
  });
});
