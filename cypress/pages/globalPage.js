import LoginElements from '../elements/loginElements';

const loginElements = new LoginElements();

export default class GlobalPage {
	visitLoginPage() {
		cy.visit(Cypress.env('urls').LoginProd);
	}

	clickOnElement(element) {
		cy.get(element).click();
	}

	fillInputField(element, text) {
		cy.get(element).clear().type(text);
	}

	isElementDisplayed(element) {
		cy.get(element).should('be.visible');
	}

	isElementDisplayedWithText(element, text) {
		cy.get(element).should('be.visible').invoke('text').should('equal', text);
	}

	isElementContainsText(element, text) {
		cy.get(element).invoke('text').should('contain', text);
	}

	isElementsDisplayed(elements) {
		elements.forEach((element) => {
			cy.get(element).should('be.visible');
		});
	}

	isElementsDisplayedWithText(elements, texts) {
		if (elements.length == 1) {
			cy.get(elements[0]).each(($elem, index) => {
				// cy.wrap($elem).should('be.visible').invoke('text').should('equal', texts[index]);
				expect($elem).to.be.visible;
				expect($elem.text()).equal(texts[index]);
			});
		} else {
			elements.forEach((element, index) => {
				cy.get(element).should('be.visible').invoke('text').should('equal', texts[index]);
			});
		}
	}

	isElementDisabled(element) {
		if (cy.get(element).should('be.disabled')) {
			return true;
		} else {
			return false;
		}
	}

	isElementEnabled(element) {
		if (cy.get(element).should('be.enabled')) {
			return true;
		} else {
			return false;
		}
	}
}
