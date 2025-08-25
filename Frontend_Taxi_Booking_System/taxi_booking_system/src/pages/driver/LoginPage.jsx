import LoginComponent from "../../components/LoginComponent"
export default function LoginPage({setIsLoggedIn, setRole}) {
  return (
    <div>
      <LoginComponent title="Driver" setIsLoggedIn = {setIsLoggedIn} setRole = {setRole} />
    </div>
  )
}
