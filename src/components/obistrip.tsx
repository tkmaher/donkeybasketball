"use client";
import Link from "next/link";
import { useState, useContext, MouseEvent, useEffect } from "react";
import { CursorContext } from "./cursorcontext";
import { isInteractive } from "./cursor_changer";
import { usePathname } from "next/navigation";

export default function SideStrip() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);

  const { cursorSetter } = useContext(CursorContext);

  const toggleCursor = (isCollapsed: boolean) =>
    isCollapsed ? "expand" : "collapse";

  const handleMouseOver = (e: MouseEvent<HTMLDivElement>) => {
    cursorSetter(isInteractive(e.target) ?? toggleCursor(collapsed));
  };

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if (isInteractive(e.target)) return;
    setCollapsed(!collapsed);
    cursorSetter(toggleCursor(!collapsed)); // label for the *new* state
  };

  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    if (isHome) {
      setCollapsed(false);
    } else {
      setCollapsed(true);
    }
  }, [pathname]);

  return (
    <div
      className={`side-strip${
        ((isHome && !collapsed) || (!collapsed)) ? " side-strip--home" : ""
      } side-strip-menu`}
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
            <div>+</div>
            <div className="side-strip__title1">Donkey Basketball</div>
            <div className="side-strip__glyph side-strip__glyph--sm side-strip__glyph--grow">
              +
            </div>
            <div style={{flexGrow: 1}}>+</div>
          </div>
          <div className="side-strip__title-row">
            <div className="side-strip__spacer-right"></div>
            <div className="side-strip__spacer-left"></div>
            <div className="side-strip__spacer"></div>
          </div>
          <div className="side-strip__marg-2">
          <div className="side-strip__spacer-left"/>
            <div className="side-strip__nav-links">
              <Link href="/about" className="side-strip__nav-link">
                About
              </Link>
              <Link href="/shows" className="side-strip__nav-link">
                Shows
              </Link>
              <Link href="/files" className="side-strip__nav-link">
                Files
              </Link>
              <a href="https://donkeybasketball.bandcamp.com/" target="_blank" className="side-strip__nav-link side-strip__nav-link--grow">
                Bandcamp
              </a>
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
          <i>
            <Link href="/sound-objects" className="side-strip__nav-link side-strip__nav-link--grow">
              Sound Objects
            </Link>
          </i>
        </div>
        <div className="side-strip__spacer-right side-strip__marg-3"/>

        <div className="side-strip__nav-row side-strip__marg-2">
          <a href="https://www.instagram.com/donkeybasketbal/" target="_blank" className="side-strip__nav-link">
            Instagram
          </a>
          <div className="side-strip__spacer"/>

          <button onClick={() => setCount2(count => count + 1)}>+</button>
          <div className="side-strip__score-value">{count2}</div>
          <div className="side-strip__nav-links">
            <a href="mailto:izzylowenstein@gmail.com" target="_blank" className="side-strip__nav-link">
              Contact
            </a>
            <Link href="/" className="side-strip__nav-link">
              Home
            </Link>
          </div>
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