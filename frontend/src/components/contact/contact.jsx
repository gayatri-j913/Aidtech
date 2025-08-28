import React, { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Process the form data (e.g., send it to an API)
    console.log("Form submitted:", formData);
    // Optionally reset the form after submission:
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="container mx-auto p-6  min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8 text-white">
        Contact Us
      </h1>

      {/* Contact Information Section */}
      <div className="max-w-xl mx-auto text-white mb-6">
        <p className="text-center text-lg">
          You can reach us at{" "}
          <a href="mailto:info@aidtechalliance.org" className="text-blue-400 hover:underline">
            info@aidtechalliance.org
          </a>{" "}
          or call us at{" "}
          <span className="font-bold">(123) 456-7890</span>.
        </p>
        
      </div>

      {/* Contact Form */}
      <div className="max-w-xl mx-auto bg-gray-800 shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-white text-sm font-bold mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          {/* Email Field */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-white text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
              className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          {/* Subject Field */}
          <div className="mb-4">
            <label htmlFor="subject" className="block text-white text-sm font-bold mb-2">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Subject"
              required
              className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          {/* Message Field */}
          <div className="mb-6">
            <label htmlFor="message" className="block text-white text-sm font-bold mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              required
              className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:shadow-outline h-32"
            ></textarea>
          </div>
          {/* Submit Button */}
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Contact;
