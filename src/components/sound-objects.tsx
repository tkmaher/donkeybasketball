"use client";

import { useContext, MouseEvent, useState, useEffect, useRef } from "react";
import { CursorContext } from "./cursorcontext";
import { isInteractive } from "./cursor_changer";
import Image from "next/image";

function FadeImage({ src, alt, onReady }: { src: string; alt: string; onReady: () => void }) {
  const ref = useRef<HTMLImageElement>(null);

  // covers cached / pre-hydration loads where onLoad never fires
  useEffect(() => {
    const img = ref.current;
    if (img?.complete && img.naturalWidth > 0) onReady();
  }, []);

  return (
    <Image
      ref={ref}
      src={src}
      alt={alt}
      width={600}
      height={1000}
      priority
      onLoad={onReady}
      onError={onReady}   // don't leave the page blank if one fails
      style={{ aspectRatio: "600 / 1000" }}
    />
  );
}

export default function SoundObjectsPage() {
  const { cursorSetter } = useContext(CursorContext);
  const [loadedCount, setLoadedCount] = useState(0);
  const ready = loadedCount >= 2;

  const handleMouseOver = (e: MouseEvent<HTMLDivElement>) => {
    cursorSetter(isInteractive(e.target) ?? "plus");
  };

  const bump = () => setLoadedCount((c) => c + 1);

  return (
    <div
      className="side-strip side-strip-about"
      onMouseOver={handleMouseOver}
      onMouseLeave={() => cursorSetter("plus")}
    >
      <div className="side-strip__parent-body">
        <div
          className="side-strip__so"
          style={{ height: "100%" }}
          // toggles .is-loaded on the child images
          ref={(el) => {
            el?.querySelectorAll("img").forEach((img) =>
              img.classList.toggle("is-loaded", ready)
            );
          }}
        >
          <FadeImage src="/sound-objects/1.png" alt="Sound Objects" onReady={bump} />
          <FadeImage src="/sound-objects/2.png" alt="Sound Objects" onReady={bump} />
        </div>
      </div>
    </div>
  );
}