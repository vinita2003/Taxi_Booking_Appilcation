import LoginComponent from "../../components/LoginComponent.jsx"
export default function LoginPage({setIsLoggedIn, setRole}) {
  return (
    <div>
        <LoginComponent title= "Rider" setIsLoggedIn = {setIsLoggedIn} setRole = {setRole}/>
    </div>
  )
}
