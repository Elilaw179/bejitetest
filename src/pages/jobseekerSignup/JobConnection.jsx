// import React, { useState } from "react";
// import usersData from "../../data/usersData";
// import UserList from "../../components/UserList";
// import ContinueButton from "../../components/ContinueButton";
// import { useLocation, useNavigate } from "react-router-dom";

// const JobConnection = () => {
//   const [addedUsers, setAddedUsers] = useState([]);
//     const location = useLocation();
//     const { email, firstName, lastName, role, mode } = location.state || {};
//     console.log("Mode:", mode);

//   const handleAdd = (id) => {
//     if (!addedUsers.includes(id) ) {
//       setAddedUsers([...addedUsers, id]);
//     }
//   };

//     const navigate = useNavigate();

//     const handleClick = () => {
//       if (isEnabled) {
//         navigate("/resume");
//       }
//     };

//   return (
//     <div className="bg-white min-h-screen relative">
//       <div className="w-full px-4 py-6 flex justify-start items-center max-w-screen-xl mx-auto">
//         <img
//           src="/assets/images/logo.png"
//           alt="logo"
//           className="h-12 sm:h-16"
//         />
//       </div>

//       <div className="flex flex-col items-center justify-start px-4 mx-auto w-full max-w-4xl pb-12">
//         <div className="w-full max-w-3xl text-center mb-10 mt-12">
//           <p className="text-3xl sm:text-4xl md:text-5xl font-norican font-semibold text-[#16730F]">
//             Connect With Users
//           </p>
//           <p className="text-[#333] font-normal text-sm sm:text-base md:text-lg mt-2">
//             Connect with at least 10 users to continue the signup process
//           </p>
//         </div>

//         <UserList users={usersData} addedUsers={addedUsers} onAdd={handleAdd} />

//         <div className="w-full flex justify-center sm:justify-end mt-10 px-4">
//           <button
//             className={`w-52 h-12 rounded-2xl font-bold text-white transition-all duration-300 ${
//               isEnabled
//                 ? "bg-[#16730F]"
//                 : "bg-[#1A3E32] opacity-25 cursor-not-allowed"
//             }`}
//             disabled={addedUsers.length >= 10}
//             onClick={handleClick}
//           >
//             Continue
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default JobConnection;








// import React, { useState } from "react";
// import usersData from "../../data/usersData";
// import UserList from "../../components/UserList";
// import { useLocation, useNavigate } from "react-router-dom";
// import Loader from "../../components/ui/Loader";
// import fakePdfFile from "../../utils/fake-pdf";



// const JobConnection = () => {
//     const [addedUsers, setAddedUsers] = useState([]);
//     const location = useLocation();
//     const navigate = useNavigate();
//     const [show, setShow] = useState(false);

//     const { email, firstName, lastName, password, role, mode } =
//         location.state || {};

//     const isEnabled = addedUsers.length >= 10;

//     const handleAdd = (id) => {
//         if (!addedUsers.includes(id)) {
//             setAddedUsers([...addedUsers, id]);
//         }
//     };

//     const handleClick = async () => {
//         if (isEnabled) {
//             const payload = {
//                 email,
//                 firstName,
//                 lastName,
//                 password,
//                 role,
//                 mode,
//                 followings: JSON.stringify([]),
//             };
//             const formData = new FormData();

//             Object.entries(payload).forEach(([key, value]) =>
//                 formData.append(key, value)
//             );
//             formData.append('cv', fakePdfFile);

//             try {
//                 setShow(true);
//                 await axiosInstance.post('/auth/signup', formData, {
//                     headers: { 'Content-Type': 'multipart/form-data' },
//                 });

//                 toast.success('Registration successful');
//             } catch (error) {
//                 const { error: errorText } = error.response.data;
//                 toast.error(errorText);
//                 return;
//             } finally {
//                 setShow(false);
//             }

//             navigate('/resume', {
//                 state: {
//                     email,
//                     firstName,
//                     lastName,
//                     password,
//                     role,
//                     mode,
//                     followings: addedUsers,
//                 },
//             });
//         }
//     };

//     return (
//         <div className="bg-white min-h-screen relative">
//             <div className="w-full px-4 py-6 flex justify-start items-center max-w-screen-xl mx-auto">
//                 <img
//                     src="/assets/images/logo.png"
//                     alt="logo"
//                     className="h-12 sm:h-16"
//                 />
//             </div>

