import React from 'react';
import logo from '../../assets/img/logo.svg';
import Greetings from '../../containers/Greetings/Greetings';
import './Popup.css';
import { initializeApp }from "firebase/app";
import { getAuth, onAuthStateChanged, setPersistence, GoogleAuthProvider, browserLocalPersistence, signInWithCredential } from "firebase/auth";

const config = {
  apiKey: "AIzaSyCtFcUZYlwT_x4jG0dfhsDB0f2q3nD1hcw",
  authDomain: "rabbit-holes-3e150.firebaseapp.com",
  projectId: "rabbit-holes-3e150",
  storageBucket: "rabbit-holes-3e150.appspot.com",
  messagingSenderId: "500945067774",
  appId: "1:500945067774:web:f7788e6068ad01a4434faf",
  measurementId: "G-N7NZLN9HE8"   
}

const app = initializeApp(config);

const auth2 = getAuth(app)

// const Popup = (props) => {

//   const [user, setUser] = React.useState(undefined)
  
//   const signIn = e =>
//   {
//     e.preventDefault()

//     chrome.identity.getAuthToken({ interactive: true }, token =>
//     {
//       if ( chrome.runtime.lastError || ! token ) {
//         alert(`SSO ended with an error: ${JSON.stringify(chrome.runtime.lastError)}`)
//         // return
//       }

//       signInWithCredential(auth2, GoogleAuthProvider.credential(null, token))
//         .then(res =>
//         {
//           console.log('signed in!')
//         })
//         .catch(err =>
//         {
//           alert(`SSO ended with an error: ${err}`)
//         })
//     })
//   }

//   React.useEffect(() =>
//   {
//     auth2.onAuthStateChanged(user =>
//     {
//       setUser(user && user.uid ? user : null)
//     })
//   }, [])

//   if ( undefined === user )
//     return <h1>Loading...</h1>

//   if ( user != null )
//     return (
//       <div>
//         <h1>Signed in as {user.displayName}.</h1>
//         <button onClick={auth2.signOut.bind(auth2)}>Sign Out?</button>
//       </div>
//     )

//   return (
//     <button onClick={signIn}>Sign In with Google</button>
//   )

// };

// export default Popup;

/* ------------------------------------------------------------------------------------------------------------------------------------------------------ */






      // console.log('finished authflow');
  // }




  
const Popup = (props) => {

  const [user, setUser] = React.useState(undefined)
  
  const signIn = e =>
  {
    e.preventDefault()

    launchGoogleAuthFlow(true).then((token)=>{
      if (token) {
        console.log('token:' + token);
        const credential = GoogleAuthProvider.credential(token);
        console.log(credential);
        signInWithCredential(auth2, credential).then((result) => {
          // showMain();
            console.log("Success!!!")
            console.log(result)
        }).catch((error) => {
            // You can handle errors here
            console.log(error)
        });
    } else {
        console.error('The OAuth token was null');
    }
    }); 

  }

  function launchGoogleAuthFlow(interactive) {
    return new Promise((resolve, reject) => {
      console.log('launching webauthflow')
      const manifest = chrome.runtime.getManifest();
      const clientId = encodeURIComponent(manifest.oauth2.client_id);
      const scopes = encodeURIComponent(manifest.oauth2.scopes.join(' '));
  
  let redirectUri = chrome.identity.getRedirectURL("https://pahifaalmjpeiecdmgmonihmdjboooke.chromiumapp.org/provider_cb");
  let nonce = Math.random().toString(36).substring(2, 15)
  
  const authUrl = new URL('https://accounts.google.com/o/oauth2/auth');
  
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('response_type', 'id_token');
    authUrl.searchParams.set('redirect_uri', redirectUri);
    // Add the OpenID scope. Scopes allow you to access the user’s information.
    authUrl.searchParams.set('scope', 'openid profile email');
    authUrl.searchParams.set('nonce', nonce);
    // Show the consent screen after login.
    authUrl.searchParams.set('prompt', 'consent');
  
  
      chrome.identity.launchWebAuthFlow(
        {
          'url': authUrl.href,
          'interactive': interactive
        },
        (redirectedTo) => {
          if (chrome.runtime.lastError) {
            console.log(chrome.runtime.lastError.message);
            resolve(null)
          }
          else {
            let idToken = redirectedTo.substring(redirectedTo.indexOf('id_token=') + 9)
            idToken = idToken.substring(0, idToken.indexOf('&'))
            resolve(idToken)
          }
        }
      )
    })
  }

  React.useEffect(() =>
  {
    auth2.onAuthStateChanged(user =>
    {
      setUser(user && user.uid ? user : null)
    })
  }, [])

  if ( undefined === user )
    return <h1>Loading...</h1>

  if ( user != null )
    return (
      <div>
        <h1>Signed in as {user.displayName}.</h1>
        <button onClick={auth2.signOut.bind(auth2)}>Sign Out?</button>
      </div>
    )

  return (
    <button onClick={signIn}>Sign In with Google</button>
  )

};

export default Popup;