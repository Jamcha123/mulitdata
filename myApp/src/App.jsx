import { useState, useEffect, useRef } from 'react'
import './App.css'
import axios from 'axios'
import {motion} from 'framer-motion'
import { onAuthStateChanged, getAuth, GithubAuthProvider, GoogleAuthProvider, linkWithPopup, signOut, unlink } from 'firebase/auth'
import { initializeApp } from 'firebase/app'
import { deleteDoc, doc, getDoc, getFirestore, setDoc } from 'firebase/firestore'
import gitlogo from './assets/github.png'
import googlelogo from './assets/google.png'
import * as cheerio from 'cheerio'
import $ from 'jquery'

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

const auth = getAuth(app)
auth.useDeviceLanguage()

const git = new GithubAuthProvider()
git.addScope("https://github.com/Jamcha123/mulitdata")

const google = new GoogleAuthProvider()

const db = getFirestore(app)


function AddNavbar(){
  const items = ["database", "apis", "keys"]
  const showing = (item, procent) => {
    items.forEach((e) => {
      if(e != item){
        document.getElementById(e).style.transform = "translateY(" + 100 + "%)";
      }
    })
    document.getElementById(item).style.transform = "translateY(" + procent + "%)";
  }
  onAuthStateChanged(auth, (user) => {
    if(user.isAnonymous === false){
      document.getElementById("linking").style.display = "none"
    }else{
      document.getElementById("linking").style.display = "block"
    }
  })
  useEffect(() => {
    document.getElementById("google").addEventListener("click", (e) => {
      e.preventDefault()
      linkWithPopup(auth.currentUser, google).then((value) => {
        window.location.reload()
      })
    })
    document.getElementById("github").addEventListener("click", (e) => {
      e.preventDefault()
      linkWithPopup(auth.currentUser, git).then((value) => {
        window.location.reload()
      })
    })
  })
  return(
    <nav className="relative w-[15em] md:w-[15%] border-r-white border-[3px] h-[100vh] m-auto p-[0] z-[101] flex flex-col align-middle justify-center text-center bg-gray-700 ">
      <ul className="relative w-[100%] h-[80%] m-auto p-[0] flex flex-col align-top justify-center gap-[50px] text-center bg-transparent ">
        <div className="items hidden">
          <div className="relative w-[100%] h-[2em] m-auto p-[0] flex flex-col align-middle justify-center text-center ">
            <motion.li onClick={() => showing("database", "100")} initial={{scale: 1}} whileHover={{scale: 0.9}} whileTap={{scale: 1.1}} transition={{type: "spring", duration: 1}} className="text-2xl underline underline-offset-4 cursor-pointer ">Database App</motion.li>
          </div>
        </div>
        <div className="items hidden">
          <div className="relative w-[100%] h-[2em] m-auto p-[0] flex flex-col align-middle justify-center text-center ">
            <motion.li onClick={() => showing("keys", "0")} initial={{scale: 1}} whileHover={{scale: 0.9}} whileTap={{scale: 1.1}} transition={{type: "spring", duration: 1}} className="text-2xl underline underline-offset-4 cursor-pointer ">Usage</motion.li>
          </div>
        </div>
        <div className="items hidden">
          <div className="relative w-[100%] h-[2em] m-auto p-[0] flex flex-col align-middle justify-center text-center ">
            <motion.li onClick={() => showing("apis", "-100")} initial={{scale: 1}} whileHover={{scale: 0.9}} whileTap={{scale: 1.1}} transition={{type: "spring", duration: 1}} className="text-2xl underline underline-offset-4 cursor-pointer ">API dev</motion.li>
          </div>
        </div>
      </ul>
      <ul className="relative w-[100%] h-[20%] m-auto p-[0] flex flex-col align-middle justify-center text-center ">
        <ul id="linking" className="relative w-[100%] h-[100%] m-auto p-[0] flex flex-col align-middle justify-center text-center bg-transparent ">
          <h1 className="text-2xl text-white">Link accounts</h1>
          <div className="relative w-[100%] h-[4em] m-auto p-[0] flex flex-col align-middle justify-center text-center ">
            <motion.button id="google" initial={{scale: 1}} whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} transition={{type: "spring", duration: 1}} className="relative w-[100%] h-[2em] m-auto p-[0] bg-transparent underline underline-offset-8 text-white text-2xl cursor-pointer ">Link Google</motion.button>
          </div>
          <div className="relative w-[100%] h-[4em] m-auto p-[0] flex flex-col align-middle justify-center text-center ">
            <motion.button id="github" initial={{scale: 1}} whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} transition={{type: "spring", duration: 1}} className="relative w-[100%] h-[2em] m-auto p-[0] bg-transparent underline underline-offset-8 text-white text-2xl cursor-pointer ">Link Github</motion.button>
          </div>
        </ul>
      </ul>
    </nav>
  )
}

