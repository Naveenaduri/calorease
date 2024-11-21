// cypress/integration/login.cy.js
describe('Login Flow', () => {
    it('should log in a user', () => {
      cy.visit('/login'); // Update the path according to your routes
  
      // Fill in the login form
      cy.get('#email').type('Johnsnow@gm.com');
      cy.get('#password').type('GameofThrones@123');
  
      // Submit the form
      cy.get('form').submit();
  
      // Check if the user is redirected to the budget page or another page indicating a successful login
      cy.url().should('include', '/budget'); // Update the expected URL
    });
  
    // Add more tests for other scenarios
  });
  