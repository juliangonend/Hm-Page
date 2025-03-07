


import './App.css'
import { Campus } from './Campus'
import { AboutUs } from './Components/AboutUs'
import { CoFunders } from './Components/CoFunders'
import { Contacts } from './Components/Contacts'
import { Footer } from './Components/Footer'

import { Header } from './Components/Header'
import { NavBar } from './Components/NavBar'
import { Team } from './Components/Team'
import { Training } from './Components/Training'

function App() {

  return (
    <>
      <NavBar/>
      <Header/>
      <AboutUs />
      <Campus/>
      <Training/>
      <Team/>
      <CoFunders/> 
      <Contacts/>
      <Footer/>    
    </>
  )
}

export default App
