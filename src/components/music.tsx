"use client";

import ReactLenis from "lenis/react";
import Link from "next/link";
import { useEffect, useState, type ReactNode, useContext, MouseEvent } from "react";
import { CursorContext } from "./cursorcontext";


/**
 * Lays out any number of <SideStrip>s in a row that scrolls horizontally
 * once it overflows, and mounts the shared cursor once for all of them.
 */
export function SideStripRow({ children }: { children: ReactNode }) {
  return (
    <div className="side-strip-row">
      <ReactLenis root options={{
          duration: 1.2,
          lerp: 0.1,     
          smoothWheel: true 
      }}>
        {children}
      </ReactLenis>
    </div>
  );
}

const INTERACTIVE_SELECTOR = "button, a, input, textarea, select, label, div";

const isInteractive = (target: EventTarget) => {
  if (!(target instanceof Element) || (target.children.length)) return null;
  const closest = target.closest(INTERACTIVE_SELECTOR) ?? null;
  if (!closest) return null;
  if (closest.matches("button") || closest.matches("a"))
    return "donut";
  if (closest.matches("input") || closest.matches("textarea"))
    return "text";
  return "plus";
}

export default function SideStrip() {


  const { cursorSetter } = useContext(CursorContext);


  // mouseover bubbles, so this fires as the pointer moves between children
  const handleMouseOver = (e: MouseEvent<HTMLDivElement>) => {
    cursorSetter(isInteractive(e.target) ?? 'plus');
  };

  return (
    <div
      className={`side-strip`}
      onMouseOver={handleMouseOver}
      onMouseLeave={() => cursorSetter("plus")}
    >
      <div className="side-strip__corners side-strip__corners--top">
        <div className="side-strip__corner side-strip__corner--tl" />
        <div className="side-strip__corner side-strip__corner--tr" />
      </div>

      <div className="side-strip__header">
      
      <div className="side-strip__glyph side-strip__glyph--sm">+</div>
        <div className="side-strip__glyph side-strip__glyph--xs">+</div>
      

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