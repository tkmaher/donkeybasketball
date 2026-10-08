"use client";

import ReactLenis from "lenis/react";
import Link from "next/link";
import { useContext, MouseEvent } from "react";
import { CursorContext } from "./cursorcontext";
import { isInteractive } from "./cursor_changer";

export default function SideStrip() {


  const { cursorSetter } = useContext(CursorContext);


  // mouseover bubbles, so this fires as the pointer moves between children
  const handleMouseOver = (e: MouseEvent<HTMLDivElement>) => {
    cursorSetter(isInteractive(e.target) ?? 'plus');
  };

  return (
    <div
      className={`side-strip side-strip side-strip-about`}
      onMouseOver={handleMouseOver}
      onMouseLeave={() => cursorSetter("plus")}
    >
      <div className="side-strip__corners side-strip__corners--top">
        <div className="side-strip__corner side-strip__corner--tl" />
        <div className="side-strip__corner side-strip__corner--tr" />
      </div>

      <div className="side-strip__header">
      
        <div className="side-strip__title-row">    

          <div className="side-strip__title2">About</div>   

        </div>     
        <div className="side-strip__body-text">
          Donkey Basketball is the Chicago-based hardware performance and recording project of Isaac Tomas Lowenstein. Its second full-length, remold / recur, arrived in 2025 on Spain's EVEL, followed in 2026 by collaborations with Sun Picture and View 3.        </div>   
          <div className="side-strip__score side-strip-marg-3">
            <a className="side-strip__score side-strip-marg">Link1</a>
            <a className="side-strip__score side-strip-marg">Link2</a>
          </div>   
        </div>
      <div className="side-strip__footer">
      
      <div className="side-strip__glyph side-strip__glyph--sm">+</div>
        <div className="side-strip__glyph side-strip__glyph--xs">+</div>
      </div>
        

      <div className="side-strip__corners side-strip__corners--bottom">
        <div className="side-strip__corner side-strip__corner--bl" />
        <div className="side-strip__corner side-strip__corner--br" />
      </div>
    </div>
  );
}