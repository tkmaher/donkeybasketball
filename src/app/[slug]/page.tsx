

import ReactLenis from "lenis/react";
import AboutStrip from "@/components/about";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    console.log("slug", slug);

  return (
    <ReactLenis root options={{
    duration: 1.2,
        lerp: 0.1,     
        smoothWheel: true 
    }}>
        {slug == "about" && <AboutStrip/>}
        
    </ReactLenis>
  )
}