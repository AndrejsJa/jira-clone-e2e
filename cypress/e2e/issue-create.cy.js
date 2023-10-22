import { faker } from '@faker-js/faker';

describe('Issue create', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
      //System will already open issue creating modal in beforeEach block  
      cy.visit(url + '/board?modal-issue-create=true');
    });
  });

  it('Should create an issue and validate it successfully', () => {
    //System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {

      cy.get('.ql-editor').type('My bug description');
      cy.get('input[name="title"]').type('Bug');

      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="select-option:Bug"]')
        .trigger('click');

      cy.get('[data-testid="select:reporterId"]').click();
      cy.get('[data-testid="select-option:Pickle Rick"]').click();

      cy.get('[data-testid="select:priority"]').click();
      cy.get('[data-testid="select-option:Highest"]').click();

      cy.get('button[type="submit"]').click();
    });

    //Assert that modal window is closed and successful message is visible
    cy.get('[data-testid="modal:issue-create"]').should('not.exist');
    cy.contains('Issue has been successfully created.').should('be.visible');

    //Reload the page to be able to see recently created issue
    //Assert that successful message has dissappeared after the reload
    cy.reload();
    cy.contains('Issue has been successfully created.').should('not.exist');

    //Assert than only one list with name Backlog is visible and do steps inside of it
    cy.get('[data-testid="board-list:backlog').should('be.visible').and('have.length', '1').within(() => {
      //Assert that this list contains 5 issues and first element with tag p has specified text
      cy.get('[data-testid="list-issue"]')
        .should('have.length', '5')
        .first()
        .find('p')
        .contains('Bug');
      //Assert that correct type icon is visible
      cy.get('[data-testid="icon:bug"]').should('be.visible');
    });
  });

  it('Should validate title is required field if missing', () => {
    //System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      //Try to click create issue button without filling any data
      cy.get('button[type="submit"]').click();

      //Assert that correct error message is visible
      cy.get('[data-testid="form-field:title"]').should('contain', 'This field is required');
    });
  });

  //Test Case 2: Random Data Plugin Issue Creation
  it('Should create an issue and validate it successfully', () => {

    const randomDescription = faker.lorem.paragraph();
    const randomTitle = faker.lorem.sentence();

    cy.get('[data-testid="modal:issue-create"]').within(() => {

      cy.get('.ql-editor').type(randomDescription);
      cy.get('input[name="title"]').type(randomTitle);

      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="icon:task"]')
        .trigger('click');

      cy.get('[data-testid="select:reporterId"]').click();
      cy.get('[data-testid="select-option:Baby Yoda"]').click();

      cy.get('[data-testid="select:priority"]').click();
      cy.get('[data-testid="select-option:Low"]').click();

      cy.get('button[type="submit"]').click();
    });

    //Assert that modal window is closed and successful message is visible
    cy.get('[data-testid="modal:issue-create"]').should('not.exist');
    cy.contains('Issue has been successfully created.').should('be.visible');

    //Reload the page to be able to see recently created issue
    //Assert that successful message has dissappeared after the reload
    cy.reload();
    cy.contains('Issue has been successfully created.').should('not.exist');

    //Assert than only one list with name Backlog is visible and do steps inside of it
    cy.get('[data-testid="board-list:backlog').should('be.visible').and('have.length', '1').within(() => {
      //Assert that this list contains 5 issues and first element with tag p has specified text
      cy.get('[data-testid="list-issue"]')
        .should('have.length', '5')
        .first()
        .find('p')
        .contains(randomTitle);
      //Assert that correct type icon is visible
      cy.get('[data-testid="icon:task"]').should('be.visible');
    });
  });


  //Sprint #2, Bonus assignment Task 3
  const title = ' Hello world! '; // Define the issue title with extra spaces

  it('Check that the application is removing unnecessary spaces on the board view', () => {
    // Create an issue with the specified title and a short summary
    cy.createIssue(title, 'Short summary of the issue');

    // Look for the created issue within the backlog by its title text (trimmed)
    cy.get('[data-testid="board-list:backlog"]').within(() => {
      // Use .invoke('text') to get the text content and trim it
      cy.contains(title.trim()).invoke('text').then((trimmedText) => {
        // Assert that the trimmed title text exists on the board view
        cy.contains(trimmedText).should('exist');
      });
    })
  })

});
