// cypress/integration/signup-applitools.spec.js
const { eyesOpen, eyesCheckWindow, eyesClose } = require('@applitools/eyes-cypress');

describe('Signup Form with Applitools', () => {
  beforeEach(() => {
    eyesOpen({ appName: 'Your App Name', testName: 'Signup Form Test' });
  });

  it('should display the signup form correctly', () => {
    cy.visit('/signup'); // Replace with the actual path

    // Visual checkpoint for the entire page
    eyesCheckWindow('Signup Page');

    // Fill out the form
    cy.get('#firstname').type('John');
    cy.get('#lastname').type('Snow');
    cy.get('#email').type('john.snow@'+randomNumber+'example.com');
    cy.get('#phone').type('1234567890');
    cy.get('#password').type('GameofThrones@123');
    cy.get('#confirmpassword').type('GameofThrones@123');

    // Visual checkpoint for the filled-out form
    eyesCheckWindow('Filled-out Signup Form');

    // Submit the form
    cy.get('form').submit();

    // Visual checkpoint for the success message
    eyesCheckWindow('Registration Successful Message');
  });

  afterEach(() => {
    eyesClose();
  });
});
