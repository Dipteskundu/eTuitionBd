import { motion } from 'framer-motion';
import { FaUserPlus, FaSearch, FaHandshake } from 'react-icons/fa';

const steps = [
  {
    icon: <FaUserPlus size={40} />,
    title: "Create Account",
    description: "Register as a student or tutor in just a few clicks. It's free and easy!"
  },
  {
    icon: <FaSearch size={40} />,
    title: "Post or Search",
    description: "Post your tuition requirements or search for the perfect tutor/student."
  },
  {
    icon: <FaHandshake size={40} />,
    title: "Connect & Learn",
    description: "Connect with your match, start learning, and achieve your academic goals."
  }
];

const HowItWorks = () => {
  return (
    <section className="page-container section-padding bg-white">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">How It Works</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Getting started with eTuitionBd is simple. Follow these three easy steps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {/* Connecting Line (Desktop only) */}
        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-1 bg-gray-200 -z-10"></div>

        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="w-24 h-24 mx-auto bg-primary text-white rounded-full flex items-center justify-center shadow-lg mb-6 relative z-10">
              {step.icon}
            </div>
            <h3 className="text-xl font-bold mb-3 text-secondary">{step.title}</h3>
            <p className="text-gray-600 px-4">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
