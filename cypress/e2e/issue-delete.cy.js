// Test Case 1: Issue Deletion:

describe('Issue deleting', () => {
    beforeEach(() => {
      cy.visit('/')
      cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
        cy.visit(url + '/board');
        cy.contains('This is an issue of type: Task.').click()
      })
    })
  
    it('Should delete the issue successfully', () => {
      cy.get('[data-testid="modal:issue-details"]').should('be.visible')
      cy.get('[data-testid="icon:trash"]').click()
      cy.get('[data-testid="modal:confirm"]').should('be.visible').within(() => {
        cy.contains('Delete issue').click()
      })
      cy.get('[data-testid="modal:confirm"]').should('not.exist')
      cy.get('[data-testid="board-list:backlog"]').should('be.visible').and('have.length', 1).within(() => {
        cy.get('[data-testid="list-issue"]').should('have.length', 3);
        cy.contains('This is an issue of type: Task.').should('not.exist')
      })
    })
  // Test Case 2: Issue Deletion Cancellation

    describe('Issue deletion cancellation', () => {
      beforeEach(() => {
        cy.visit('/')
        cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
          cy.visit(url + '/board')
          cy.contains('This is an issue of type: Task.').click();
        })
      })

      it('Should cancel issue deletion', () => {
        cy.get('[data-testid="modal:issue-details"]').should('be.visible');
        cy.get('[data-testid="icon:trash"]').click()
        cy.get('[data-testid="modal:confirm"]').should('be.visible').within(() => {
          cy.contains('Cancel').click()
        });
        cy.get('[data-testid="modal:confirm"]').should('not.exist')
        cy.get('[data-testid="board-list:backlog"]').should('be.visible').and('have.length', '1').within(() => {
          cy.get('[data-testid="list-issue"]').should('have.length', 4)
          cy.contains('This is an issue of type: Task.').should('exist')
        })
      })
    })
  })
