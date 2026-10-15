"use client";

import ReactLenis from "lenis/react";
import Link from "next/link";
import { useContext, MouseEvent, useState } from "react";
import { CursorContext } from "./cursorcontext";
import { isInteractive } from "./cursor_changer";
import Image from "next/image";

export default function SideStrip() {
  const { cursorSetter } = useContext(CursorContext);
  const [loaded1, setLoaded1] = useState(false);
  const [loaded2, setLoaded2] = useState(false);


  // mouseover bubbles, so this fires as the pointer moves between children
  const handleMouseOver = (e: MouseEvent<HTMLDivElement>) => {
    cursorSetter(isInteractive(e.target) ?? 'plus');
  };

  return (
    <div
      className={`side-strip side-strip-about`}
      onMouseOver={handleMouseOver}
      onMouseLeave={() => cursorSetter("plus")}
    >
     
      <div className="side-strip__parent-body">
        <div className="side-strip__so" style={{height: '100%'}}>
          <Image 
            src="/sound-objects/1.png" 
            alt="Sound Objects" 
            width={600} 
            height={1000} 
            style={{opacity: loaded1 ? 1 : 0}}
            onLoad={() => setLoaded1(true)}
          />
          <Image 
            src="/sound-objects/2.png" 
            alt="Sound Objects" 
            width={600} 
            height={1000} 
            style={{opacity: loaded2 ? 1 : 0}}
            onLoad={() => setLoaded2(true)}
          />        
        </div>
      </div>
        


    </div>
  );
}