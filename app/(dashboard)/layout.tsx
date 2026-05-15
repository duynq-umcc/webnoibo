import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth } from "@/lib/firebase/admin";
import { DashboardClientLayout } from "@/components/providers/DashboardClientLayout";

const SESSION_COOKIE_NAME = "session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    redirect("/login");
  }

  try {
    await adminAuth.verifySessionCookie(sessionCookie);
  } catch {
    redirect("/login");
  }

  return <DashboardClientLayout>{children}</DashboardClientLayout>;
}
