# Mattermost Demo Chrome Extension

This project demonstrates how to write a Chrome extension that uses OAuth 2.0 to connect to a Mattermost user's account.

## Prerequisites

* Mattermost 5.2+
* [npm 4.3+](https://www.npmjs.com/)

## Set up and Demo

1. Clone this repository and `cd` into it:
    ```bash
    $ git clone https://github.com/mattermost/mattermost-chrome-extension
    $ cd mattermost-chrome-extension
    ```

2. Create an OAuth 2.0 app on your Mattermost instance [with these instructions](https://docs.mattermost.com/developer/oauth-2-0-applications.html)
    * Make sure to copy the Client ID after the app is created
    * Optionally, you can mark the app as trusted so users do not need to click "Allow" for the app when they log in

3. Configure the extension by modifying the constants in `src/app/views/App.js`:
    * Set `MATTERMOST_URL` to the URL for your Mattermost instance
    * Set `OAUTH_APP_CLIENT_ID` to the Client ID you copied last step
    * Optionally, set `LOGIN_HINT` to `saml` if your Mattermost users login using a SAML IDP. This will skip the Mattermost login page and go directly to the SAML IDP's login

4. Install dependencies and build the extension:
    ```bash
    $ npm install
    $ npm run build
    ```

5. Add the extension to Chrome:
    * Go to `chrome://extensions/` in your Chrome browser
    * Click "Load unpacked" and navigate to and select your `mattermost-chrome-extension` directory

6. Allow cross-origin requests from your Chrome extension to Mattermost:
   * Get the ID of your extension by looking at it's entry on `chrome://extensions/`
    * Set `ServiceSettings.AllowCorsFrom` in your `config.json` to `chrome-extension://<your-extension-id>`, e.g. `chrome-extension://ajfkdfomehaklgdhggbfhhicchlangjp`
    * Restart your Mattermost server

7. Use the extension
    * In the Chrome toolbar a Mattermost logo should have been added, click on it
    * Click the "Click here to connect to Mattermost." button
    * Complete the login process and click "Allow" if prompted
    * Click on the Mattermost logo in the toolbar again, you should now see some of the user's information displayed

## The Code

This extension uses [React](https://reactjs.org/), though it is not requirement for your extension.

The important demo code lives in `src/app/views/App.js`. Read the code and comments in there to get a better understanding of how it works.

Make sure your extension follows the [OAuth 2.0 RFC](https://tools.ietf.org/html/rfc6749) for clients. The implicit grant flow is used.