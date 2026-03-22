import Breadcrumb from "@/components/layout/Breadcrumb";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Breadcrumb />
      {children}
    </>
  );
}












