/// <reference types = 'cypress'/>

import GlobalPage from '../pages/globalPage';
import GlobalElements from '../elements/globalElements';
import LoginElements from '../elements/loginElements';

const globalPage = new GlobalPage();
const globalElements = new GlobalElements();
const loginElements = new LoginElements();

export default class LoginPage {
	login(email, password) {
		cy.intercept('GET', '**/accounts/me').as('getMe');
		cy.intercept('POST', '**/login').as('login');
		globalPage.visitLoginPage();
		this.insertEmailValue(email);
		this.insertPasswordValue(password);
		this.submitLoginForm();
		cy.wait('@login')
			.its('response.body')
			.then((resBody) => {
				const token = resBody.token;
				Cypress.env('token', token);
			});
	}

	confirmLoginPageIsOpened() {
		globalPage.isElementsDisplayed([
			loginElements.EMAIL_INPUT,
			loginElements.PASSWORD_INPUT,
			loginElements.CONFIRM_BUTTON,
			globalElements.LOGO,
		]);
	}

	submitLoginForm() {
		globalPage.clickOnElement(loginElements.CONFIRM_BUTTON);
	}

	verifyEmailErrorMessage(emailError) {
		cy.get('.invalid-feedback').eq(0).should('be.visible').invoke('text').should('eq', emailError);
	}

	verifyPasswordErrorMessage(passwordError) {
		cy.get('.invalid-feedback')
			.eq(1)
			.should('be.visible')
			.invoke('text')
			.should('eq', passwordError);
	}

	insertEmailValue(emailValue) {
		globalPage.fillInputField(loginElements.EMAIL_INPUT, emailValue);
	}

	insertPasswordValue(passwordValue) {
		globalPage.fillInputField(loginElements.PASSWORD_INPUT, passwordValue);
	}

	verifyGeneralAlertMessage(invalidCredentialsError) {
		globalPage.isElementDisplayedWithText(
			loginElements.GENERAL_ALERT_MESSAGE,
			invalidCredentialsError
		);
	}

	verifyToastMessage(toastMessageTitle, toastMessageText) {
		globalPage.isElementDisplayedWithText(loginElements.TOAST_MESSAGE_TITLE, toastMessageTitle);
		globalPage.isElementDisplayedWithText(loginElements.TOAST_MESSAGE, toastMessageText);
	}

	verifyUserRedirctedToHomePage() {
		globalPage.isElementDisplayedWithText(globalElements.MAIN_TITLE, 'Home');
	}
}
