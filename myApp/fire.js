import { initializeApp } from 'firebase/app'
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check'
import { getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const config =  {
    apiKey: "",
    authDomain: "multidata-9cbd0.firebaseapp.com",
    projectId: "multidata-9cbd0",
    storageBucket: "multidata-9cbd0.firebasestorage.app",
    messagingSenderId: "1090623796015",
    appId: "1:1090623796015:web:d96e3d637cc075f64127da",
    measurementId: "G-C0P9H3Q9HN"
}

const app = initializeApp(config)

const appcheck = initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider("6LeSs2IrAAAAAHfvoefVOgQfNhQmGPcS7RBrU3wQ"), 
    isTokenAutoRefreshEnabled: true
})

const auth = getAuth(app)
auth.useDeviceLanguage()

const db = getFirestore(app)

signInAnonymously(auth)
onAuthStateChanged(auth, (user) => {
    if(user == null){
        console.log("user, not found")
    }else{
        console.log("user, logged in")
    }
})