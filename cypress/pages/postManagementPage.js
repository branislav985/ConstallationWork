///<reference types = 'Cypress'/>
import GlobalPage from './globalPage';
import HomePageElements from '../elements/homePageElements';
import GlobalElements from '../elements/globalElements';
import PostManagementElements from '../elements/postManagementElements';

const globalPage = new GlobalPage();
const homePageElements = new HomePageElements();
const globalElements = new GlobalElements();
const postManagementElements = new PostManagementElements();

export default class PostManagementPage {
	verifyHomepageElements() {
		globalPage.isElementsDisplayed([
			homePageElements.HOME_LABEL,
			homePageElements.LOG_OUT_LABEL,
			globalElements.LOGO,
		]);
		globalPage.isElementDisplayedWithText(globalElements.MAIN_TITLE, 'Home');
	}

	waitAndVerifyAPIsStatus() {
		cy.intercept('GET', '**/accounts/me').as('getMe');
		cy.intercept('GET', '**/posts').as('getPosts');
		cy.wait('@getMe', { timeout: 10000 }).its('response.statusCode').should('eq', 200);
		cy.wait('@getPosts', { timeout: 10000 }).its('response.statusCode').should('eq', 200);
	}

	getFirstLikeButtonAndCheckLikeStatus() {
		cy.get('.post__actions').first().find('button').first().invoke('attr', 'class').as('className');
	}

	getLikesNumberForLatestPostBeforeLiking() {
		cy.get('.post__actions')
			.first()
			.find('button')
			.first()
			.invoke('text')
			.then(parseInt)
			.as('likeNumberBeforeLiking');
	}

	clickLikeOrDislikeForLatestPost() {
		cy.get('.post__actions').first().find('button').first().click();
	}

	getLikesNumberForLatestPostAfterLiking() {
		cy.get('.post__actions')
			.first()
			.find('button')
			.first()
			.invoke('text')
			.then(parseInt)
			.as('likeNumberAfterLiking');
	}

	verifyLikesNumberDependingOnLikeStatus() {
		this.getFirstLikeButtonAndCheckLikeStatus();
		cy.get('@className').then((likeStatus) => {
			if (likeStatus == 'btn btn-tertiary') {
				cy.get('@likeNumberBeforeLiking').then((numberBeforeLike) => {
					cy.get('@likeNumberAfterLiking').then((numberAfterLike) => {
						expect(numberBeforeLike - 1).to.equal(numberAfterLike);
					});
				});
				cy.log('Disliking is working as expected');
			} else {
				cy.get('@likeNumberBeforeLiking').then((numberBeforeLike) => {
					cy.get('@likeNumberAfterLiking').then((numberAfterLike) => {
						expect(numberBeforeLike + 1).to.equal(numberAfterLike);
					});
				});
				cy.log('Liking is working as expected');
			}
		});
	}

	getCommentsNumberForLatestPost_BeforeNewPost() {
		cy.get('.post__actions')
			.first()
			.find('button')
			.last()
			.invoke('text')
			.then(parseInt)
			.as('commentsNumberBeforePost');
	}

	getCommentsNumberForLatestPost_AfterNewPost() {
		cy.get('.post__actions')
			.first()
			.find('button')
			.last()
			.invoke('text')
			.then(parseInt)
			.as('commentsNumberAfterPost');
	}

	verifyNuberOfCommentsForLatestPostIsIncreaedByOne() {
		cy.get('@commentsNumberBeforePost').then((numBefore) => {
			cy.get('@commentsNumberAfterPost').then((numAfter) => {
				expect(numBefore + 1).to.equal(numAfter);
			});
		});
	}

	clickOnCommentButtonForLatestPost() {
		cy.get('.post__actions').first().find('button').last().click();
	}

	writeComment(randomText) {
		globalPage.fillInputField(postManagementElements.WRITE_COMMENT_INPUT, randomText);
	}

	clickSendToPostComment() {
		globalPage.clickOnElement(postManagementElements.POST_COMMENT_BUTTON);
	}

	verifyTextOfPostedComment(randomText) {
		cy.get(postManagementElements.ALL_COMMENTS)
			.last()
			.find('p')
			.invoke('text')
			.should('eq', randomText);
	}

