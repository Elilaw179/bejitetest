// import { Eye, EyeOff } from 'lucide-react';
// import React, { useState } from 'react'
// import { FaGoogle, FaLinkedin } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';

// function SignUp() {

//   const [email, setEmail] = useState("");
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   const isDisabled = !email || !firstName || !lastName;

//   const navigate = useNavigate();

//   return (
//     <div className="bg-white min-h-screen flex flex-col">
//       <div className="w-full lg:w-[70%] px-4 py-6 flex justify-between items-center mx-auto lg:absolute lg:right-4 lg:left-4 lg:top-1/12 lg:transform lg:-translate-y-1/2 lg:z-10 ">
//         <img src="/assets/images/logo.png" alt="Logo" className="h-10" />
//         <div className="flex items-center gap-3">
//           <h1 className="text-[#828282] text-base sm:text-xl font-medium">
//             Already have an account?
//           </h1>
//           <button
//             className="bg-[#16730F] py-2 px-5 sm:py-3 sm:px-7 rounded-2xl shadow text-white"
//             onClick={() => navigate("/")}
//           >
//             Sign in
//           </button>
//         </div>
//       </div>

//       <div className="flex flex-col lg:flex-row flex-1 justify-between relative ">
//         <div className="w-full lg:w-[60%] relative hidden lg:block ">
//           <img
//             src="/assets/images/Illustra.svg"
//             alt="Auth"
//             className="w-full h-screen "
//           />
//           <img
//             src="/assets/images/asubtext.svg"
//             alt="Auth Text"
//             className="absolute top-3/7 left-[46%] transform -translate-x-1/2 -translate-y-1/2"
//           />
//         </div>

//         <div className="w-full lg:w-[40%] flex items-center justify-center lg:justify-start px-6 py-10">
//           <div className="w-full max-w-md space-y-2">
//             <h2 className="text-3xl font-norican font-semibold text-[#16730F] text-center">
//               Sign Up
//             </h2>
//             <p className="text-center text-[#1A3E32] text-md">
//               Create your account in a few steps
//             </p>

//             <div className="space-y-4">
//               <input
//                 type="text"
//                 placeholder="First name"
//                 value={firstName}
//                 onChange={(e) => setFirstName(e.target.value)}
//                 className="w-full px-4 py-3 border border-[#1A3E32] rounded-xl outline-none"
//               />
//               <input
//                 type="text"
//                 placeholder="Last Name"
//                 value={lastName}
//                 onChange={(e) => setLastName(e.target.value)}
//                 className="w-full px-4 py-3 border border-[#1A3E32] rounded-xl outline-none "
//               />
//               <input
//                 type="email"
//                 placeholder="Email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full px-4 py-3 border border-[#1A3E32] rounded-xl outline-none"
//               />
//             </div>

//             <button
//               disabled={isDisabled}
//               className={`w-full py-4 rounded-full text-white font-semibold shadow-md transition mb-10 ${
//                 isDisabled
//                   ? "bg-[#16730F40] cursor-not-allowed"
//                   : "bg-[#16730F]"
//               }`}
//               onClick={() => navigate("/signup-role")}
//             >
//               Continue
//             </button>

//             <p className="text-[#1A3E32] text-center text-xl">or signup with</p>
//             <div className="flex justify-center gap-6 mt-4">
//               <FaLinkedin className="text-blue-600 text-3xl cursor-pointer" />
//               <img
//                 src="/assets/images/google.png"
//                 alt="google logo"
//                 className="w-8 h-8 cursor-pointer"
//               />
//               <img
//                 src="/assets/images/x.svg"
//                 alt="Twitter"
//                 className="w-8 h-8 cursor-pointer"
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SignUp;




// import React, { useState } from "react";
// import { Eye, EyeOff } from "lucide-react";
// import { FaGoogle, FaLinkedin } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import Input from "../components/ui/Input";


// function SignUp() {
//     const [email, setEmail] = useState('');
//     const [firstName, setFirstName] = useState('');
//     const [lastName, setLastName] = useState('');
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');

//     const isDisabled =
//         !email || !firstName || !lastName || !password || !confirmPassword;

//     const [errors, setErrors] = useState({});
//     const navigate = useNavigate();

//     const validateForm = () => {
//         const newErrors = {};

