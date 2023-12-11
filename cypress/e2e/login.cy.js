///<reference types = "cypress"/>

import GlobalPage from '../pages/globalPage';
import LoginPage from '../pages/loginPage';

const globalPage = new GlobalPage();
const loginPage = new LoginPage();
const incorrectFormatEmail = 'branislav+gmail.com';
const passwordLessThen6 = 'con12';
const incorrectPassword = 'constel1234';
const correctPassword = Cypress.env('user').baneUser.password;
const incorrectEmail = 'branislav985@gmail.com2';
const correctEmail = Cypress.env('user').baneUser.email;
const emptyEmailError = 'Email field is required.';
const emptyPasswordError = 'Password field is required.';
const formatEmailError = 'Email format is not valid.';
const shortPasswordError = 'Please provide a minimum of 6 characters';
const invalidCredentialsError = 'An error occurred during login.';
const toastMessageTitle = 'Login Successful';
const toastMessageText = "Welcome back! You've successfully logged in to your account.";

describe('Log in functionality', () => {
	beforeEach(() => {
		globalPage.visitLoginPage();
		loginPage.confirmLoginPageIsOpened();
	});

	it('Verify error handling on log in flow', () => {
		//Empty input fields
		loginPage.submitLoginForm();
		loginPage.verifyEmailErrorMessage(emptyEmailError);
		loginPage.verifyPasswordErrorMessage(emptyPasswordError);

		//Incorrect email format
		loginPage.insertEmailValue(incorrectFormatEmail);
		loginPage.submitLoginForm();
		loginPage.verifyEmailErrorMessage(formatEmailError);

		//Password less then 6 characters
		loginPage.insertPasswordValue(passwordLessThen6);
		loginPage.submitLoginForm();
		loginPage.verifyPasswordErrorMessage(shortPasswordError);

		//Incorrect password
		loginPage.insertEmailValue(correctEmail);
		loginPage.insertPasswordValue(incorrectPassword);
		loginPage.submitLoginForm();
		loginPage.verifyGeneralAlertMessage(invalidCredentialsError);

		//Incorrect email
		loginPage.insertEmailValue(incorrectEmail);
		loginPage.insertPasswordValue(correctPassword);
		loginPage.submitLoginForm();
		loginPage.verifyGeneralAlertMessage(invalidCredentialsError);
	});

	it('Verify success toast message and user is redirected to home page after successfully log in', () => {
		loginPage.insertEmailValue(correctEmail);
		loginPage.insertPasswordValue(correctPassword);
		loginPage.submitLoginForm();
		loginPage.verifyToastMessage(toastMessageTitle, toastMessageText);
		loginPage.verifyUserRedirctedToHomePage();
	});
});
