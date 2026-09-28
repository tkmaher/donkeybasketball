"use client";

import { useContext, useEffect, useState } from "react";
import { CursorContext } from "./cursorcontext";

export function Cursor() {
    const { cursor } = useContext(CursorContext);
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
        {cursor == 'plus' &&
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
        }
        {cursor == 'expand' && 
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" >
                <path d="M200-200v-240h80v160h160v80H200Zm480-320v-160H520v-80h240v240h-80Z"/>
            </svg>
        }
        {cursor == 'collapse' && 
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"  >
                <path d="M440-440v240h-80v-160H200v-80h240Zm160-320v160h160v80H520v-240h80Z"/>
            </svg>
        }
      </div>
    );
}