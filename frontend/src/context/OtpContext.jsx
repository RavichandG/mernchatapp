import React, { createContext, useState } from 'react'


const OtpContext = createContext();

const OtpContextProvider = ({children}) => {
    const [nameFromUser,  setNameFromUser] = useState("") 
    const [emailFromUser, setEmailFromUser] = useState("")
    const [passwordFromUser, setPasswordFromUser] = useState("")

  return (
    <OtpContext.Provider value={{nameFromUser,  setNameFromUser, emailFromUser, setEmailFromUser, passwordFromUser, setPasswordFromUser}}>
             {children}
    </OtpContext.Provider>
  )
}

export {OtpContext, OtpContextProvider}