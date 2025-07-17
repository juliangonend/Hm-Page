


import { useState } from 'react'
import './App.css'
import { Campus } from './Campus'
import { AboutUs } from './Components/AboutUs'
import { CoFunders } from './Components/CoFunders'
import { Contacts } from './Components/Contacts'
import { Footer } from './Components/Footer'

import { Header } from './Components/Header'
import { NavBar } from './Components/NavBar'
import { Team } from './Components/Team'
import { FormView } from './FormView'

function App() {
  const [showForm, setShowForm] = useState(false);
  const openForm =()=>{
    setShowForm(true);
  }
  const closeForm =()=>{
    setShowForm(false);
  }
  return (
    <>
      { showForm &&  <FormView onClose={closeForm} /> }
      <NavBar/>
      <Header/>
      <AboutUs onOpen={openForm}/>
      <Campus onOpen={openForm}/>
      <Team onOpen={openForm}/>
      <CoFunders/> 
      <Contacts onOpen={openForm}/>
      <Footer/>    
    </>
  )
}

export default App
