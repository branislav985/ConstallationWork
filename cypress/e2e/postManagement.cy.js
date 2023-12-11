///<reference types = 'Cypress'/>

import LoginPage from '../pages/loginPage';
import PostManagementPage from '../pages/postManagementPage';
import { faker } from '@faker-js/faker';

const loginPage = new LoginPage();
const postManagementPage = new PostManagementPage();
const correctPassword = Cypress.env('user').baneUser.password;
const correctEmail = Cypress.env('user').baneUser.email;
const baseUrlProd = Cypress.env('urls').BaseUrlProd;
const randomText = faker.lorem.sentence();
const deleteToastMessage = 'You have successfully deleted your comment post.';
const randomPostText = faker.lorem.sentence();
const successNewPostMessage = 'You have successfully created a new post.';

describe('Verify post management functionalities', () => {
	beforeEach(() => {
		cy.login(correctEmail, correctPassword);
		cy.visit(baseUrlProd);
	});

	it('Verify elements on Home page', () => {
		postManagementPage.verifyHomepageElements();
	});

	it('Verify APIs GET ME and GET POSTS are successfully loaded', () => {
		postManagementPage.waitAndVerifyAPIsStatus();
	});

	it('Verify new post functionality', () => {
		postManagementPage.verifyNewPostButtonIsDisabled();
		postManagementPage.writeAPost(randomPostText);
		postManagementPage.submitPost();
		postManagementPage.verifySuccessToastMessage(successNewPostMessage);
		postManagementPage.verifyNewPostIsDisplayedCorrectly(randomPostText);
	});

	it('Verify post liking - disliking functionality', () => {
		postManagementPage.getLikesNumberForLatestPostBeforeLiking();
		postManagementPage.clickLikeOrDislikeForLatestPost();
		postManagementPage.getLikesNumberForLatestPostAfterLiking();
		postManagementPage.verifyLikesNumberDependingOnLikeStatus();
		postManagementPage.getLikesNumberForLatestPostBeforeLiking();
		postManagementPage.clickLikeOrDislikeForLatestPost();
		postManagementPage.getLikesNumberForLatestPostAfterLiking();
		postManagementPage.verifyLikesNumberDependingOnLikeStatus();
	});

	it('Verify comment posting', () => {
		postManagementPage.getCommentsNumberForLatestPost_BeforeNewPost();
		postManagementPage.clickOnCommentButtonForLatestPost();
		postManagementPage.writeComment(randomText);
		postManagementPage.clickSendToPostComment();
		postManagementPage.verifyTextOfPostedComment(randomText);
		postManagementPage.closeCommentWindow();
		postManagementPage.getCommentsNumberForLatestPost_AfterNewPost();
		postManagementPage.verifyNuberOfCommentsForLatestPostIsIncreaedByOne();
	});

	it('Verify comment deletion', () => {
		postManagementPage.getCommentsNumberForLatestPost_BeforeNewPost();
		postManagementPage.clickOnCommentButtonForLatestPost();
		postManagementPage.findLastPostedComment(randomText);
		postManagementPage.deleteLastPostedComment();
		postManagementPage.verifySuccessToastMessage(deleteToastMessage);
		postManagementPage.closeCommentWindow();
		postManagementPage.getCommentsNumberForLatestPost_AfterNewPost();
		postManagementPage.verifyNuberOfCommentsForLatestPostIsDicreasedByOne();
	});

	it('Verify Log out functionality', () => {
		postManagementPage.clickOnLogOut();
		loginPage.confirmLoginPageIsOpened();
	});

	after(() => {
		postManagementPage.deleteCreatedPost();
	});
});
