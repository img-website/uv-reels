export const metadata = {
  title: "Admin Login Baba",
  description: "Generated by Admin Login Baba",
};

export default function AdminAuthLayout({ children }) {
  return (
    <main className="flex flex-col grow">
      {children}
    </main>
  );
}
