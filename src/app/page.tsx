import { redirect } from "next/navigation";

// Root route automatically redirects to default locale /zh
export default function RootPage() {
  redirect("/zh");
}
