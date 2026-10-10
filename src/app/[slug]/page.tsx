
import ReactLenis from "lenis/react";
import AboutStrip from "@/components/about";
import MusicStrip from "@/components/music";

export default async function Page({ params }: { params: Promise<{ slug: string }>}) {
    const { slug } = await params;
    console.log("slug", slug);


  return (

      <>
        {slug === "about" && <AboutStrip/>}
        {slug === "files" && <MusicStrip/>}
        {!['about', 'files'].includes(slug) && (
          <div>WIP!</div>
        )}
      </>
  )
}