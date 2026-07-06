// This layout override removes the admin sidebar for the login page.
// Next.js uses the closest layout — this replaces the admin/layout.tsx for /admin/login only.
export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
