import { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import StepTabs from '../../../components/StepTabs';
import ProgressBar from '../../../components/ProgressBar';
import ImageUpload from '../../../components/ImageUpload';
import FieldGroup from '../../../components/FieldGroup';
import NavigationButtons from '../../../components/NavigationButtons';
import Header from '../../../components/Header';
import { toast } from 'react-toastify';
import useLocalStorage from '../../../hooks/useLocalStorage';
import CreateBio from '../../../services/createBio';
import { countries } from '../../../data/countries';
import { steps } from '../../../data/bioSteps';
import { API_URL } from '../../../config';
import { updateUser } from '../../../features/auth/authSlice';

const Bio = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentStep, isEditMode, cvData, getPath } = useOutletContext();

    const handleStepClick = (path) => {
        navigate(path);
    };

    const [imageFile, setImageFile] = useState(null); 
    const [imagePreview, setImagePreview] = useState(null);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [formData, setFormData] = useState({
        nickname: '',
        phone: '',
        gender: '',
        maritalStatus: '',
        age: '',
        country: '',
        street: '',
        city: '',
        tribe: '',
        zip: '',
        bio: '',
    });

    // Helper function to safely convert values to strings
    const toString = (value) => {
        if (value === null || value === undefined) return '';
        return String(value);
    };

    // Function to get full URL for profile photo
    const getProfileImageUrl = (imagePath) => {
        if (!imagePath) return imagePath;
        // If it's already a full URL, return as is
        if (imagePath.startsWith('http')) return imagePath;
        // For local paths like /uploads/filename.jpg, use the config API_URL with fallback
        if (imagePath.startsWith('/uploads')) {
            const baseUrl = API_URL || 'http://localhost:3001';
            return `${baseUrl}${imagePath}`;
        }
        // Otherwise, prepend the API URL
        return `${API_URL || 'http://localhost:3001'}${imagePath}`;
    };

    // Load existing bio data when in edit mode
    useEffect(() => {
        if (isEditMode && cvData?.bio && !dataLoaded) {
            const bio = cvData.bio;
            setFormData({
                nickname: toString(bio.nickname),
                phone: toString(bio.phone),
                gender: toString(bio.gender),
                maritalStatus: toString(bio.marital_status),
                age: toString(bio.age),
                country: toString(bio.country),
                street: toString(bio.street),
                city: toString(bio.city),
                tribe: toString(bio.tribe),
                zip: toString(bio.zip),
                bio: toString(bio.bio),
            });
            if (bio.profile_photo) {
                setImagePreview(getProfileImageUrl(bio.profile_photo));
            }
            setDataLoaded(true);
        }
    }, [isEditMode, cvData, dataLoaded]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Ensure all form values are strings
        setFormData({ ...formData, [name]: String(value) });
    };
    const handleImageChange = (e) => {
        const file = e.target.files?.[0]; 
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        } else {
            setImageFile(null); 
            setImagePreview(null);
        }
    };

    const isFormComplete =
        Object.values(formData).every((v) => {
            const str = typeof v === 'string' ? v : String(v || '');
            return str.trim() !== '';
        }) && (imageFile || imagePreview);

    //pass data and image to createBio Api
    const { postBioData, uploadProfileImage } = CreateBio(); 
    const { id: userId } = useLocalStorage('user');

    // Utility function to normalize text for consistent storage
    const normalizeText = (text) => {
        if (!text || typeof text !== 'string') return text;
        return text.trim().toLowerCase();
    };

    // function that chains both API calls
    const handleNextStep = async () => {
        if (!isFormComplete) {
            toast.error('Please complete all fields and upload an image.');
            return;
        }

        const bioPayload = {
            userId,
            nickname: normalizeText(formData.nickname), // Normalize nickname
            phone: normalizeText(formData.phone), // Normalize phone (though it's usually already clean)
            gender: normalizeText(formData.gender), // Normalize gender
            maritalStatus: normalizeText(formData.maritalStatus), // Normalize marital status
            age: formData.age, // Age is numeric, no normalization needed
            country: normalizeText(formData.country), // Normalize country
            street: normalizeText(formData.street), // Normalize street
            city: normalizeText(formData.city), // Normalize city
            tribe: normalizeText(formData.tribe), // Normalize tribe
            zip: normalizeText(formData.zip), // Normalize zip
            bio: formData.bio, // Bio text can contain mixed case, keep as-is for readability
        };

        //  sequential logic
        const submitProfileSequence = async () => {
            await postBioData(bioPayload);
            let photoResponse = null;
            if (imageFile) {
                photoResponse = await uploadProfileImage(imageFile);
                // Update user data with new profile photo URL
                if (photoResponse?.data?.profilePhoto) {
                    dispatch(updateUser({ image: photoResponse.data.profilePhoto }));
                }
            } else {
                throw new Error('Image file is missing for upload.');
            }

            return 'Profile updated successfully!';
        };

        try {
            await toast.promise(
                submitProfileSequence(), 
                {
                    pending: 'Saving personal information...',
                    success: 'Profile updated successfully!',
                    error: {
                        render({ data }) {
                            return `Save failed: ${data}`;
                        },
                    },
                }
            );
            
            // Navigate only after the entire sequence completes successfully
            if (isEditMode) {
                navigate(getPath(currentStep + 1));
            } else {
                navigate('/education'); 
            }

        } catch (error) {
            console.error(error); 
        }
    };

    return (
        <div className="bg-white">
            <Header />

            <StepTabs steps={steps} currentStep={currentStep} onStepClick={handleStepClick} getPath={getPath} isEditMode={isEditMode} />
            <ProgressBar currentStep={currentStep} totalSteps={steps.length} />

            <section className="max-w-3xl mx-auto px-4 mt-4 text-[#1A3E32] text-2xl font-semibold">
                Bio/Personal Information
            </section>
            <p className="max-w-3xl mx-auto px-4 text-[#333] text-[15px]">
                Tell us who you are. This is the first impression employers get.
            </p>

            <div className="max-w-4xl mx-auto mt-6 border-2 border-[#E0E0E0] flex flex-col lg:flex-row gap-8 p-4">
                <ImageUpload
                    imagePreview={imagePreview}
                    handleImageChange={handleImageChange}
                    bio={formData.bio}
                    onBioChange={handleChange}
                />

                <FieldGroup
                    formData={formData}
                    handleChange={handleChange}
                    countries={countries}
                />
            </div>

            <NavigationButtons
                isFormComplete={isFormComplete}
                onBack={() => {
                    if (isEditMode) {
                        navigate(getPath(currentStep - 1));
                    } else {
                        navigate(-1);
                    }
                }}
                onNext={handleNextStep}
            />
        </div>
    );
};

export default Bio;
