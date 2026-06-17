import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import LandingPageClient from "./LandingPageClient";

export default async function RootPage() {
  let session = null;
  try {
    session = await auth();
  } catch {
    // auth failed — show landing page
  }

  if (session?.user) {
    redirect("/feed");
  }

  return <LandingPageClient />;
}
