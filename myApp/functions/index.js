import * as functions from 'firebase-functions'
import admin from 'firebase-admin'
import { randomBytes } from 'crypto'
import fs from 'fs'

admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(fs.readFileSync("key.json", "utf-8")))
})

export const refreshkey = functions.https.onRequest({cors: true}, async (req, res) => {
    const {user} = req.query
    const id = (await admin.auth().getUser(user)).toJSON()

    const key = randomBytes(16).toString("hex")
    admin.firestore().doc("auth/" + id["uid"]).set({key})

    res.status(200).send(key)
    return res.end()
})

export const createdata = functions.https.onRequest({cors: true}, async (req, res) => {
    const {access, user, name, text} = req.query
    const id = (await admin.auth().getUser(user)).toJSON()
    
    const data = admin.firestore().doc("auth/" + user)
    if((await data.get()).get("key") == null && (await data.get()).get("key") == undefined){
        const key = randomBytes(16).toString("hex")
        admin.firestore().doc("auth/" + id["uid"]).set() 
    }

    const getKey = (await admin.firestore().doc("auth/" + id["uid"]).get()).get("key")
    if(access == getKey){
        admin.firestore().doc("" + access.toString() + "/" + name.toString()).set({text: [text]})

        res.status(200).send("database called " + name + " created")
        return res.end()
    }else{

        res.status(200).send(access + ", access token is wrong")
        return res.end()
    }
})

export const adddata = functions.https.onRequest({cors: true}, async (req, res) => {
    const {access, name, text} = req.query
    
    const db = admin.firestore().doc("" + access.toString() + "/" + name.toString())
    
    const targets = (await db.get()).data()
    targets["text"].push(text)

    await db.update({text: targets["text"]})
    res.status(200).send(targets)
    return res.end()
})

export const readdata = functions.https.onRequest({cors: true}, async (req, res) => {
    const {access, name} = req.query;

    const db = await admin.firestore().doc("" + access + "/" + name)
    const target = (await db.get()).data()

    res.status(200).json(target)
    return res.end()
})