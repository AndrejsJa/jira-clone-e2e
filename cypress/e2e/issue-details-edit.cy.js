
describe('Issue details editing', () => {
  const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
      cy.visit(url + '/board');
      cy.contains('This is an issue of type: Task.').click();
    });
  });

  it('Should update type, status, assignees, reporter, priority successfully', () => {
    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="select:type"]').click('bottomRight');
      cy.get('[data-testid="select-option:Story"]')
        .trigger('mouseover')
        .trigger('click');
      cy.get('[data-testid="select:type"]').should('contain', 'Story');

      cy.get('[data-testid="select:status"]').click('bottomRight');
      cy.get('[data-testid="select-option:Done"]').click();
      cy.get('[data-testid="select:status"]').should('have.text', 'Done');

      cy.get('[data-testid="select:assignees"]').click('bottomRight');
      cy.get('[data-testid="select-option:Lord Gaben"]').click();
      cy.get('[data-testid="select:assignees"]').click('bottomRight');
      cy.get('[data-testid="select-option:Baby Yoda"]').click();
      cy.get('[data-testid="select:assignees"]').should('contain', 'Baby Yoda');
      cy.get('[data-testid="select:assignees"]').should('contain', 'Lord Gaben');

      cy.get('[data-testid="select:reporter"]').click('bottomRight');
      cy.get('[data-testid="select-option:Pickle Rick"]').click();
      cy.get('[data-testid="select:reporter"]').should('have.text', 'Pickle Rick');

      cy.get('[data-testid="select:priority"]').click('bottomRight');
      cy.get('[data-testid="select-option:Medium"]').click();
      cy.get('[data-testid="select:priority"]').should('have.text', 'Medium');
    });
  });

  it('Should update title, description successfully', () => {
    const title = 'TEST_TITLE';
    const description = 'TEST_DESCRIPTION';

    getIssueDetailsModal().within(() => {
      cy.get('textarea[placeholder="Short summary"]')
        .clear()
        .type(title)
        .blur();

      cy.get('.ql-snow')
        .click()
        .should('not.exist');

      cy.get('.ql-editor').clear().type(description);

      cy.contains('button', 'Save')
        .click()
        .should('not.exist');

      cy.get('textarea[placeholder="Short summary"]').should('have.text', title);
      cy.get('.ql-snow').should('have.text', description);
    });
  });



  //Sprint #2, Bonus assignment

  it('Check the dropdown Priority', () => {
    getIssueDetailsModal().within(() => {
      const expectedValues = ['Highest', 'High', 'Medium', 'Low', 'Lowest'];
      const expectedLength = 5;
      const priorityOptions = [];

      const priorityOptionSelectors = [
        '[data-testid="select-option:Highest"]',
        '[data-testid="select-option:High"]',
        '[data-testid="select-option:Medium"]',
        '[data-testid="select-option:Low"]',
        '[data-testid="select-option:Lowest"]'
      ];

      cy.get('[data-testid="select:priority"]').click();

      // Loop through the selectors for each priority option
      for (const selector of priorityOptionSelectors) {
        // Click on the option to select it
        cy.get(selector).click();

        // Get the text value of the current option and push it to the array
        cy.get('[data-testid="select:priority"]').invoke('text').then((optionText) => {
          priorityOptions.push(optionText.trim());

          // Check if all expected options are collected before asserting
          if (priorityOptions.length === expectedLength) {
            // Assert that the priorityOptions array has the same length as the expected length
            expect(priorityOptions).to.have.length(expectedLength);
            // Assert that the priorityOptions array contains the expected values
            expect(priorityOptions).to.deep.equal(expectedValues);
          }
        });

        // Log the text value during each iteration
        cy.log(`Added option: ${selector}`);

        // Click on the priority field to reopen the dropdown
        cy.get('[data-testid="select:priority"]').click();
      }
    });
  })

  it('Check if the reporters name contains only characters', () => {
    getIssueDetailsModal().within(() => {
    // Log a message to verify that the test is at the expected page
    cy.log('Navigated to the issue details page');

    // Get the reporter name element
    cy.get('[data-testid="select:reporter"]').then(($reporterNameElement) => {
      // Log the selected element for debugging
      cy.log('Reporter Name Element:', $reporterNameElement);

      // Get the text content of the reporter name element
      const reporterName = $reporterNameElement.text();

      // Log the reporter name for debugging
      cy.log('Reporter Name:', reporterName);

      // Define a regular expression to match only characters (letters and spaces)
      const regex = /^[A-Za-z\s]+$/;

      // Assert that the reporter name matches the regular expression
      expect(reporterName).to.match(regex);
    });
  });
})
})
