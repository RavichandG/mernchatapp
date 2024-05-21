import Home from './pages/Home'
import './App.css'
import {Routes, Route} from "react-router-dom"
import ChatPage from './pages/ChatPage'
import OtpPage from './components/authentication/OtpPage'

function App() {

  return (
    <div className='appDiv'>
           <Routes>
           <Route path='/' element={<Home></Home>}></Route>
            <Route path='/chats' element={<ChatPage></ChatPage>}></Route>
            <Route path='/verification' element={<OtpPage></OtpPage>}></Route>
           </Routes>
            
           
    </div>
  )
}

export default App
