import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MemberCard from '../components/MemberCard';
import fakePdfFile from '../utils/fake-pdf';
import { toast } from 'react-hot-toast';
import Loader from '../components/ui/Loader';
import axiosInstance from '../services/axios';

const EmployerOpt = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { email, firstName, lastName, password, role } = location.state || {};

    const [showIndividualInfo, setShowIndividualInfo] = useState(false);
    const [showCoperateInfo, setShowCoperateInfo] = useState(false);

    const [show, setShow] = useState(false);

    const individualRef = useRef(null);
    const coperateRef = useRef(null);

    const handleClick = async (mode) => {
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
        formData.append('cv', fakePdfFile);

        try {
            setShow(true);
            await axiosInstance.post('/auth/signup', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            toast.success('Registration successful');
        } catch (error) {
            const { error: errorText } = error.response.data;
            toast.error(errorText);
            return;
        } finally {
            setShow(false);
        }

        navigate('/resume');

        if (mode === 'individual') {
            navigate('/individual/basic-details');
        } else {
            navigate('/coperate/Basic-details');
        }
        // }
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                individualRef.current &&
                !individualRef.current.contains(e.target)
            )
                setShowIndividualInfo(false);
            if (coperateRef.current && !coperateRef.current.contains(e.target))
                setShowCoperateInfo(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="bg-white min-h-screen flex flex-col">
            <div className="w-full px-4 py-6 flex items-center max-w-screen-xl mx-auto">
                <img
                    src="/assets/images/logo.png"
                    alt="logo"
                    className="h-10"
                />
            </div>

            <div className="flex flex-col items-center justify-center w-full px-4 py-10 sm:py-20 mt-[5%]">
                <h1 className="lg:text-5xl text-2xl text-[#16730F] font-[500] leading-relaxed font-norican">
                    As an Employer
                </h1>
                <p className="lg:text-xl text-center text-[#333] font-[400] leading-relaxed">
                    Choose the account type that fits your hiring needs
                </p>

                <div className="lg:w-[50%] w-full px-4 mt-12 flex flex-wrap justify-around gap-6 py-10 bg-[#E0E0E01A] rounded-2xl border border-[#82828226]">
                    <MemberCard
                        label="INDIVIDUAL"
                        iconSrc="/assets/images/user.svg"
                        infoText="Individual employers are people whose businesses are not registered with the federal, state, or local governments. 
                      They are micro, small, and medium scale enterprises (SMEs). They also include people who are HR consultants (they recruit for other companies); 
                      individuals who require the services of other people on the platform."
                        position="above-icon"
                        showInfo={showIndividualInfo}
                        setShowInfo={setShowIndividualInfo}
                        containerRef={individualRef}
                        // onClick={() => navigate("/individual/basic-details")}
                        onClick={() => handleClick('individual')}
                    />

                    <MemberCard
                        label="Corporate "
                        iconSrc="/assets/images/freelic2.svg"
                        infoText="These are businesses, NGOs, religious bodies, or government organizations that are registered 
            with the federal, state, or local government of their country. They may be SMEs or larger corporate
             organizations, NGOs, and government bodies (Federal, state, or local governments). The representative
              on Bejite must be verified to ensure they are genuine."
                        position="below-card"
                        showInfo={showCoperateInfo}
                        setShowInfo={setShowCoperateInfo}
                        containerRef={coperateRef}
                        // onClick={() => navigate("/coperate/Basic-details")}
                        onClick={() => handleClick('corperate')}
                    />
                </div>
            </div>
            <Loader show={show} />
        </div>
    );
};

export default EmployerOpt;
