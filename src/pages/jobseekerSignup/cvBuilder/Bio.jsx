import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
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

const Bio = () => {
    const navigate = useNavigate();
    const { currentStep } = useOutletContext();

    const [imageFile, setImageFile] = useState(null); 
    const [imagePreview, setImagePreview] = useState(null);
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

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
        Object.values(formData).every((v) => v.trim() !== '') && imageFile;

    //pass data and image to createBio Api
    const { postBioData, uploadProfileImage } = CreateBio(); 
    const { id: userId } = useLocalStorage('user');

    // function that chains both API calls
    const handleNextStep = async () => {
        if (!isFormComplete) {
            toast.error('Please complete all fields and upload an image.');
            return;
        }
        
        const bioPayload = {
            userId,
            ...formData,
        };

        //  sequential logic
        const submitProfileSequence = async () => {
            await postBioData(bioPayload); 
            if (imageFile) {
                await uploadProfileImage(imageFile);
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
            navigate('/education'); 

        } catch (error) {
            console.error(error); 
        }
    };

    return (
        <div className="bg-white">
            <Header />

            <StepTabs steps={steps} currentStep={currentStep} />
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
                onBack={() => navigate(-1)}
                onNext={handleNextStep}
            />
        </div>
    );
};

export default Bio;
