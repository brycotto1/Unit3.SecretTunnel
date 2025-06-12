import { createContext, useContext, useState } from "react";

const API = "https://fsa-jwt-practice.herokuapp.com";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState();
  const [location, setLocation] = useState("GATE");

  // TODO: signup
  const signup = async (username) => {   
      try{const response = await fetch(`https://fsa-jwt-practice.herokuapp.com/signup`, 
        {
          method: "POST", 
            headers: { 
              "Content-Type": "application/json" 
            }, 
            body: JSON.stringify({ 
              username: username, 
              password: "through-the-mountain" 
            }) 
        })          
      const tokenMessage = await response.json();      
      setToken(tokenMessage.token);
      setLocation("TABLET");      
    }catch(e){
      console.error(e);     
    }
  }

  // TODO: authenticate
  const authenticate = async () => {
    if(!token) throw Error("No token");      
    
    try{const response = await fetch('https://fsa-jwt-practice.herokuapp.com/authenticate', 
      { 
        method: "GET", 
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        }
      })
      const resultObj = await response.json();
      if(resultObj.success){
        setLocation("TUNNEL");
      }else throw Error("No token");
    }catch(e){
      console.error(e);
    }
  }

  const value = { location, token, signup, authenticate};
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw Error("useAuth must be used within an AuthProvider");
  return context;
}