//         if (!firstName.trim()) newErrors.firstName = 'First name is required';
//         if (!lastName.trim()) newErrors.lastName = 'Last name is required';
//         if (!email.trim()) {
//             newErrors.email = 'Email is required';
//         } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i.test(email)) {
//             newErrors.email = 'Email is invalid';
//         }
//         if (!password) newErrors.password = 'Password is required';
//         if (!confirmPassword || confirmPassword !== password)
//             newErrors.confirmPassword = 'Passwords do not match';

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleContinue = () => {
//         if (validateForm()) {
//             navigate('/signup-role', {
//                 state: {
//                     email,
//                     firstName,
//                     lastName,
//                     password,
//                 },
//             });
//         }
//     };

//   return (
//     <div className="bg-white min-h-screen flex flex-col">

//       <div className="w-full lg:w-[70%] px-4 py-6 mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 lg:absolute lg:right-4 lg:left-4 lg:top-1/12 lg:transform lg:-translate-y-1/2 lg:z-10">
//   <img src="/assets/images/logo.png" alt="Logo" className="h-10" />

//   <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
//     <h1 className="text-[#828282] text-base sm:text-xl font-medium text-center sm:text-left">
//       Already have an account?
//     </h1>
//     <button
//       className="bg-[#16730F] py-2 px-5 sm:py-3 sm:px-7 rounded-2xl shadow text-white"
//       onClick={() => navigate("/")}
//     >
//       Sign in
//     </button>
//   </div>
// </div>


//             <div className="flex flex-col lg:flex-row flex-1 justify-between relative ">
//                 <div className="w-full lg:w-[60%] relative hidden lg:block">
//                     <img
//                         src="/assets/images/Illustra.svg"
//                         alt="Auth"
//                         className="w-full h-screen"
//                     />
//                     <img
//                         src="/assets/images/asubtext.svg"
//                         alt="Auth Text"
//                         className="absolute top-3/7 left-[46%] transform -translate-x-1/2 -translate-y-1/2"
//                     />
//                 </div>

//                 <div className="w-full lg:w-[40%] flex items-center justify-center lg:justify-start px-6 py-10">
//                     <div className="w-full max-w-md space-y-2">
//                         <h2 className="text-3xl font-norican font-semibold text-[#16730F] text-center">
//                             Sign Up
//                         </h2>
//                         <p className="text-center text-[#1A3E32] text-md">
//                             Create your account in a few steps
//                         </p>

//                         <div className="space-y-4">
//                             <div>
//                                 <input
//                                     type="text"
//                                     placeholder="First name"
//                                     value={firstName}
//                                     onChange={(e) =>
//                                         setFirstName(e.target.value)
//                                     }
//                                     className="w-full px-4 py-3 border border-[#1A3E32] rounded-xl outline-none"
//                                 />
//                                 {errors.firstName && (
//                                     <p className="text-red-500 text-sm mt-1">
//                                         {errors.firstName}
//                                     </p>
//                                 )}
//                             </div>

//                             <div>
//                                 <input
//                                     type="text"
//                                     placeholder="Last Name"
//                                     value={lastName}
//                                     onChange={(e) =>
//                                         setLastName(e.target.value)
//                                     }
//                                     className="w-full px-4 py-3 border border-[#1A3E32] rounded-xl outline-none"
//                                 />
//                                 {errors.lastName && (
//                                     <p className="text-red-500 text-sm mt-1">
//                                         {errors.lastName}
//                                     </p>
//                                 )}
//                             </div>

//               <div>
//                 <input
//                   type="email"
//                   placeholder="Email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="w-full px-4 py-3 border border-[#1A3E32] rounded-xl outline-none"
//                 />
//                 {errors.email && (
//                   <p className="text-red-500 text-sm mt-1">{errors.email}</p>
//                 )}
//               </div>


//             </div>

//                         <button
//                             className={`w-full py-4 rounded-full text-white font-semibold shadow-md transition mb-10 ${
//                                 isDisabled
//                                     ? 'bg-[#16730F40] cursor-not-allowed'
//                                     : 'bg-[#16730F]'
//                             }`}
//                             onClick={handleContinue}
//                         >
//                             Continue
//                         </button>

//             <p className="text-[#1A3E32] text-center text-xl">...or signup with</p>
//             <div className="flex justify-center gap-6 mt-4">
//               <FaLinkedin className="text-blue-600 text-3xl cursor-pointer" />
//               <img
//                 src="/assets/images/google.png"
//                 alt="google logo"
//                 className="w-8 h-8 cursor-pointer"
//               />
//               <img
//                 src="/assets/images/x.svg"
//                 alt="Twitter"
//                 className="w-8 h-8 cursor-pointer"
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SignUp;













































// import React, { useState } from 'react';
// import { FaGoogle, FaLinkedin } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
// import Input from '../components/ui/Input';

// function SignUp() {
//     const [email, setEmail] = useState('');
//     const [firstName, setFirstName] = useState('');
//     const [lastName, setLastName] = useState('');
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');

//     const isDisabled =
//         !email || !firstName || !lastName || !password || !confirmPassword;

//     const [errors, setErrors] = useState({});
//     const navigate = useNavigate();

//     const validateForm = () => {
//         const newErrors = {};

//         if (!firstName.trim()) newErrors.firstName = 'First name is required';
//         if (!lastName.trim()) newErrors.lastName = 'Last name is required';
//         if (!email.trim()) {
//             newErrors.email = 'Email is required';
//         } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i.test(email)) {
//             newErrors.email = 'Email is invalid';
//         }
//         if (!password) newErrors.password = 'Password is required';
//         if (!confirmPassword || confirmPassword !== password)
//             newErrors.confirmPassword = 'Passwords do not match';

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleContinue = () => {
//         if (validateForm()) {
//             navigate('/signup-role', {
//                 state: {
//                     email,
//                     firstName,
//                     lastName,
//                     password,
//                 },
//             });
//         }
//     };

//     return (
//         <div className="bg-white min-h-screen flex flex-col">
//             <div className="w-full lg:w-[70%] px-4 py-6 mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 lg:absolute lg:right-4 lg:left-4 lg:top-1/12 lg:transform lg:-translate-y-1/2 lg:z-10">
//                 <img
//                     src="/assets/images/logo.png"
//                     alt="Logo"
//                     className="h-10"
//                 />

//                 <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
//                     <h1 className="text-[#828282] text-base sm:text-xl font-medium text-center sm:text-left">
//                         Already have an account?
//                     </h1>
//                     <button
//                         className="bg-[#16730F] py-2 px-5 sm:py-3 sm:px-7 rounded-2xl shadow text-white"
//                         onClick={() => navigate('/')}
//                     >
//                         Sign in
//                     </button>
//                 </div>
//             </div>

//             <div className="flex flex-col lg:flex-row flex-1 justify-between relative ">
//                 <div className="w-full lg:w-[60%] relative hidden lg:block">
//                     <img
//                         src="/assets/images/Illustra.svg"
//                         alt="Auth"
//                         className="w-full h-screen"
//                     />
//                     <img
//                         src="/assets/images/asubtext.svg"
//                         alt="Auth Text"
//                         className="absolute top-3/7 left-[46%] transform -translate-x-1/2 -translate-y-1/2"
//                     />
//                 </div>

//                 <div className="w-full lg:w-[40%] flex items-center justify-center lg:justify-start px-6 py-10">
//                     <div className="w-full max-w-md space-y-2">
//                         <h2 className="text-3xl font-norican font-semibold text-[#16730F] text-center">
//                             Sign Up
//                         </h2>
//                         <p className="text-center text-[#1A3E32] text-md">
//                             Create your account in a few steps
//                         </p>

//                         <div className="space-y-4">
//                             <div>
//                                 <input
//                                     type="text"
//                                     placeholder="First name"
//                                     value={firstName}
//                                     onChange={(e) =>
//                                         setFirstName(e.target.value)
//                                     }
//                                     className="w-full px-4 py-3 border border-[#1A3E32] rounded-xl outline-none"
//                                 />
//                                 {errors.firstName && (
//                                     <p className="text-red-500 text-sm mt-1">
//                                         {errors.firstName}
//                                     </p>
//                                 )}
//                             </div>

//                             <div>
//                                 <input
//                                     type="text"
//                                     placeholder="Last Name"
//                                     value={lastName}
//                                     onChange={(e) =>
//                                         setLastName(e.target.value)
//                                     }
//                                     className="w-full px-4 py-3 border border-[#1A3E32] rounded-xl outline-none"
//                                 />
//                                 {errors.lastName && (
//                                     <p className="text-red-500 text-sm mt-1">
//                                         {errors.lastName}
//                                     </p>
//                                 )}
//                             </div>

//                             <div>
//                                 <input
//                                     type="email"
//                                     placeholder="Email"
//                                     value={email}
//                                     onChange={(e) => setEmail(e.target.value)}
//                                     className="w-full px-4 py-3 border border-[#1A3E32] rounded-xl outline-none"
//                                 />
//                                 {errors.email && (
//                                     <p className="text-red-500 text-sm mt-1">
//                                         {errors.email}
//                                     </p>
//                                 )}
//                             </div>

//                             <Input
//                                 type="password"
//                                 placeholder="Password"
//                                 value={password}
//                                 setValue={setPassword}
//                                 error={errors.password}
//                             />
//                             <Input
//                                 type="password"
//                                 placeholder="Confirm Password"
//                                 value={confirmPassword}
//                                 setValue={setConfirmPassword}
//                                 error={errors.confirmPassword}
//                             />
//                         </div>

//                         <button
//                             className={`w-full py-4 rounded-full text-white font-semibold shadow-md transition mb-10 ${
//                                 isDisabled
//                                     ? 'bg-[#16730F40] cursor-not-allowed'
//                                     : 'bg-[#16730F]'
//                             }`}
//                             onClick={handleContinue}
//                         >
//                             Continue
//                         </button>

//                         <p className="text-[#1A3E32] text-center text-xl">
//                             ...or signup with
//                         </p>
//                         <div className="flex justify-center gap-6 mt-4">
//                             <FaLinkedin className="text-blue-600 text-3xl cursor-pointer" />
//                             <img
//                                 src="/assets/images/google.png"
//                                 alt="google logo"
//                                 className="w-8 h-8 cursor-pointer"
//                             />
//                             <img
//                                 src="/assets/images/x.svg"
//                                 alt="Twitter"
//                                 className="w-8 h-8 cursor-pointer"
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default SignUp;













import React, { useState } from 'react';
import { FaGoogle, FaLinkedin } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Input from '../components/ui/Input';
import axios from 'axios';

function SignUp() {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');

    const isDisabled =
        !email || !firstName || !lastName || !password || !confirmPassword;

    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};
        if (!firstName.trim()) newErrors.firstName = 'First name is required';
        if (!lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i.test(email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!password) newErrors.password = 'Password is required';
        if (!confirmPassword || confirmPassword !== password)
            newErrors.confirmPassword = 'Passwords do not match';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

  const handleContinue = async () => {
    if (!validateForm()) return;

    try {
        const res = await axios.post(
            'https://bejite-backend.onrender.com/auth/signup',
            {
                firstName,   // ✅ camelCase keys
                lastName,
                email,
                password,
                confirmPassword
            }
        );

        setMessage('✅ Signup successful!');
          alert('✅ Signup successful! Please check your email for verification.'); // 👈 alert

        console.log('Response:', res.data);

        navigate('/signup-role', {
            state: { email, firstName, lastName }
        });

    } catch (err) {
        if (err.response) {
            console.error('Backend error:', err.response.data);
            setMessage(err.response.data.error || 'Signup failed ❌');
        } else {
            console.error('Error:', err.message);
            setMessage('Network error ❌');
        }
    }
};


    return (
        <div className="bg-white min-h-screen flex flex-col">
            <div className="w-full lg:w-[70%] px-4 py-6 mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 lg:absolute lg:right-4 lg:left-4 lg:top-1/12 lg:transform lg:-translate-y-1/2 lg:z-10">
                <img src="/assets/images/logo.png" alt="Logo" className="h-10" />
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                    <h1 className="text-[#828282] text-base sm:text-xl font-medium text-center sm:text-left">
                        Already have an account?
                    </h1>
                    <button
                        className="bg-[#16730F] py-2 px-5 sm:py-3 sm:px-7 rounded-2xl shadow text-white"
                        onClick={() => navigate('/')}
                    >
                        Sign in
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row flex-1 justify-between relative ">
                <div className="w-full lg:w-[60%] relative hidden lg:block">
                    <img src="/assets/images/Illustra.svg" alt="Auth" className="w-full h-screen" />
                    <img src="/assets/images/asubtext.svg" alt="Auth Text"
                         className="absolute top-3/7 left-[46%] transform -translate-x-1/2 -translate-y-1/2" />
                </div>

                <div className="w-full lg:w-[40%] flex items-center justify-center lg:justify-start px-6 py-10">
                    <div className="w-full max-w-md space-y-2">
                        <h2 className="text-3xl font-norican font-semibold text-[#16730F] text-center">
                            Sign Up
                        </h2>
                        <p className="text-center text-[#1A3E32] text-md">Create your account in a few steps</p>

                        {message && (
                            <p className="text-center text-red-500 font-semibold">{message}</p>
                        )}

                        <div className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    placeholder="First name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full px-4 py-3 border border-[#1A3E32] rounded-xl outline-none"
                                />
                                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                            </div>

                            <div>
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full px-4 py-3 border border-[#1A3E32] rounded-xl outline-none"
                                />
                                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                            </div>

                            <div>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 border border-[#1A3E32] rounded-xl outline-none"
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                            </div>

                            <Input type="password" placeholder="Password" value={password} setValue={setPassword} error={errors.password} />
                            <Input type="password" placeholder="Confirm Password" value={confirmPassword} setValue={setConfirmPassword} error={errors.confirmPassword} />
                        </div>

                        <button
                            className={`w-full py-4 rounded-full text-white font-semibold shadow-md transition mb-10 ${
                                isDisabled ? 'bg-[#16730F40] cursor-not-allowed' : 'bg-[#16730F]'
                            }`}
                            onClick={handleContinue}
                        >
                            Continue
                        </button>

                        <p className="text-[#1A3E32] text-center text-xl">...or signup with</p>
                        <div className="flex justify-center gap-6 mt-4">
                            <FaLinkedin className="text-blue-600 text-3xl cursor-pointer" />
                            <img src="/assets/images/google.png" alt="google logo" className="w-8 h-8 cursor-pointer" />
                            <img src="/assets/images/x.svg" alt="Twitter" className="w-8 h-8 cursor-pointer" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUp;










