import React from 'react';
import Button from '../../components/ui/Button';

const Contact = () => {
    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-8 text-center text-primary">Contact Us</h1>
            <div className="max-w-2xl mx-auto bg-base-100 p-8 rounded-xl shadow-lg border border-base-200">
                <p className="mb-6 text-center text-gray-600 dark:text-gray-400">
                    Have questions or feedback? We'd love to hear from you. Fill out the form below or reach out to us directly.
                </p>
                <form className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
                        <input
                            type="text"
                            id="name"
                            className="input input-bordered w-full"
                            placeholder="Your Name"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="input input-bordered w-full"
                            placeholder="your@email.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                        <textarea
                            id="message"
                            className="textarea textarea-bordered w-full h-32"
                            placeholder="How can we help you?"
                        ></textarea>
                    </div>
                    <Button variant="primary" className="w-full">Send Message</Button>
                </form>
            </div>
        </div>
    );
};

export default Contact;
