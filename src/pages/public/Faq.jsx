import React, { useState } from 'react';
import useTitle from '../../hooks/useTitle';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import Card from '../../components/ui/Card';

const Faq = () => {
    useTitle('Help & Support');

    const faqs = [
        {
            question: "How do I find a tutor?",
            answer: "You can browse our 'Tuitions' page or use the search bar to find tutors based on subject, location, and class. You can also post your tuition requirements, and interested tutors will apply."
        },
        {
            question: "Is eTuitionBd free to use?",
            answer: "Registration is free for both students and tutors. Students can browse and contact tutors for free. Tutors may have premium options for better visibility, but basic profiles are free."
        },
        {
            question: "How do I become a tutor?",
            answer: "Sign up as a 'Tutor' during registration. Complete your profile with your qualifications, experience, and subjects you want to teach. Once verified, your profile will be visible to students."
        },
        {
            question: "Is my payment information secure?",
            answer: "Yes, we use secure, industry-standard payment gateways for all transactions on our platform. We do not store your sensitive card details."
        },
        {
            question: "Can I change my role later?",
            answer: "Currently, you need to register with a specific role (Student or Tutor). If you wish to change, please contact our support team or register a new account with a different email."
        }
    ];

    const [activeIndex, setActiveIndex] = useState(null);

    const toggleFaq = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-base-100 py-16 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[5%] right-[10%] w-[30%] h-[30%] bg-accent/5 rounded-full blur-[100px] animate-float" />
                <div className="absolute bottom-[10%] left-[5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px] animate-float animation-delay-500" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-3xl mx-auto text-center mb-12">
                    <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full text-primary mb-4">
                        <HelpCircle size={32} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-heading font-bold gradient-text mb-6">Frequently Asked Questions</h1>
                    <p className="text-xl text-base-content/70">
                        Find answers to common questions about eTuitionBd.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto space-y-4">
                    {faqs.map((faq, index) => (
                        <Card key={index} glass className="overflow-hidden border border-base-200 transition-all duration-300 hover:shadow-md">
                            <button
                                onClick={() => toggleFaq(index)}
                                className="w-full text-left p-6 flex items-center justify-between gap-4 focus:outline-none"
                            >
                                <span className={`font-bold text-lg ${activeIndex === index ? 'text-primary' : 'text-base-content/90'}`}>
                                    {faq.question}
                                </span>
                                <div className={`p-2 rounded-full transition-colors ${activeIndex === index ? 'bg-primary text-white' : 'bg-base-200 text-base-content/60'}`}>
                                    {activeIndex === index ? <Minus size={18} /> : <Plus size={18} />}
                                </div>
                            </button>
                            <AnimatePresence>
                                {activeIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                    >
                                        <div className="px-6 pb-6 pt-0 text-base-content/70 leading-relaxed border-t border-base-200/50 mt-2">
                                            <div className="pt-4">
                                                {faq.answer}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Card>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <p className="text-base-content/60 mb-4">Still have questions?</p>
                    <a href="/contact" className="btn btn-primary px-8">Contact Support</a>
                </div>
            </div>
        </div>
    );
};

export default Faq;
