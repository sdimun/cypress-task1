import IprimaPage from "../page/IprimaPage";


describe('Simple E2E test', () => {
  const profileName = 'Igor';
  
  before(()=>{
    cy.fixture('credentials.json').then((creds) => {
       IprimaPage.login(creds.user.username, creds.user.password);
    }); 
  })

  it('Create new profile, verify it and remove that profile - E2E test', () => {
    
    // create basic profile
    IprimaPage.createBasicProfile(profileName);

    // check new created profile from home page
    IprimaPage.checkCreatedProfile(profileName);

    // remove new created profile
    IprimaPage.removeCreatedProfile(profileName);
  });

});