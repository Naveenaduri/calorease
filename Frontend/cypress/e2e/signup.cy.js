// cypress/integration/signup.cy.js

describe('Signup Form', () => {
    var randomNumber = Math.floor(Math.random()*90000) + 10000 
    it('successfully submits the signup form', () => {
      cy.visit('/signup'); // Replace with the actual path
  
      // Fill out the form
      cy.get('#firstname').type('John');
      cy.get('#lastname').type('Snow');
      cy.get('#email').type('john.snow@'+randomNumber+'example.com');
      cy.get('#phone').type('1234567890');
      cy.get('#password').type('GameofThrones@123');
      cy.get('#confirmpassword').type('GameofThrones@123');
  
      // Submit the form
      cy.get('form').submit();
  
      // Assert that the success message is displayed
      cy.get('.text-success').should('contain', 'Registration successful!');
    });
  
    it('handles server-side errors', () => {
      // Mock the API response to simulate a server error
      cy.intercept('POST', 'http://157.245.250.228:3001/api/signup', {
        statusCode: 500,
        body: { error: 'Server error' },
      });
  
      cy.visit('/signup'); // Replace with the actual path
  
      // Fill out the form
      cy.get('#firstname').type('John');
      cy.get('#lastname').type('Doe');
      cy.get('#email').type('john.doe@'+randomNumber+'example.com');
      cy.get('#phone').type('1234567890');
      cy.get('#password').type('password123');
      cy.get('#confirmpassword').type('password123');
  
      // Submit the form
      cy.get('form').submit();
  
      // Assert that server error message is displayed
      cy.get('.text-danger').should('contain', 'Server error');
    });
  });
  