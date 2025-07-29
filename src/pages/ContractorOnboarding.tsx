import React, { useState, useEffect } from "react";

import { User } from "@/entities/User";
import { Contractor } from "@/entities/Contractor";
import { motion, AnimatePresence } from "framer-motion";

import WelcomeStep from "../components/onboarding/WelcomeStep";
import UploadStep from "../components/onboarding/UploadStep";
import ProfileStep from "../components/onboarding/ProfileStep";
import CompleteStep from "../components/onboarding/CompleteStep";
import ProgressIndicator from "../components/onboarding/ProgressIndicator";

export default function OnboardingPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [user, setUser] = useState<any>(null);
    const [contractorData, setContractorData] = useState({
        full_name: "",
        email: "",
        degree: "",
        university: "",
        graduation_year: new Date().getFullYear(),
        gpa: "",
        skills: [],
        interests: [],
        linkedin_url: "",
        bio: "",
        resume_url: ""
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const userData = await User.me();
            setUser(userData);
            if (userData) {
                setContractorData(prev => ({
                    ...prev,
                    full_name: userData['full name'] || "",
                    email: userData.email || ""
                }));
            }
        } catch (error) {
            console.error("User not authenticated");
        }
        setIsLoading(false);
    };

    const handleNext = () => {
        if (currentStep < 4) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleDataUpdate = (newData: any) => {
        setContractorData(prev => ({
            ...prev,
            ...newData
        }));
    };

    const handleComplete = async () => {
        try {
            await Contractor.create({
                name: contractorData.full_name,
                description: contractorData.bio,
                skills: contractorData.skills,
                interests: contractorData.interests,
                resume: contractorData.resume_url
            });
            setCurrentStep(4);
        } catch (error) {
            console.error("Error saving contractor data:", error);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    const steps = [
        { number: 1, title: "Welcome", component: WelcomeStep },
        { number: 2, title: "Upload", component: UploadStep },
        { number: 3, title: "Profile", component: ProfileStep },
        { number: 4, title: "Complete", component: CompleteStep }
    ];

    const CurrentStepComponent = steps[currentStep - 1].component;

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <ProgressIndicator 
                    currentStep={currentStep} 
                    totalSteps={4} 
                    steps={steps}
                />
                
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="mt-8"
                    >
                        <CurrentStepComponent
                            data={contractorData}
                            onDataUpdate={handleDataUpdate}
                            onNext={handleNext}
                            onBack={handleBack}
                            onComplete={handleComplete}
                            user={user}
                        />
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}