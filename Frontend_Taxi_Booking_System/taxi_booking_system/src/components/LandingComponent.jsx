
import { useNavigate } from 'react-router-dom'

export default function LandingComponent() {
    const navigate = useNavigate()
    const handleLoginRider = () => {
        navigate('/rider/login')
    }
    const handleLoginDriver = () => {
        navigate('/driver/login')
    }
    const handleRegisterRider = () => {
        navigate('/rider/register')
    }
    const handleRegisterDriver = () => {
        navigate('/driver/register')
    }
  return (
   <div className= 'space-y-4'>
      <button onClick={handleLoginRider} className='w-full bg-gray-200 text-black py-2 rounded-lg text-sm font-extrabold hover:bg-black hover:text-white transition'>Login with Rider</button>
       <button onClick={handleLoginDriver} className='w-full bg-gray-200 text-black py-2 rounded-lg text-sm font-extrabold hover:bg-black hover:text-white transition'>Login with Driver</button>
        <button onClick= {handleRegisterRider} className='w-full bg-gray-200 text-black py-2 rounded-lg text-sm font-extrabold hover:bg-black hover:text-white transition'>Register as Rider</button>
        <button onClick= {handleRegisterDriver} className='w-full bg-gray-200 text-black py-2 rounded-lg text-sm font-extrabold hover:bg-black hover:text-white transition'>Register as Driver</button>
    </div>
  )
}
