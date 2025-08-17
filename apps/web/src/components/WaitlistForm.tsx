import type React from "react";
import { useState } from "react";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);

    // TODO: Replace with actual waitlist API call
    // await addToWaitlist(email)

    // Mock submission delay
    setTimeout(() => {
      setIsSubmitted(true);
      setIsSubmitting(false);
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="border border-terminal-green/30 p-6 bg-background">
        <pre className="text-terminal-green text-sm">
          {`$ ./add-to-waitlist --email="${email}"
[SUCCESS] Email added to waitlist
[INFO] We'll be in touch soon

> Thank you for joining! 🚀`}
        </pre>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-terminal-green/50 text-sm">
            user@
          </span>
          <input
            type="email"
            placeholder="your-email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-16 pr-3 py-2 bg-background border border-terminal-green/30 text-terminal-green placeholder:text-terminal-green/40 font-mono focus:outline-none focus:border-terminal-green/50"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-terminal-amber text-black hover:bg-terminal-amber/80 font-mono px-6 py-2 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Adding..." : "Get Early Access"}
        </button>
      </div>
      <p className="text-xs text-terminal-green/50">
        → No spam, just early access notifications
        <br />→ Unsubscribe anytime with one click
      </p>
    </form>
  );
}
