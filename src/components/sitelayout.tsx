import SideStrip from "@/components/obistrip";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="parent">
      <div className="strip-row">
        <SideStrip />
        <div
          className={`side-strip strip-width-about`}
          style={{ height: `calc(100dvh - 2em)` }}
        >
        {children}
        </div>
      </div>
    </div>
  );
}