//             <div className="flex flex-col items-center justify-start px-4 mx-auto w-full max-w-4xl pb-12">
//                 <div className="w-full max-w-3xl text-center mb-10 mt-12">
//                     <p className="text-3xl sm:text-4xl md:text-5xl font-sarina font-semibold text-[#16730F]">
//                         Connect With Users
//                     </p>
//                     <p className="text-[#333] font-normal text-sm sm:text-base md:text-lg mt-2">
//                         Connect with at least 10 users to continue the signup
//                         process
//                     </p>
//                 </div>

//                 <UserList
//                     users={usersData}
//                     addedUsers={addedUsers}
//                     onAdd={handleAdd}
//                 />

//                 <div className="w-full flex justify-center sm:justify-end mt-10 px-4">
//                     <button
//                         className={`w-52 h-12 rounded-2xl font-bold text-white transition-all duration-300 ${
//                             isEnabled
//                                 ? 'bg-[#16730F]'
//                                 : 'bg-[#1A3E32] opacity-25 cursor-not-allowed'
//                         }`}
//                         disabled={!isEnabled}
//                         onClick={handleClick}
//                     >
//                         Continue
//                     </button>
//                 </div>
//             </div>

//             <Loader show={show} />
//         </div>
//     );
// };

// export default JobConnection;











// I tried to test by updating the code below, but you can still 
// uncomment your original code above if  you want to use it



import React, { useState } from "react";
import usersData from "../../data/usersData";
import UserList from "../../components/UserList";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../../components/ui/Loader";
import fakePdfFile from "../../utils/fake-pdf";
import axiosInstance from "../../utils/axiosInstance"; 
import { toast } from "react-toastify";

const JobConnection = () => {
    const [addedUsers, setAddedUsers] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const [show, setShow] = useState(false);

    const { email, firstName, lastName, password, role, mode } =
        location.state || {};

    const isEnabled = addedUsers.length >= 10;

    const handleAdd = (id) => {
        if (!addedUsers.includes(id)) {
            setAddedUsers([...addedUsers, id]);
        }
    };

    const handleClick = async () => {
        if (isEnabled) {
            const payload = {
                email,
                firstName,
                lastName,
                password,
                role,
                mode,
                followings: JSON.stringify([]),
            };

            const formData = new FormData();

            Object.entries(payload).forEach(([key, value]) =>
                formData.append(key, value)
            );
            formData.append("cv", fakePdfFile);

            try {
                setShow(true);
                await axiosInstance.post("/auth/signup", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                toast.success("Registration successful");

                navigate("/resume", {
                    state: {
                        email,
                        firstName,
                        lastName,
                        password,
                        role,
                        mode,
                        followings: addedUsers,
                    },
                });
            } catch (error) {
                const errorText =
                    error.response?.data?.error || "Something went wrong";
                toast.error(errorText);
            } finally {
                setShow(false);
            }
        }
    };

    return (
        <div className="bg-white min-h-screen relative">
            
            <div className="w-full px-4 py-6 flex justify-start items-center max-w-screen-xl mx-auto">
                <img
                    src="/assets/images/logo.png"
                    alt="logo"
                    className="h-12 sm:h-16"
                />
            </div>

       
            <div className="flex flex-col items-center justify-start px-4 mx-auto w-full max-w-4xl pb-12">
                <div className="w-full max-w-3xl text-center mb-10 mt-12">
                    <p className="text-3xl sm:text-4xl md:text-5xl font-sarina font-semibold text-[#16730F]">
                        Connect With Users
                    </p>
                    <p className="text-[#333] font-normal text-sm sm:text-base md:text-lg mt-2">
                        Connect with at least 10 users to continue the signup
                        process
                    </p>
                </div>

                <UserList
                    users={usersData}
                    addedUsers={addedUsers}
                    onAdd={handleAdd}
                />

           
                <div className="w-full flex justify-center sm:justify-end mt-10 px-4">
                    <button
                        className={`w-52 h-12 rounded-2xl font-bold text-white transition-all duration-300 ${
                            isEnabled
                                ? "bg-[#16730F]"
                                : "bg-[#1A3E32] opacity-25 cursor-not-allowed"
                        }`}
                        disabled={!isEnabled}
                        onClick={handleClick}
                    >
                        Continue
                    </button>
                </div>
            </div>

            <Loader show={show} />
        </div>
    );
};

export default JobConnection;