	closeCommentWindow() {
		cy.get(postManagementElements.CLOSE_COMMENT_BUTTON).first().click();
	}

	findLastPostedComment(randomText) {
		cy.get(postManagementElements.ALL_COMMENTS)
			.last()
			.find('p')
			.invoke('text')
			.should('eq', randomText);
	}

	deleteLastPostedComment() {
		cy.get(postManagementElements.ALL_COMMENTS)
			.last()
			.find(postManagementElements.DELETE_COMMENT_BUTTON)
			.first()
			.click();
	}

	verifySuccessToastMessage(deleteToastMessage) {
		globalPage.isElementDisplayedWithText(
			postManagementElements.DELETE_TOAST_MESSAGE_TITLE,
			'Success!'
		);
		globalPage.isElementDisplayedWithText(
			postManagementElements.DELETE_TOAST_MESSAGE_TEXT,
			deleteToastMessage
		);
	}

	verifyNuberOfCommentsForLatestPostIsDicreasedByOne() {
		cy.get('@commentsNumberBeforePost').then((numBefore) => {
			cy.get('@commentsNumberAfterPost').then((numAfter) => {
				expect(numBefore - 1).to.equal(numAfter);
			});
		});
	}

	verifyNewPostButtonIsDisabled() {
		globalPage.isElementDisabled(postManagementElements.NEW_POST_BUTTON);
	}

	writeAPost(randomPostText) {
		globalPage.fillInputField(postManagementElements.NEW_POST_INPUT, randomPostText);
	}

	submitPost() {
		cy.intercept('POST', '**/posts').as('newPost');
		globalPage.isElementEnabled(postManagementElements.NEW_POST_BUTTON);
		globalPage.clickOnElement(postManagementElements.NEW_POST_BUTTON);
		cy.wait('@newPost')
			.its('response.body')
			.then((resBody) => {
				cy.task('save', { index: 'postId', value: resBody.post.post_id });
			});
	}

	verifyUserDataOnThePost() {
		cy.task('load', 'userName').then((username) => {
			cy.get(postManagementElements.LAST_POST)
				.find('.user-details__username')
				.invoke('text')
				.should('eq', '@' + username);
		});

		cy.task('load', 'fullName').then((fullName) => {
			cy.get(postManagementElements.LAST_POST)
				.find('.user-details__fullName')
				.invoke('text')
				.should('eq', fullName);
		});
	}

	verifyDateOnThePost() {
		cy.get(postManagementElements.LAST_POST)
			.find('.post__informations__timePosted')
			.invoke('text')
			.then((dateText) => {
				const date = new Date(dateText);
				const today = new Date();
				expect(date).to.be.lte(today);
			});
	}

	verifyPostText(randomPostText) {
		cy.get(postManagementElements.LAST_POST)
			.find('.post__description')
			.invoke('text')
			.should('eq', randomPostText);
	}

	confirmLikesNumberIs0() {
		cy.get('.post__actions')
			.first()
			.find('button')
			.first()
			.invoke('text')
			.then(parseInt)
			.should('eq', 0);
	}

	confirmCommentsNumberIs0() {
		cy.get('.post__actions')
			.first()
			.find('button')
			.last()
			.invoke('text')
			.then(parseInt)
			.should('eq', 0);
	}

	verifyNewPostIsDisplayedCorrectly(randomPostText) {
		this.verifyUserDataOnThePost();
		this.verifyDateOnThePost();
		this.verifyPostText(randomPostText);
		this.confirmLikesNumberIs0();
		this.confirmCommentsNumberIs0();
	}

	clickOnLogOut() {
		cy.get(homePageElements.LOG_OUT_LABEL).click();
	}

	deleteCreatedPost() {
		const token = Cypress.env('token');
		cy.setCookie('token', `${token}`);
		cy.task('load', 'postId').then((postId) => {
			cy.request({
				method: 'DELETE',
				url: `https://api.hr.constel.co/api/v1/posts/${postId}`,
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-type': 'application/json',
				},
			});
		});
	}
}
