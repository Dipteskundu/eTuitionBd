import { motion } from 'framer-motion';
import { FaCheckCircle, FaShieldAlt, FaClock, FaWallet } from 'react-icons/fa';

const features = [
  {
    icon: <FaCheckCircle className="text-success" size={32} />,
    title: "Verified Tutors",
    description: "All our tutors go through a strict verification process to ensure quality."
  },
  {
    icon: <FaShieldAlt className="text-primary" size={32} />,
    title: "Secure Platform",
    description: "Your data and payments are 100% secure with our advanced encryption."
  },
  {
    icon: <FaClock className="text-warning" size={32} />,
    title: "Fast & Efficient",
    description: "Find a tutor or student in minutes with our smart matching system."
  },
  {
    icon: <FaWallet className="text-info" size={32} />,
    title: "Affordable",
    description: "Competitive rates and zero hidden fees for students."
  }
];

const WhyChooseUs = () => {
  return (
    <section className="page-container section-padding bg-base-200/30">
      <div className="flex flex-col lg:flex-row items-center gap-12">
        {/* Left Side - Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex-1"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">Why Choose eTuitionBd?</h2>
          <p className="text-lg text-gray-600 mb-8">
            We are the most trusted tuition media in Bangladesh. We bridge the gap between
            students and tutors with trust, transparency, and technology.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="mt-1">{feature.icon}</div>
                <div>
                  <h3 className="font-bold text-lg mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-500">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Side - Image */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex-1"
        >
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary to-secondary rounded-2xl opacity-20 blur-lg"></div>
            <img
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80"
              alt="Happy students"
              className="relative rounded-2xl shadow-2xl w-full object-cover h-[400px]"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
