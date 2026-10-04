import AboutStrip from "@/components/about";
import MusicStrip from "@/components/music";
import SideStrip from "@/components/obistrip";

export default function Page() {
  return (
    <div className="strip-col parent">
        <div className="strip-row">
          <div className="strip-col">
            <SideStrip/>
            <AboutStrip/>
          </div>
          <MusicStrip/>
        </div>



    </div>
  )
}