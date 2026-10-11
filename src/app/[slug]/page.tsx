
import AboutStrip from "@/components/about";
import MusicStrip from "@/components/music";
import ShowStrip from "@/components/shows";
import SoundObjects from "@/components/sound-objects";
import { Metadata } from "next";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  return {
      title: slug,
  };
}


export default async function Page({ params }: { params: Promise<{ slug: string }>}) {
  const { slug } = await params;
  console.log("slug", slug);


  return (

      <>
        {slug === "about" && <AboutStrip/>}
        {slug === "files" && <MusicStrip/>}
        {slug === "shows" && <ShowStrip/>}
        {slug === "sound-objects" && <SoundObjects/>}

        {!['about', 'files', 'shows', "sound-objects"].includes(slug) && (
          <div>WIP!</div>
        )}
      </>
  )
}