"use client";

import ReactLenis from "lenis/react";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";

/**
 * The custom "+" cursor. Mount this once (via <SideStripRow>, or on its own)
 * rather than inside every <SideStrip> — otherwise N strips means N
 * mousemove listeners and N overlapping cursors.
 */
export function Cursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setPos({ x: event.clientX, y: event.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="mouse-circle" style={{ left: pos.x, top: pos.y }}>
      +
    </div>
  );
}

/**
 * Lays out any number of <SideStrip>s in a row that scrolls horizontally
 * once it overflows, and mounts the shared cursor once for all of them.
 */
export function SideStripRow({ children }: { children: ReactNode }) {
  return (
    <div className="side-strip-row">
      <Cursor />
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

export default function SideStrip() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`side-strip${collapsed ? " side-strip--collapsed" : ""}`}>
      <div className="side-strip__corners side-strip__corners--top">
        <div className="side-strip__corner side-strip__corner--tl" />
        <div className="side-strip__corner side-strip__corner--tr" />
      </div>

      <div className="side-strip__header">
      <button
          type="button"
          className="side-strip__collapse-toggle"
          onClick={() => setCollapsed((c) => !c)}
          aria-expanded={!collapsed}
          aria-label={collapsed ? "Expand strip" : "Collapse strip"}
        >
          {collapsed ? "Expand" : "Collapse"}
        </button>
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