"use client";
import { useEffect } from "react";

export default function NativeGooglePage() {
  useEffect(() => {
    fetch("/api/auth/csrf")
      .then((r) => r.json())
      .then(({ csrfToken }) => {
        const form = document.getElementById("signin-form") as HTMLFormElement;
        const csrf = document.getElementById("csrf") as HTMLInputElement;
        csrf.value = csrfToken;
        form.submit();
      });
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <form id="signin-form" method="POST" action="/api/auth/signin/google">
        <input id="csrf" type="hidden" name="csrfToken" value="" />
        <input type="hidden" name="callbackUrl" value="/feed" />
      </form>
      <p style={{ color: "#6366f1", fontFamily: "sans-serif" }}>Connecting to Google...</p>
    </div>
  );
}
