import Sidebar from '@/components/layout/sidebar';


export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="w-full flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