function AddDelete(){
  useEffect(() => {
    document.getElementById("yes").addEventListener("click", (e) => {
      e.preventDefault()
    })
    document.getElementById("no").addEventListener("click", (e) => {
      e.preventDefault()
      document.getElementById("delete").style.display = "none"
    })
  })
  return(
    <div id="delete" className="fixed w-[20em] h-[5em] bg-gray-900 rounded-md m-auto z-[300] p-[0] hidden flex-col align-middle justify-center text-center top-[50%] left-[57%] translate-y-[-50%] translate-x-[-50%] ">
      <div className="relative w-[100%] h-[25%] m-auto p-[0] flex-row align-middle justify-center ">
        <h1 className="text-2xl text-white" >Delete Database</h1>
      </div>
      <div className="relative w-[100%] h-[75%] m-auto p-[0] flex-row flex align-middle justify-center text-center ">
        <motion.button id="yes" initial={{scale: 1}} whileTap={{scale: 0.9}} whileHover={{scale: 1.1}} transition={{type: "spring", duration: 1}} className="relative w-[10em] h-[2em] cursor-pointer m-auto p-[0] text-center text-2xl underline underline-offset-2 text-red-500 " >No</motion.button>
        <motion.button id="no" initial={{scale: 1}} whileTap={{scale: 0.9}} whileHover={{scale: 1.1}} transition={{type: "spring", duration: 1}} className="relative w-[10em] h-[2em] cursor-pointer m-auto p-[0] text-center text-2xl underline underline-offset-2 text-green-700 " >Yes</motion.button>
      </div>
    </div>
  )
}

