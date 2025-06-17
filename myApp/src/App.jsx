import { useState, useEffect, useRef } from 'react'
import './App.css'
import axios from 'axios'
import {motion} from 'framer-motion'

function AddNavbar(){
  return(
    <nav className="fixed w-[15em] h-[100vh] m-auto p-[0] flex flex-col align-middle justify-center text-center ">

    </nav>
  )
}

export default function App(){
  return(
    <div className="relative w-[100%] h-[100vh] m-auto p-[0] flex flex-col align-middle justify-center text-center ">
      <AddNavbar></AddNavbar>
    </div>
  )
}