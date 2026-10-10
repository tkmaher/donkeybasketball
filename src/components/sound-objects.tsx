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
      className={`side-strip side-strip-about`}
      onMouseOver={handleMouseOver}
      onMouseLeave={() => cursorSetter("plus")}
    >
     
      <div className="side-strip__parent-body">
        <div className="side-strip__so" style={{height: '100%'}}>
          <div className="side-strip__so-block">
            <div className="side-strip__so-title">
              (sound <span style={{verticalAlign: "super"}}>objects</span>) = 88.9
            </div>
            mondays, 3:30pm
          </div>
          <div className="side-strip__so-block">
            <div className="side-strip__so-description">
              Sound objects are: dubbed and re-dubbed three-times-over, lost in the junk drawer,
              eternally existent, copied infinitely, buried in the backyard, technologically innovative,
              technologically obsolete, a replication of the real thing, soulfully misinterpreting, elegantly
              disenfranchised, surgically damaged, clipping the master bus; comfortably dynamic,
              structurally unsound, eternally stable, ancient, yet-to-come.
            </div>
          </div>
        </div>
      </div>
        


    </div>
  );
}