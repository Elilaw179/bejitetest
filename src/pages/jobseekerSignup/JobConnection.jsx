<<<<<<< HEAD
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import usersData from "../../data/usersData";
import UserList from "../../components/UserList";

const JobConnection = () => {
  const [addedUsers, setAddedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract query params
  const params = new URLSearchParams(location.search);
  const email = params.get("email");
  const role = params.get("role");
  const mode = params.get("mode");

  console.log("JobConnection loaded:", { email, role, mode });

  const handleAdd = (id) => {
    if (!addedUsers.includes(id)) {
      setAddedUsers((prev) => [...prev, id]);
    }
  };

  const handleContinue = async () => {
    if (addedUsers.length < 10) {
      toast.error("Please connect with at least 10 users.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("https://bejite-backend.onrender.com/auth/complete-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          role: role?.toLowerCase(),
          mode: mode?.toLowerCase(),
          followings: addedUsers, // ✅ Send as array
        }),
      });

      const data = await res.json();
      console.log("Complete signup response:", data);

      if (res.ok) {
        toast.success(data.message || "Signup completed successfully!");
        navigate("/"); // redirect to login
      } else {
        toast.error(data.error || "Failed to complete signup.");
      }
    } catch (error) {
      console.error("CompleteSignup error:", error);
      toast.error("Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const isEnabled = addedUsers.length >= 10;

  return (
    <div className="bg-white min-h-screen relative">
      {/* Logo */}
      <div className="w-full px-4 py-6 flex justify-start items-center max-w-screen-xl mx-auto">
        <img src="/assets/images/logo.png" alt="logo" className="h-12 sm:h-16" />
      </div>

      {/* Content */}
      <div className="flex flex-col items-center justify-start px-4 mx-auto w-full max-w-4xl pb-12">
        <div className="w-full max-w-3xl text-center mb-10 mt-12">
          <p className="text-3xl sm:text-4xl md:text-5xl font-sarina font-semibold text-[#16730F]">
            Connect With Users
          </p>
          <p className="text-[#333] font-normal text-sm sm:text-base md:text-lg mt-2">
            Connect with at least 10 users to continue the signup process
          </p>
        </div>

        {/* User List */}
        <UserList users={usersData} addedUsers={addedUsers} onAdd={handleAdd} />

        {/* Counter + Button */}
        <div className="w-full flex flex-col sm:flex-row sm:justify-between items-center mt-10 px-4">
          {/* Feedback Counter */}
          <p className="text-sm sm:text-base text-[#333] mb-4 sm:mb-0">
            {addedUsers.length}/10 users selected
          </p>

          {/* Continue Button */}
          <button
            className={`w-52 h-12 rounded-2xl font-bold text-white flex items-center justify-center gap-2 transition-all duration-300 ${
              isEnabled
                ? "bg-[#16730F] hover:bg-[#0f4e0a]"
                : "bg-[#1A3E32] opacity-25 cursor-not-allowed"
            }`}
            disabled={!isEnabled || loading}
            onClick={handleContinue}
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Processing...
              </>
            ) : (
              "Continue"
            )}
          </button>
        </div>
      </div>
    </div>
  );
=======
import { useState } from 'react';
import usersData from '../../data/usersData';
import UserList from '../../components/UserList';
import { useNavigate } from 'react-router-dom';

const JobConnection = () => {
    const [addedUsers, setAddedUsers] = useState([]);
    const navigate = useNavigate();

    const isEnabled = addedUsers.length >= 10;

    const handleAdd = (id) => {
        if (!addedUsers.includes(id)) {
            setAddedUsers([...addedUsers, id]);
        }
    };

    // const handleClick = async () => {
    //     if (isEnabled) {
    //         const payload = {
    //             email,
    //             firstName,
    //             lastName,
    //             password,
    //             role,
    //             mode,
    //             followings: JSON.stringify([]),
    //         };

    //         const formData = new FormData();

    //         Object.entries(payload).forEach(([key, value]) =>
    //             formData.append(key, value)
    //         );
    //         formData.append("cv", fakePdfFile);

    //         try {
    //             setShow(true);
    //             await axiosInstance.post("/auth/signup", formData, {
    //                 headers: { "Content-Type": "multipart/form-data" },
    //             });

    //             toast.success("Registration successful");

    //             navigate("/resume", {
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
    //         } catch (error) {
    //             const errorText =
    //                 error.response?.data?.error || "Something went wrong";
    //             toast.error(errorText);
    //         } finally {
    //             setShow(false);
    //         }
    //     }
    // };

    const handleClick = () => {
        navigate('/resume');
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
                                ? 'bg-[#16730F]'
                                : 'bg-[#1A3E32] opacity-25 cursor-not-allowed'
                        }`}
                        disabled={!isEnabled}
                        onClick={handleClick}
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
>>>>>>> bd81adc0c17b7e4b733a0b4e8909a6c41c05447c
};

export default JobConnection;
