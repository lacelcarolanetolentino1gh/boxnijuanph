"use client";
import { useEffect, useState } from "react";

export default function PrivacyBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("privacyDismissed");
    if (!dismissed) setVisible(true);
  }, []);

  const dismiss = () => {
    localStorage.setItem("privacyDismissed", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="banner"
      aria-label="Privacy notice"
      className="bg-[#2D2D2D] text-white text-xs px-4 py-2.5 flex items-center justify-between gap-4"
    >
      <p className="text-gray-300 text-center flex-1">
        🔒 Your data is protected under <strong className="text-white">RA 10173</strong> (Data Privacy Act of 2012). We never store your payment info or sell your data.{" "}
        <a href="/privacy" className="underline text-[#7CAE8E] hover:text-green-300 transition-colors">
          Learn more
        </a>
      </p>
      <button
        onClick={dismiss}
        aria-label="Dismiss privacy notice"
        className="shrink-0 text-gray-400 hover:text-white transition-colors p-1"
      >
        ✕
      </button>
    </div>
  );
}
