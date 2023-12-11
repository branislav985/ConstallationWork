// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import LoginPage from '../pages/loginPage';
import GlobalPage from '../pages/globalPage';
import PostManagementPage from '../pages/postManagementPage';

const loginPage = new LoginPage();
const globalPage = new GlobalPage();
const postManagementPage = new PostManagementPage();

Cypress.Commands.add('login', (email, password) => {
	cy.session(
		[email, password],
		() => {
			cy.intercept('POST', '**/login').as('login');
			cy.intercept('GET', '**/accounts/me').as('getMe');
			globalPage.visitLoginPage();
			loginPage.insertEmailValue(email);
			loginPage.insertPasswordValue(password);
			loginPage.submitLoginForm();
			cy.wait('@login')
				.its('response.body')
				.then((resBody) => {
					const token = resBody.token;
					Cypress.env('token', token);
				});
			cy.wait('@getMe', { timeout: 10000 })
				.its('response.body')
				.then((resBody) => {
					cy.task('save', { index: 'userName', value: resBody.account.username });
					cy.task('save', { index: 'fullName', value: resBody.account.full_name });
				});
			postManagementPage.verifyHomepageElements();
		},
		{
			// cacheAcrossSpecs: true,
			// validate() {
			// 	cy.visit('/');
			// },
		}
	);
});
