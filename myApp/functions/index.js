import * as functions from 'firebase-functions'
import admin from 'firebase-admin'
import { randomBytes } from 'crypto'
import fs from 'fs'
import dotenv from 'dotenv'
import Stripe from 'stripe'

dotenv.config()
const stripe = new Stripe(process.env.STRIPE_LIVE)

admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(fs.readFileSync("key.json", "utf-8")))
})

export const checkout1 = functions.https.onRequest({cors: true}, async (req, res) => {
    const {amount, user} = req.query
    const now = Date.now()

    const session = await stripe.checkout.sessions.create({
        line_items: [{
            price: "price_1ReIAZBJFXFW6fU32gEMY7BC", 
            quantity: amount
        }], 
        automatic_tax: {enabled: true}, 
        currency: "usd",
        mode: "payment", 
        success_url: "https://addusage-43jzz2k43q-uc.a.run.app?items=" + amount.toString() + "&user=" + user.toString(),
        cancel_url: "https://multidata-9cbd0.web.app"
    })
    res.redirect(301, session.url)
})
export const addusage = functions.https.onRequest({cors: true}, async (req, res) => {
    const {items, user} = req.query;
    const id = (await admin.auth().getUser(user)).toJSON()

    let data = Number.parseFloat((await admin.firestore().doc("usage/" + id["uid"]).get()).get("limit")) + Number.parseFloat(items)

    await admin.firestore().doc("usage/" + id["uid"]).set({limit: data}) 

    res.redirect(301, "https://multidata-9cbd0.web.app")
    return res.end()
})
export const listbases1 = functions.https.onRequest({cors: true}, async (req, res) => {
    const {user} = req.query
    const id = (await admin.auth().getUser(user)).toJSON()
    const names = (await admin.firestore().doc("database/" + id["uid"]).get()).data()
    const access = (await admin.firestore().doc("access/" +  id["uid"]).get()).data()

    const arr1 = names["1"]
    const arr2 = access["1"]

    const target1 = []
    const target2 = []
    for(let i = 0; i != arr1.length; i++){
        target1.push(arr2[i][arr1[i]])
        target2.push(arr1[i])
    }
    res.status(200).json({"names": target2, "access": target1})
    return res.end()
})

export const createdata = functions.https.onRequest({cors: true}, async (req, res) => {
    const {name, text, user} = req.query
    const id = (await admin.auth().getUser(user)).toJSON()
    const key = randomBytes(16).toString("hex")

    const dataname = (await admin.firestore().doc("database/" + id["uid"]).get()).get("1")
    if(dataname != undefined || dataname != null){
        dataname.push(name)

        const obj1 = {}
        obj1["1"] = dataname

        admin.firestore().doc("database/" + id["uid"]).set(obj1)
    }else{
        const obj1 = {}
        obj1["1"] = [name]
        admin.firestore().doc("database/" + id["uid"]).set(obj1)
    }

    const target = (await admin.firestore().doc("access/" + id["uid"]).get()).get("1")
    if(target != null || target != undefined){
        const arr = {}
        arr[name.toString()] = key

        target.push(arr)

        const obj2 = {}
        obj2["1"] = target

        admin.firestore().doc("access/" + id["uid"]).set(obj2)
    }else{
        const arr = {}
        arr[name.toString()] = key

        const obj2 = {}
        obj2["1"] = [arr]
        admin.firestore().doc("access/" + id["uid"]).set(obj2)
    }
    
    const obj3 = {}
    obj3["1"] = [text]
    admin.firestore().doc("" + name + "/" + key).set(obj3)

    const data = await admin.firestore().doc("" + name + "/"+ key)
    res.status(200).send("database created")
    return res.end()
})

export const adddata = functions.https.onRequest({cors: true}, async (req, res) => {
    const {access, name, text, user} = req.query
    const id = (await admin.auth().getUser(user)).toJSON()

    const usage = await (await admin.firestore().doc("usage/" + id["uid"]).get()).get("limit")
    if(Number.parseFloat(usage) <= 0){
        return res.status(400).send(usage + " is 0 or less than 0")
    }
    const data = await (await admin.firestore().doc("database/" + id["uid"]).get()).get("1")
    const items1 = new Promise((resolve) => {
        data.forEach((e) => {
            if(e == name){
                resolve(e)
            }
        })
        resolve(name + ", not found")
    })
    if(name + ", not found" == await items1){
        return res.status(400).send(name + ", not found")
    }
    const tokens = await (await admin.firestore().doc("access/" + id["uid"]).get()).get("1")
    const items2 = new Promise((resolve) => {
        tokens.forEach(async (e) => {
            if(e[name.toString()] == access){
                resolve(e[name.toString()])
            }
        })
        resolve(access + ", not found")
    })
    if(access + ", not found" == await items2){
        return res.status(400).send(access + ", not found")
    }
    const dbref = await (await admin.firestore().doc("" + await items1 + "/" + await items2).get()).get("1")
    dbref.push(text)

    const obj4 = {}
    obj4["1"] = dbref

    await admin.firestore().doc("" + await items1 + "/" + await items2).set(obj4)

    const target = Number.parseFloat(usage-0.02)
    await admin.firestore().doc("usage/" + id["uid"]).set({limit: target})

    res.status(200).json((await admin.firestore().doc("" + await items1 + "/" + await items2).get()).data())
    return res.end()
})

export const readdata = functions.https.onRequest({cors: true}, async (req, res) => {
    const {access, user, name} = req.query;

    const id = (await admin.auth().getUser(user)).toJSON()


    const usage = await (await admin.firestore().doc("usage/" + id["uid"]).get()).get("limit")
    if(Number.parseFloat(usage) <= 0){
        return res.status(400).send(usage + " is 0 or less than 0")
    }

    const dataname = (await admin.firestore().doc("database/" + id["uid"]).get()).get("1")

    const item1 = new Promise((resolve) => {
        dataname.forEach((e) => {
            if(e == name){
                resolve(e)
            }
        })
        resolve(name + ", not found")
    })
    if(await item1 == name + ", not found"){
        return res.status(400).send(name + ", not found")
    }
    const tokens = (await admin.firestore().doc("access/" + id["uid"]).get()).get("1")
    const item2 = new Promise((resolve) => {
        tokens.forEach(async (e) => {
            if(e[name.toString()] == access){
                resolve(e[name.toString()])
            }
        })
        resolve(e[name.toString()] + ", not found")
    })
    if(await item2 == access + ", not found"){
        res.status(400).send(access + ", not found")
        return res.end()
    }

    const target = Number.parseFloat(usage-0.02)
    await admin.firestore().doc("usage/" + id["uid"]).set({limit: target})

    const data = (await admin.firestore().doc("" + name.toString() + "/" + await item2).get()).data()
    res.status(200).send(data)
    return res.end()
})