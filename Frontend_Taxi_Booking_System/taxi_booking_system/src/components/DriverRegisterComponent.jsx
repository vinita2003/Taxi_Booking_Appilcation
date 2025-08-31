import { useState } from "react"
import { useNavigate } from "react-router-dom";


export default function DriverRegisterComponent() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [gender, setGender] = useState("");
    const[carType, setCarType] = useState("");
    const [carNumber, setCarNumber] = useState("");
    const[ aadharCardNumber, setAadharCardNumber] = useState("");   
    const[ licenseCardNumber, setLicenseCardNumber] = useState("");
    const [errors, setErrors] = useState({});
     const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        try{
           fetch("http://localhost:3000/driver/new", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, phone, password , gender, carType, carNumber, aadharCardNumber, licenseCardNumber })
            }).then(res => res.json()).then(data => {
                 
            console.log("Registration successful", data);
            alert(data.message || "Registration successful");
            if(data.success) {  
               navigate('/driver/dashBoard');
            }
                })
        }catch(err) {
            console.error("Registration failed", err);
            alert("Registration failed. Please try again.");
        console.log("Name: ", name, "Phone: ", phone, "Password: ", password, "Gender :", gender, "Car Type: ", carType, "Car Number: ", carNumber, "Aadhar Number: ", aadharCardNumber, "License Number: ", licenseCardNumber  );
    }
}
  return (
    
     <>
     <h2 className='text-2xl font-bold text-center mb-6'>Register as Driver</h2>
   <form onSubmit = {handleSubmit} className='space-y-4'>
    <input type="text" value={name} onChange= {(e) => {setName(e.target.value)
      const regex= /^[a-zA-Z\s]{3,}$/;
        if(!regex.test(e.target.value)) {
            setErrors((prevErrors) => ({
            ...prevErrors,
            name: "Full name must be at least 3 characters long and contain only letters and spaces"
            }));
        }else{
            setErrors((prevErrors) => ({
                ...prevErrors,
                name: ""
            }));
        }
    }
    } placeholder='Enter full name' className='mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus: ring-black-500 focus:outline-none text-sm'/>
    {errors.name && <p className=' text-xs text-red-500 mt-1'>{errors.name}</p>}
   <input type="tel" value={phone} onChange= {(e) => {setPhone(e.target.value)
    const regex = /^[0-9]{10}$/;
    if(!regex.test(e.target.value)) {
        setErrors((prevErrors) => ({
            ...prevErrors,
            phone: "Phone number must be 10 digits"
        }));
    }else{
        setErrors((prevErrors) => ({
            ...prevErrors,
            phone: ""
        }));
    }
   }} placeholder='Enter phone number' className='mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus: ring-black-500 focus:outline-none text-sm'/>
    {errors.phone && <p className=' text-xs text-red-500 mt-1'>{errors.phone}</p>}
   <input type="password" value={password} onChange={(e) => {setPassword(e.target.value)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if(!passwordRegex.test(e.target.value)) {
        setErrors((prevErrors) => ({
            ...prevErrors,
            password: "Password must be at least 8 characters long, contain at least one letter, one number, and one special character"
        }));
    }else{
        setErrors((prevErrors) => ({
            ...prevErrors,
            password: ""
        }));}
   }} placeholder="Enter password" className='mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus: ring-black-500 focus:outline-none text-sm'/>
    {errors.password && <p className=' text-xs text-red-500 mt-1'>{errors.password}</p>}
   <select name="carType" value={carType} onChange={(e) => {setCarType(e.target.value)
   }} className= 'mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none text-sm '>
             <option value="">Select Car Type</option>
          <option value="SUV">SUV</option>
          <option value="Sedan">Sedan</option>
          <option value="Hatchback">Hatchback</option>
          </select>
          
          <select name="gender" value={gender} onChange={(e) => {setGender(e.target.value)}
          }  className= 'mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none text-sm'>
             <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Others">Others</option>
          </select>
         
   <input type="text" value={carNumber} onChange= {(e) => {
    const regex = /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/;
    setCarNumber(e.target.value)
    if(!regex.test(e.target.value)) {
        setErrors((prevErrors) => ({
            ...prevErrors,
            carNumber: "Invalid car number format"
        }));

    }else{
        setErrors((prevErrors) => ({
            ...prevErrors,
            carNumber: ""
        }));
    }
    }} placeholder="Enter car number" className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black-500 focus:outline-none text-sm" />
   {errors.carNumber && <p className=' text-xs text-red-500 mt-1'>{errors.carNumber}</p>}
   <input type="text" value={aadharCardNumber} onChange={(e) => {
    const regex = /^[0-9]{12}$/;
    setAadharCardNumber(e.target.value)
    if(!regex.test(e.target.value)) {
     setErrors((prevErrors) => ({
        ...prevErrors,
        aadharCardNumber: "Aadhar number must be 12 digits"
     }));
    }else{
        setErrors((prevErrors) => ({
            ...prevErrors,
            aadharCardNumber: ""
        }));}
    }} placeholder="Enter aadhar number" className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black-500 focus:outline-none text-sm"/>
   {errors.aadharCardNumber && <p className=' text-xs text-red-500 mt-1'>{errors.aadharCardNumber}</p>}
   <input type="text" value={licenseCardNumber} onChange={(e) => {setLicenseCardNumber(e.target.value)
    const regex = /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/;
    if(!regex.test(e.target.value)) {
        setErrors((prevErrors) => ({
            ...prevErrors,
            licenseCardNumber: "Invalid license number format"
        }));
    }else{
        setErrors((prevErrors) => ({
            ...prevErrors,
            licenseCardNumber: ""
        }));}
   }} placeholder="Enter driver license number" className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black-500 focus:outline-none text-sm" />
  {errors.licenseCardNumber && <p className=' text-xs text-red-500 mt-1'>{errors.licenseCardNumber}</p>}
  <button
   type="submit" className='w-full bg-black text-white py-2 rounded-lg text-sm font-extrabold'>Register</button>
</form>
      </>
    
  )
}
