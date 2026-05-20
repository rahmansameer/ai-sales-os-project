"use client";

import { FormEvent, useState } from "react";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);

    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      await fetch(
        "https://survivor-ocelot-outback.ngrok-free.dev/webhook-test/lead-capture",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      setSuccess(true);

      e.currentTarget.reset();
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  return (
    <section className="min-h-screen bg-[#f6f6f6] flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-2xl p-8 md:p-10 shadow-sm">
        <h1 className="text-3xl md:text-4xl font-semibold text-black mb-8">
          Contact Form
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="name"
            required
            placeholder="Name"
            className="w-full h-14 px-5 rounded-xl border border-gray-300 bg-white text-black outline-none focus:border-black transition"
          />

          <input
            type="email"
            name="email"
            required
            placeholder="Email"
            className="w-full h-14 px-5 rounded-xl border border-gray-300 bg-white text-black outline-none focus:border-black transition"
          />

          <textarea
            name="message"
            required
            rows={6}
            placeholder="Message"
            className="w-full px-5 py-4 rounded-xl border border-gray-300 bg-white text-black outline-none resize-none focus:border-black transition"
          />

          {success && (
            <div className="w-full px-4 py-3 rounded-xl text-sm font-medium border border-green-200 bg-green-50 text-green-700">
              Message sent successfully.
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-black text-white rounded-xl font-medium transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Submit"}
          </button>
        </form>
      </div>
    </section>
  );
}
