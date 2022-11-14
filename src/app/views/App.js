import {Client4} from 'mattermost-redux/client';
import React, {useEffect, useState} from 'react';
import browser from 'webextension-polyfill';

// Set this to your Mattermost SiteURL.
const MATTERMOST_URL = 'http://localhost:8065';

// Set this to the Client ID received after registering an OAuth app with Mattermost.
const OAUTH_APP_CLIENT_ID = 'FILL ME IN';

// Set to blank or "saml". When set to "saml", automatically redirect user to the SAML IDP's login page, skipping the Mattermost login page.
const LOGIN_HINT = '';

// Based on https://stackoverflow.com/a/901144
function getParameterByName(name, url) {
    const regex = new RegExp(
        '[#&?]' + name.replace(/[[]]/g, '\\$&') + '(=([^&#]*)|&|#|$)',
    );
    const results = regex.exec(url || window.location.href);
    if (!results) {
        return null;
    }
    if (!results[2]) {
        return '';
    }
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

const App = () => {
    const [oauthState, setOauthState] = useState('');
    const [user, setUser] = useState(null);

    // Set the Mattermost URL to use for the JS client.
    Client4.setUrl(MATTERMOST_URL);

    useEffect(async () => {
        document.title = browser.runtime.getManifest().name;
        await loadToken();
    }, []);

    // Try to load the access token from storage and fetch the user if we have it.
    const loadToken = async () => {
        const result = await browser.storage.sync.get(['access_token']);
        if (result.access_token) {
            await getUser(result.access_token);
        }
    };

    // Demo use of the access token to get the logged in user.
    const getUser = async (accessToken) => {
        Client4.setToken(accessToken);
        Client4.setIncludeCookies(false);
        try {
            const me = await Client4.getMe();
            setUser(me);
        } catch (error) {
            console.error(error);
            setUser(null);
        }
    };

    // Called when the OAuth flow is complete, parsing the state and access token out of the URL fragment and storing it.
    const completeLogin = (responseUrl) => {
        if (responseUrl === undefined) {
            console.log('empty responseUrl');
            return;
        }
        const errorMsg = getParameterByName('error', responseUrl);
        if (errorMsg !== null) {
            console.log(errorMsg);
            return;
        }
        const state = getParameterByName('state', responseUrl);

        // The OAuth state must match per https://tools.ietf.org/html/rfc6749#section-10.12
        if (state !== oauthState) {
            console.error('invalid state');
            return;
        }

        const accessToken = getParameterByName('access_token', responseUrl);
        browser.storage.sync.set({access_token: accessToken});
    };

    // Begins the OAuth flow.
    const handleLogin = async () => {
        const redirectUrl = encodeURIComponent(
            browser.identity.getRedirectURL(),
        );
        const clientId = encodeURIComponent(OAUTH_APP_CLIENT_ID);

        // Use a randomly generated string for the OAuth state
        setOauthState(Math.random().toString(36));
        const state = encodeURIComponent(oauthState);

        const responseUrl = await browser.identity.launchWebAuthFlow({
            url:
                MATTERMOST_URL +
                '/oauth/authorize?response_type=token&client_id=' +
                clientId +
                '&redirect_uri=' +
                redirectUrl +
                '&state=' +
                state +
                '&login_hint=' +
                LOGIN_HINT,
            interactive: true,
        });

        completeLogin(responseUrl);
    };

    let content;
    if (user) {
        content = (
            <div>
                <p>
                    {'Username: '}
                    {user.username}
                </p>
                <p>
                    {'Email: '}
                    {user.email}
                </p>
            </div>
        );
    } else {
        content = (
            <>
                <button onClick={handleLogin}>
                    {'Click here to connect to Mattermost.'}
                </button>
            </>
        );
    }

    return (
        <div>
            <img
                src='/public/img/icon.png'
                style={{width: '100px', height: '100px'}}
            />
            <h3>{browser.runtime.getManifest().name}</h3>
            {content}
        </div>
    );
};

export default App;
