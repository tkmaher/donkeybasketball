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

const INTERACTIVE_SELECTOR = "button, a, input, textarea, select, label";

const isInteractive = (target: EventTarget) =>
  target instanceof Element && target.closest(INTERACTIVE_SELECTOR) !== null;

export default function SideStrip() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  const { cursorSetter } = useContext(CursorContext);

  // Cursor label for a non-interactive hover, given the current state
  const toggleCursor = (isCollapsed: boolean) =>
    isCollapsed ? "expand" : "collapse";

  // mouseover bubbles, so this fires as the pointer moves between children
  const handleMouseOver = (e: MouseEvent<HTMLDivElement>) => {
    cursorSetter(isInteractive(e.target) ? "plus" : toggleCursor(collapsed));
  };

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if (isInteractive(e.target)) return;
    setCollapsed(!collapsed);
    cursorSetter(toggleCursor(!collapsed)); // label for the *new* state
  };

  return (
    <div
      className={`side-strip${collapsed ? " side-strip--collapsed" : ""}`}
      onMouseOver={handleMouseOver}
      onMouseLeave={() => cursorSetter("plus")}
      onClick={handleClick}
    >
      <div className="side-strip__corners side-strip__corners--top">
        <div className="side-strip__corner side-strip__corner--tl" />
        <div className="side-strip__corner side-strip__corner--tr" />
      </div>

      <div className="side-strip__header">
      
        <div className="side-strip__titles">
          <div className="side-strip__title-row">
            <div className="side-strip__title2">Donkey</div>
            <div className="side-strip__glyph side-strip__glyph--sm side-strip__glyph--grow">
              +
            </div>
            <div>+</div>
            <div>+</div>
          </div>
          <div className="side-strip__title-row">
            <div className="side-strip__title">Basketball</div>
          </div>
          <div className="side-strip__glyph side-strip__glyph--sm">+</div>
          <div className="side-strip__glyph side-strip__glyph--xs">+</div>
        </div>

      </div>
        <div className="side-strip__score side-strip__marg">
          <div className="side-strip__score-dots">
            <div>+</div>
            <div>+</div>
          </div>
          <div className="side-strip__spacer"/>
          <div className="side-strip__score-value">0</div>
          <div className="side-strip__score-plus">+</div>
          <div className="side-strip__score-dots">
            {`  -   `}
        </div>
        </div>
        <div className="side-strip__spacer side-strip__marg"/>


      <div className="side-strip__footer">
        <div className="side-strip__nav-row">
        <div className="side-strip__spacer"/>

          <div>+</div>
          <div className="side-strip__index">01</div>

          <div className="side-strip__nav-links">
            <Link href="/" className="side-strip__nav-link">
              Home
            </Link>
            <Link href="/music" className="side-strip__nav-link side-strip__nav-link--grow">
              Music
            </Link>
            <Link href="/about" className="side-strip__nav-link">
              About
            </Link>
          </div>

        </div>

        <form className="side-strip__form">
          <input
            type="text"
            placeholder="name"
            className="side-strip__input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="email"
            className="side-strip__input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className="side-strip__submit">
            {`[db]`}
          </button>
        </form>


        
      </div>

      <div className="side-strip__corners side-strip__corners--bottom">
        <div className="side-strip__corner side-strip__corner--bl" />
        <div className="side-strip__corner side-strip__corner--br" />
      </div>
    </div>
  );
}