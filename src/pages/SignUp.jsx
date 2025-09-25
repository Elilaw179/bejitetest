import React, { useState, useEffect } from 'react';
import { FaGoogle, FaLinkedin } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Input from '../components/ui/Input';
import { toast } from 'react-toastify';
import Loader from '../components/ui/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser, clearErrors } from '../features/auth/authSlice';

function SignUp() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formErrors, setFormErrors] = useState({}); // ✅ LOCAL ERRORS

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, errors: apiErrors } = useSelector((state) => state.auth);

  const validateForm = () => {
    const newErrors = {};
    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i.test(email))
      newErrors.email = 'Email is invalid';
    if (!password) newErrors.password = 'Password is required';
    if (!confirmPassword || confirmPassword !== password)
      newErrors.confirmPassword = 'Passwords do not match';

    console.log('Validation errors:', newErrors);
    setFormErrors(newErrors); // ✅ UPDATE LOCAL STATE

    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm()) {
      console.log('Dispatching signupUser with:', {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
      });
      dispatch(signupUser({ firstName, lastName, email, password, confirmPassword }));
    }
  };

  useEffect(() => {
    if (user) {
      console.log('User signup successful:', user);
      toast.success('Registration successful!');
      navigate(`/auth/email-sent?email=${user.email}`);
    }
  }, [user, navigate]);

  useEffect(() => {
    if (apiErrors && Object.keys(apiErrors).length > 0) {
      console.log('API validation errors:', apiErrors);
      Object.values(apiErrors).forEach((msg) => toast.error(msg));
    }
  }, [apiErrors]);

  const isDisabled =
    !email || !firstName || !lastName || !password || !confirmPassword;

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Loader show={loading} />

      <div className="w-full lg:w-[70%] px-4 py-6 mx-auto flex flex-col sm:flex-row justify-between items-center">
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

      <div className="flex flex-col lg:flex-row flex-1 justify-between relative">
        <div className="w-full lg:w-[60%] relative hidden lg:block">
          <img
            src="/assets/images/Illustra.svg"
            alt="Auth"
            className="w-full h-screen"
          />
          <img
            src="/assets/images/asubtext.svg"
            alt="Auth Text"
            className="absolute top-3/7 left-[46%] transform -translate-x-1/2 -translate-y-1/2"
          />
        </div>

        <div className="w-full lg:w-[40%] flex items-center justify-center lg:justify-start px-6 py-10">
          <div className="w-full max-w-md space-y-2">
            <h2 className="text-3xl pt-4 font-norican font-semibold text-[#16730F] text-center">
              Sign Up
            </h2>
            <p className="text-center text-[#1A3E32] text-md">
              Create your account in a few steps
            </p>

            <div className="space-y-4">
              <Input type="text" placeholder="First Name" value={firstName} setValue={setFirstName} errorKey="firstName" localErrors={formErrors} />
              <Input type="text" placeholder="Last Name" value={lastName} setValue={setLastName} errorKey="lastName" localErrors={formErrors} />
              <Input type="email" placeholder="Email" value={email} setValue={setEmail} errorKey="email" localErrors={formErrors} />
              <Input type="password" placeholder="Password" value={password} setValue={setPassword} errorKey="password" localErrors={formErrors} />
              <Input type="password" placeholder="Confirm Password" value={confirmPassword} setValue={setConfirmPassword} errorKey="confirmPassword" localErrors={formErrors} />
            </div>

            <button
              className={`w-full py-4 rounded-full text-white font-semibold shadow-md transition mb-5 mt-2 ${
                isDisabled || loading ? 'bg-[#16730F40] cursor-not-allowed' : 'bg-[#16730F]'
              }`}
              onClick={handleContinue}
              disabled={isDisabled || loading}
            >
              Continue
            </button>

            <p className="text-[#1A3E32] text-center text-xl">...or signup with</p>
            <div className="flex justify-center gap-6 mt-1">
  {/* LinkedIn placeholder */}
  <FaLinkedin className="text-blue-600 text-3xl cursor-pointer" />

  {/* Google OAuth Button */}
  <button
    onClick={() => (window.location.href = "https://bejite-backend.onrender.com/auth/google")}
    className="w-8 h-8 flex items-center justify-center"
    aria-label="Sign up with Google"
  >
    <img src="/assets/images/google.png" alt="Google logo" className="w-8 h-8" />
  </button>

  {/* Twitter placeholder */}
  <img src="/assets/images/x.svg" alt="Twitter" className="w-8 h-8 cursor-pointer" />
</div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
