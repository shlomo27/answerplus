import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import LandingPageClient from "./LandingPageClient";

export default async function RootPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/feed");
  }
  return <LandingPageClient />;
}
