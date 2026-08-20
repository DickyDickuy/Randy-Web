'use client';

import React, { useState } from 'react';
import HoneypotField from '@/components/ui/HoneypotField';
import { LiquidMetalButton } from '@/components/ui/liquid-metal-button';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    message: '',
    website: '', // Honeypot field value
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);

      // Honeypot check: If bot filled the hidden field, fake success but do not process
      if (formData.website) {
        console.warn('Bot detected via honeypot field');
      } else {
        console.log('Form submission received:', formData);
      }
    }, 600);
  };

  return (
    <section
      id="contact"
      className="w-full bg-[#000000] text-white py-16 sm:py-24 px-6 sm:px-12 md:px-16 lg:px-24 select-none relative overflow-hidden"
    >
      {/* Background Accent Gradients */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
        {/* Section Header */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <span className="w-2.5 h-2.5 bg-white rounded-full animate-ping" />
            <span className="font-mono text-xs uppercase font-extrabold tracking-widest text-neutral-400">
              05 / EXECUTIVE INQUIRY
            </span>
          </div>
          <h2 className="text-4xl md:text-7xl font-serif font-semibold tracking-tight uppercase leading-none text-white hover:tracking-wider transition-all duration-300">
            BUILD SOMETHING<br />
            <span className="text-white underline decoration-neutral-600 underline-offset-8">EXTRAORDINARY</span> TOGETHER
          </h2>
          <p className="font-lato text-neutral-300 text-base md:text-xl max-w-2xl font-normal leading-relaxed pt-2">
            Planning a flagship enterprise initiative, spatial experience, or seeking a strategic partnership with CEO Randy? Initiate a direct consultation below.
          </p>
        </div>

        {/* Form Container */}
        {submitted ? (
          <div className="p-12 bg-neutral-950 rounded-3xl border border-neutral-800 text-center space-y-4 max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center text-3xl font-black mx-auto mb-4">
              ✓
            </div>
            <h3 className="text-3xl font-serif font-semibold uppercase text-white">INQUIRY TRANSMITTED</h3>
            <p className="font-lato text-neutral-300 text-base font-normal leading-relaxed">
              Thank you for reaching out. Our executive team will review your inquiry and connect within 24 hours.
            </p>
            <div className="pt-6">
              <LiquidMetalButton
                label="SEND ANOTHER MESSAGE"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    fullName: '',
                    companyName: '',
                    email: '',
                    message: '',
                    website: '',
                  });
                }}
              />
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
            {/* Honeypot Spam Protection Field */}
            <HoneypotField
              value={formData.website}
              onChange={handleChange}
            />

            {/* Desktop 2-column Grid (Full Name / Company Name), Mobile Stack */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label
                  htmlFor="fullName"
                  className="block text-xs font-mono font-bold uppercase tracking-wider text-neutral-400"
                >
                  FULL NAME <span className="text-white">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-white rounded-xl px-5 py-4 text-white text-base outline-none transition-colors duration-300"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="companyName"
                  className="block text-xs font-mono font-bold uppercase tracking-wider text-neutral-400"
                >
                  COMPANY / ENTERPRISE NAME
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  placeholder="e.g. Nexus Global"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-white rounded-xl px-5 py-4 text-white text-base outline-none transition-colors duration-300"
                />
              </div>
            </div>

            {/* Email Field (Full width) */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-xs font-mono font-bold uppercase tracking-wider text-neutral-400"
              >
                CORPORATE EMAIL <span className="text-white">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="alex@nexusglobal.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-white rounded-xl px-5 py-4 text-white text-base outline-none transition-colors duration-300"
              />
            </div>

            {/* Message Field (Full width) */}
            <div className="space-y-2">
              <label
                htmlFor="message"
                className="block text-xs font-mono font-bold uppercase tracking-wider text-neutral-400"
              >
                PROJECT SCOPE & OBJECTIVES <span className="text-white">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                placeholder="Detail your project vision, timeline, and strategic requirements..."
                value={formData.message}
                onChange={handleChange}
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-white rounded-xl px-5 py-4 text-white text-base outline-none transition-colors duration-300 resize-y"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <LiquidMetalButton
                type="submit"
                disabled={submitting}
                label={submitting ? 'TRANSMITTING...' : 'INITIATE EXECUTIVE INQUIRY ➔'}
              />
            </div>
          </form>
        )}

      </div>
    </section>
  );
}
