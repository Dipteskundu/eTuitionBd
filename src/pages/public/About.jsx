import React from 'react';

const About = () => {
    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-6 text-center text-primary">About eTuitionBd</h1>
            <div className="max-w-3xl mx-auto space-y-6 text-lg text-gray-700 dark:text-gray-300">
                <p>
                    Welcome to <strong>eTuitionBd</strong>, your premier platform for connecting students with qualified tutors.
                    Our mission is to bridge the gap between eager learners and expert educators, making quality education accessible to everyone.
                </p>
                <p>
                    Whether you are a student looking for help with your studies or a tutor looking to share your knowledge and earn,
                    eTuitionBd provides a secure, easy-to-use, and efficient environment for all your tutoring needs.
                </p>
                <div className="mt-8 p-6 bg-base-200 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-semibold mb-4">Why Choose Us?</h2>
                    <ul className="list-disc list-inside space-y-2">
                        <li>Verified Tutors and Students</li>
                        <li>Secure Payment Processing</li>
                        <li>Easy Tuition Management</li>
                        <li>Dedicated Support</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default About;
