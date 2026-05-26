export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-gray-800">
      <h1 className="text-3xl font-bold mb-2 text-indigo-600">Privacy Policy</h1>
      <p className="text-sm text-gray-400 mb-8">Last updated: May 2026</p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
        <p className="text-gray-600">
          We collect information you provide when registering, such as your name and email address.
          We also collect questions you submit and interactions with AI responses.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. How We Use Your Information</h2>
        <p className="text-gray-600">
          We use your information to provide and improve the AICrowd service, including sending
          your questions to AI models (Claude, ChatGPT, Gemini) and displaying community responses.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. Data Sharing</h2>
        <p className="text-gray-600">
          We do not sell your personal data. Your questions are sent to third-party AI providers
          (Anthropic, OpenAI, Google) solely to generate responses. These providers have their own
          privacy policies.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. Data Retention</h2>
        <p className="text-gray-600">
          Your data is retained as long as your account is active. You may request deletion of
          your account and associated data at any time by contacting us.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">5. Cookies</h2>
        <p className="text-gray-600">
          We use session cookies for authentication purposes only. We do not use tracking or
          advertising cookies.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">6. Contact</h2>
        <p className="text-gray-600">
          For any privacy-related questions, contact us at:{" "}
          <a href="mailto:shlomo2708@gmail.com" className="text-indigo-600 underline">
            shlomo2708@gmail.com
          </a>
        </p>
      </section>
    </div>
  );
}
