import GatewayApi from "../api/GatewayApi";
import '../support/commands'


class IprimaPage {
  BASE_URL: string;

  constructor() {
    this.BASE_URL = Cypress.config('baseUrl') || '';
  }

  elements = {
    home: {
      buttonAcceptCookies: () => cy.get('#didomi-notice-agree-button'),
      linkSignIn: () => cy.get('.sign-in'),
      buttonProfile: () => cy.get('.profile').eq(0),
      currentProfileName: () => cy.get('.sidebar-header p.profile-name'),

    },
    login: {
      inputEmail: () => cy.get('input[type="email"]'),
      inputPassword: () => cy.get('input[type="password"]'),
      buttonSubmit: () => cy.get('button[type="submit"]'),
    },
    profile: {
      buttonProfile: (profile: string) => cy.contains('button', profile),
      buttonCreateBasicProfile: () => cy.get('.add-profile > :nth-child(1)'),
      inputProfileName: () => cy.get('.input.with-label'),
      selectGender: () => cy.get('.form-fields .select').eq(0).find('.select-toggle'),
      selectDateOfBirth: () => cy.get('.form-fields .select').eq(1).find('.select-toggle'),
      buttonCreateProfile: () => cy.get('.button.primary'),
      buttonEditProfiles: () => cy.get('.button.transparent.edit'),
      buttonRemoveProfile: () => cy.get('a.form-link').eq(3)
    },
    sideBar: {
      buttonEditProfile: () => cy.get('.link.edit.arrow'),
      buttonClose: () => cy.get('.close-button'),
    }
  };

  /**
   * Visit the page
   * @param path - The path to visit
   * @param cookies - Whether to accept cookies
   */
  visit(path: string = '', cookies: boolean = true) {
    cy.visit(this.BASE_URL + path);
    if(cookies) this.acceptCookies();
  }

  /**
   * Accept cookies
   */
  acceptCookies() {
    this.elements.home.buttonAcceptCookies().click();
  }

  /**
   * Login
   * @param email - The email to login
   * @param password - The password to login
   * @param profile - The profile to login
   */
  login(email: string, password: string, profile: string = 'QA') {
    GatewayApi.intercepts.POST_Request();

    this.visit();

    this.elements.home.linkSignIn().click();
    this.elements.login.inputEmail().type(email);
    this.elements.login.inputPassword().type(password);
    this.elements.login.buttonSubmit().click();

    cy.wait('@POST_Request');

    this.elements.profile.buttonProfile(profile).should('be.visible').and('be.enabled').click();

    cy.wait('@POST_Request');
    cy.url().should('eq', this.BASE_URL);
  }
  /**
   * Create basic profile function
   */
  createBasicProfile(profileName: string){
    this.elements.home.buttonProfile().click();
    this.elements.sideBar.buttonEditProfile().click();
    this.elements.profile.buttonCreateBasicProfile().click();

    this.elements.profile.inputProfileName().type(profileName);
    cy.selectDropdown('Pohlaví','Muž');
    cy.selectDropdown('Rok narození','1999');
    
    this.elements.profile.buttonCreateProfile().click();
    
    this.elements.profile.buttonProfile(profileName).should('be.visible').and('be.enabled').click();
  }
  
  /**
   * Check newly created profile from home page
   */
  checkCreatedProfile(profileName: string){
    this.elements.home.buttonProfile().click();
    this.elements.home.currentProfileName().should('have.text', profileName);
    this.elements.sideBar.buttonClose().click();
  }

  /**
   * Remove newly created profile
   */
  removeCreatedProfile(profileName: string){
    this.elements.home.buttonProfile().click();
    this.elements.sideBar.buttonEditProfile().click();
    this.elements.profile.buttonEditProfiles().click();
    this.elements.profile.buttonProfile(profileName).click();

    this.elements.profile.buttonRemoveProfile().click();
    cy.get('.ui-modal-buttons > .default').should('be.visible').and('be.enabled').click()

    
    this.elements.profile.buttonProfile(profileName).should('not.exist')
  }

}

export default new IprimaPage();