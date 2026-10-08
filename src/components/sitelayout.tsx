import SideStrip from "@/components/obistrip";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="parent">
      <div className="strip-row">
        <SideStrip />
        {children}
      </div>
    </div>
  );
}