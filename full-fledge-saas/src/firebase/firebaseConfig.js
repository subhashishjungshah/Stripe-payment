import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/database'

const firebaseConfig = {
  apiKey: 'AIzaSyDnowfulJzfBXz9uQwA91VkeE_VHl82vZM',
  authDomain: 'stripe-subscription-9b47b.firebaseapp.com',
  projectId: 'stripe-subscription-9b47b',
  storageBucket: 'stripe-subscription-9b47b.appspot.com',
  messagingSenderId: '929549205257',
  appId: '1:929549205257:web:4acad3365c84ec4625ddd8',
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

export default firebase