export default function App(){
  const [create, setCreate] = useState(false)
  const creation = async (e) => {
    e.preventDefault()

    const name = document.getElementById("name1")
    const data = document.getElementById("data1")

    const checking = new Promise((resolve) => {
      onAuthStateChanged(auth, async (user) => {
        const check = (await getDoc(doc(db, "database/" + user.uid))).get("1")
        if(check == null || check == undefined){
          resolve("databases")
        }
        check.forEach((e) => {
          if(e == name.value){
            resolve(name.value + " is already a database")
          }
        })
        resolve("done")
      })
    })
    const checkmate = await checking; 
    if(checkmate == name.value + " is already a database"){
      alert(name.value + " is already a database")
      window.location.reload()
    }
    const items = new Promise((resolve) => {
      onAuthStateChanged(auth, (user) => {
        if(user != null){
          const link = "https://createdata-43jzz2k43q-uc.a.run.app?user=" + user.uid + "&text=" + data.value + "&name=" + name.value
          resolve(link)
        }
      })
    })
    const webby = await axios.get(await items)
    alert(webby["data"])

    name.value = ""
    data.value = ""
    setCreate(false)
    $("select").empty()
    window.location.reload()
  }
  const lists = async (user) => {
    $("select").empty()
    const docs = (await getDoc(doc(db, "database/" + user))).get("1")
    const access = (await getDoc(doc(db, "access/" + user))).get("1")

    const select = document.getElementById("tables")
    let x = document.createElement("option")
    x.value = "tables"
    x.innerText = "Chose Your Databases Here"
    select.appendChild(x)
    for(let i = 0; i != docs.length; i++){
      const names = docs[i]
      const keys = access[i][docs[i]]

      let y = document.createElement("option")
      y.value = names
      y.innerText = names
      select.appendChild(y)

      let z = document.createElement("div")
      z.classList.add("databases")
      z.setAttribute("id", names)
      document.getElementById("lists").appendChild(z)
    }
  }
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if(user != null){
        const dbref = await (await getDoc(doc(db, "usage/" + user.uid))).get("limit")
        if(dbref == null || dbref == undefined){
          const obj = {}
          obj["limit"] = 2
          await setDoc(doc(db, "usage/" + user.uid), obj)
        }
        const usage = (await getDoc(doc(db, "usage/" + user.uid))).get("limit")
        document.getElementById("budget").innerText = "$" + Number.parseFloat(usage) + " left"

        document.getElementById("forms").addEventListener("submit", (e) => {
          e.preventDefault()
          const link = "https://checkout1-43jzz2k43q-uc.a.run.app?user=" + user.uid + "&amount=" + document.getElementById("amount").value;
          window.location.href = link
        })
        onAuthStateChanged(auth, async (user) => {
          $("#lists").empty()
          let active = false
          console.log(active)
          if(active === false){
            await lists(user.uid)
            active = true
          }
          console.log(active)
        })
      }
    })
    const tables = document.getElementById("tables")
    tables.addEventListener("change", async (e) => {
      e.preventDefault()
      const arr = (await getDoc(doc(db, "database/" + auth.currentUser.uid))).get("1")
      if(tables.value != "tables"){
        arr.forEach((e) => {
          document.getElementById(e).style.display = "none"
        })
        const accesstoken = (await getDoc(doc(db,"access/" + auth.currentUser.uid))).get("1")
        const items = new Promise((resolve) => {
          let index = 0; 
          arr.forEach((e) => {
            if(e == tables.value){
              resolve(accesstoken[index][e])
            }
            index += 1;
          })
        })
        const element = document.getElementById(tables.value)
        element.style.display = "flex"
        
        const row1 = document.createElement("div")
        row1.classList.add("title")
        const text = document.createElement("h1")
        text.classList.add("name")
        text.innerText = tables.value
        row1.appendChild(text)
        element.appendChild(row1)

        const row2 = document.createElement("div")
        row2.classList.add("content")

        const access = document.createElement("h1")
        access.classList.add("access")
        access.innerText = "Access Token: " + await items
        row2.appendChild(access)

        const uid = document.createElement("h1")
        uid.classList.add("uid")
        uid.innerText = "UID: " + auth.currentUser.uid
        row2.appendChild(uid) 

        const readlink = document.createElement("a")
        readlink.classList.add("reading")
        readlink.href = "https://readdata-43jzz2k43q-uc.a.run.app?user=" + auth.currentUser.uid + "&access=" + await items + "&name=" + tables.value
        readlink.innerText = "read data from " + tables.value + " link"
        row2.appendChild(readlink)

        const addlink = document.createElement("a")
        addlink.classList.add("adding")
        addlink.href = "https://adddata-43jzz2k43q-uc.a.run.app?user=" + auth.currentUser.uid + "&access=" + await items + "&name=" + tables.value + "&text=hello"
        addlink.innerText = "add data to " + tables.value + " link"
        row2.appendChild(addlink)

        element.appendChild(row2)

        const row3 = document.createElement("div")
        row3.classList.add("footer")

        const deletion = document.createElement("button")
        deletion.setAttribute("id", "deletion")
        deletion.innerText = "delete database"
        deletion.onclick = async (e) => {
          e.preventDefault()
          const name = []
          const access = []
          let index = 0;
          arr.forEach((e) => {
            if(e != tables.value){
              name.push(e)
              access.push(accesstoken[index][e])
            }
            index += 1
          })
          await setDoc(doc(db, "database/" + auth.currentUser.uid), {
            1: name
          })
          await setDoc(doc(db, "access/" + auth.currentUser.uid), {
            1: access
          })
          await deleteDoc(doc(db, "" + tables.value + "/" + await items))
          window.location.reload()
        }
        row3.appendChild(deletion)

        element.appendChild(row3)
        
      }
    })
  })
  return(
    <div className="relative w-[100%] h-[100vh] m-auto p-[0] flex flex-row align-middle justify-center text-center bg-gray-300 overflow-hidden ">
      <AddNavbar></AddNavbar>
      <div className="w-[85%] h-[100%] m-auto p-[0] relative flex flex-col align-middle justify-center text-center ">
        <section style={{transform: "translateY(" + 100 + "%)"}} id="database" className="flex overflow-x-hidden flex-col align-middle justify-center text-center min-w-[100%] min-h-[100vh] bg-violet-800  " >
          <div className="relative w-[100%] h-[10vh] bg-violet-950 m-auto p-[0] flex flex-col align-middle justify-center text-center  ">
             <h1 className="text-3xl text-white">Multidata</h1>
          </div>
          <div className="relative w-[100%] overflow-y-hidden overflow-x-hidden lg:overflow-y-hidden min-h-[90vh] m-auto p-[0] flex flex-col align-top gap-[10px] justify-start text-start bg-gray-700  ">
            <div className="relative w-[97%] h-[20vh] lg:h-[20%] m-auto p-[0] bg-transparent flex flex-row align-middle justify-center text-center  ">
              <div className="relative w-[100%] h-[70%] m-auto p-[0] flex flex-col align-middle justify-center text-center bg-gray-800 rounded-md ">
                <h1 className="text-2xl text-white relative w-[100%] lg:w-[fit-content] h-[fit-content] m-0 ml-[5%] p-[0] ">Welcome to my Dashboard</h1>
                <p className="text-xl text-white relative w-[100%] lg:w-[fit-content] h-[fit-content] m-0 ml-[5%] p-[0] ">Multidata is a database app for multiple databases</p>
              </div>
            </div>
            <div className="relative w-[97%] lg:h-[20%] h-[50vh] m-auto p-[0] bg-transparent flex flex-col lg:flex-row align-middle justify-center text-center gap-[10px]  ">
              <div className="relative lg:w-[50%] w-[100%] lg:h-[85%] h-[50%] m-auto p-[0] flex flex-row align-middle justify-center text-center bg-gray-800 rounded-md ">
                <div className="relative w-[100%] h-[100%] m-auto p-[0] flex flex-col align-middle justify-center text-center ">
                  <h1 className="text-2xl text-white mt-[2%]">Budget limit - 0.02 dollars per request</h1>
                  <div className="relative w-[100%] h-[fit-content] m-auto p-[0] flex flex-row align-middle justify-center text-center ">
                    <h1 id="budget" className="text-2xl text-white"></h1>
                  </div>
                  <div className="relative w-[100%] h-[fit-content] m-auto p-[0] flex flex-row align-middle justify-center text-center ">
                    <form id="forms" action="" method="get" className="relative w-[75%] h-[3em] m-auto p-[0] flex flex-row align-middle justify-center text-center ">
                      <input placeholder="Amount to add " min={1} id="amount" required className="relative w-[70%] h-[100%] m-auto p-[0] flex flex-row align-middle justify-center text-center text-2xl text-white " type="number" />
                      <input placeholder="checkout " id="checkout" value="checkout" className="relative w-[30%] h-[100%] m-auto p-[0] flex flex-row align-middle justify-center text-center text-2xl text-white underline underline-offset-4 cursor-pointer " type="submit" />
                    </form>
                  </div>
                </div>
              </div>
              <div className="relative lg:w-[50%] w-[100%] lg:h-[85%] h-[50%] m-auto p-[0] flex flex-col align-middle justify-center text-center bg-gray-800 rounded-md ">
                <h1 className="text-2xl text-white mt-[2%] ">New Databases</h1>
                <motion.button onClick={() => setCreate(true)} id="creation" initial={{scale: 1}} whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} className="relative w-[10em] h-[2em] rounded-md cursor-pointer m-auto p-[0] text-xl text-white bg-gradient-to-tr from-blue-700 via-blue-800 to-blue-900  ">
                  + Create Database
                </motion.button>
              </div>
            </div>
            <div className="relative w-[97%] h-[100vh] lg:h-[60%] m-auto p-[0] bg-transparent flex flex-col lg:flex-row align-middle justify-center text-center gap-[10px]  ">
              <div className="relative w-[100%] lg:w-[100%] h-[90%] lg:h-[90%] m-auto p-[0] flex flex-col align-middle justify-center text-center bg-gray-800 rounded-xl ">
                <div className="relative w-[100%] h-[20%] m-auto p-[0] flex flex-row align-middle justify-center text-center  ">
                  <div className="relative w-[50%] h-[100%] m-auto p-[0] flex flex-col align-middle justify-center text-center ">
                    <h1 className="text-2xl text-white">Your Databases</h1>
                  </div>
                  <div className="relative w-[50%] h-[100%] m-auto p-[0] flex flex-col align-middle justify-center text-center">
                    <select name="tables" id="tables" className="relative cursor-pointer w-[20em] h-[2em] m-auto p-[0] bg-gray-300 flex flex-row align-middle text-center justify-center text-xl text-black rounded-md ">
                      <option value="tables">Chose your Databases Here</option>
                    </select>
                  </div>
                </div>
                <div className="relative w-[100%] h-[80%] m-auto p-[0] flex flex-col align-middle justify-center text-center  ">
                  <div style={{display: create? "none": "flex"}} id="lists" className="relative w-[100%] h-[100%] m-auto p-[0] flex flex-col overflow-hidden align-middle justify-center text-center ">
                    
                  </div>
                  <form style={{display: create? "flex": "none"}} onSubmit={creation}  id="data" className="relative w-[50%] h-[75%] m-auto p-[0] flex flex-col align-middle justify-center text-center ">
                    <input type="text" id="name1" required placeholder="Enter a database name " className="relative w-[100%] h-[2em] m-auto p-[0] bg-gray-300 text-black text-center text-2xl " />
                    <input type="text" id="data1" required placeholder="Enter some Data t.ex hello world " className="relative w-[100%] h-[2em] m-auto p-[0] bg-gray-300 text-black text-center text-2xl " />
                    <motion.input initial={{scale: 1}} whileHover={{scale: 0.9}} whileTap={{scale: 1.1}} transition={{type: "spring", duration: 1}} type="submit" id="submit" className="relative w-[100%] h-[2em] m-auto p-[0] bg-gray-300 text-black cursor-pointer text-center text-2xl " />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section style={{transform: "translateY(" + 100 + "%)"}} id="keys" className="flex flex-col align-middle justify-centere text-center min-w-[100%] min-h-[100vh] bg-gray-700  " ></section>
        <section style={{transform: "translateY(" + 100 + "%)"}} id="apis" className="flex flex-col align-middle justify-centere text-center min-w-[100%] min-h-[100vh] bg-gray-700  " ></section>
      </div>
    </div>
  )
}