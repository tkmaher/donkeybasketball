import MusicStrip from "@/components/music";
import SideStrip from "@/components/obistrip";

export default function Page() {
  return (
    <div className="strip-col parent">
        <div className="strip-row">
          <div className="strip-col">
            <SideStrip/>
            <MusicStrip/>
          </div>
          <MusicStrip/>
        </div>



    </div>
  )
}