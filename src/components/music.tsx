"use client";

import ReactLenis from "lenis/react";
import Link from "next/link";
import { useEffect, useState, type ReactNode, useContext, MouseEvent } from "react";
import { CursorContext } from "./cursorcontext";

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
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);

  const { cursorSetter } = useContext(CursorContext);

  // Cursor label for a non-interactive hover, given the current state
  const toggleCursor = (isCollapsed: boolean) =>
    isCollapsed ? "expand" : "collapse";

  // mouseover bubbles, so this fires as the pointer moves between children
  const handleMouseOver = (e: MouseEvent<HTMLDivElement>) => {
    cursorSetter(isInteractive(e.target) ?? toggleCursor(collapsed));
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
          <div className="side-strip__title">Basketball</div>
          <div className="side-strip__marg-2">
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
            <div className="side-strip__spacer-right"/>
          </div>
          <div className="side-strip__glyph side-strip__glyph--sm">+</div>
          <div className="side-strip__glyph side-strip__glyph--xs">+</div>
        </div>
        

      </div>
        <div className="side-strip__score side-strip__marg-3">
          <div className="side-strip__score-dots">
            <button onClick={() => setCount1(count => count * -1)}>¬</button>
            <button onClick={() => setCount1(count => count * 2)}>*</button>
            <button onClick={() => setCount1(count => count / 2)}>/</button>
          </div>
          <div className="side-strip__spacer"/>
          <div className="side-strip__score-value">{count1.toString().padStart(3, '0')}</div>
          <button className="side-strip__score-plus" onClick={() => setCount1(count => count + 1)}>+</button>
          <button className="side-strip__score-dots" onClick={() => setCount1(count => count - 1)}>
            {`  -   `}
          </button>
        </div>
        <div className="side-strip__spacer-right side-strip__marg-3"/>
        <div className="side-strip__nav-row side-strip__marg-2">
          <div className="side-strip__spacer"/>

            <button onClick={() => setCount2(count => count + 1)}>+</button>
            <div className="side-strip__score-value">{count2}</div>
          </div>


      <div className="side-strip__footer">
        
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