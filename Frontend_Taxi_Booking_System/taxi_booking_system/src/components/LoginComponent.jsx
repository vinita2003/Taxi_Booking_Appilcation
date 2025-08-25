import { useState } from 'react'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Assuming you have an API function to handle login

export default function LoginComponent({title}) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    const phoneRegex = /^[0-9]{10}$/;
    if(!phone) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if(!password) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(password)) {
      newErrors.password = "Password must be at least 8 characters long, contain at least one letter, one number, and one special character";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }
  const handleFocus = (field) => {
  
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: ""
    }));
  }
  const handleSubmit =  async (e) => {
    e.preventDefault();
    if(!validate()) {
      return;
    }
    console.log("Phone: ",phone, "Password", password);
    try{
       const response = await login(phone, password, title);
     
      if(response.success) {
       if(title === "Rider") {
       navigate('/rider/pickupAndDropLocation')
      }else{
        navigate('/driver/dashboard')
      }
    }
    }catch(err){
      console.error("Login failed", err);
      alert("Login failed. Please try again.");
    }
  }
  return (
   <>
    <h2 className='text-2xl font-bold text-center mb-6'>Login as {title}</h2>
   <form onSubmit = {handleSubmit} className='space-y-4'>
   <input type="tel" name = "phone" value={phone} onChange= {(e) => setPhone(e.target.value)} onFocus= {(e) => handleFocus("phone")} placeholder='Enter phone number' className= {`mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black-500 focus:outline-none text-sm ${errors.phone ? "border-red-500" : "border-gray-300"}`} />
   {errors.phone && <p className=' text-xs text-red-500 mt-1'>{errors.phone}</p>}
   <input type="password" value={password} name = "password" onChange={(e) => setPassword(e.target.value)} onFocus= {(e) => handleFocus("password")} placeholder=" Enter password" className={`mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black-500 focus:outline-none text-sm ${errors.password ? "border-red-500" : "border-gray-300"}`}/>
   {errors.password && <p className=' text-xs text-red-500 mt-1'>{errors.password}</p>}
   <p className='text-s text-gray-500 text-center'>Dont't have an account ?&nbsp;
    {title === "Rider" ? (
      <Link to="/rider/register" className= "font-bold">Sign up</Link>
    ) : (
      <Link to="/driver/register" className= "font-bold">Sign up</Link>
    )}
    
   </p>
  <button
   type="submit" className='w-full bg-black text-white py-2 rounded-lg text-sm font-extrabold'>Login</button>
</form>
    </>
  
  )
}

