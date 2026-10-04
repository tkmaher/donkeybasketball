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
        {cursor == 'donut' && 
          <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 -960 960 960"  className="donut">
            <path d="M441-82Q287-97 184-211T81-480q0-155 103-269t257-129v120q-104 14-172 93t-68 185q0 106 68 185t172 93v120Zm80 0v-120q94-12 159-78t79-160h120q-14 143-114.5 243.5T521-82Zm238-438q-14-94-79-160t-159-78v-120q143 14 243.5 114.5T879-520H759Z"/>
            </svg>        
          }
        {cursor == 'text' &&
          <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 -960 960 960" ><path d="M440-120v-80h80v80h-80Zm0-640v-80h80v80h-80Zm160 640v-80h80v80h-80Zm0-640v-80h80v80h-80Zm160 640v-80h80v80h-80Zm0-160v-80h80v80h-80Zm0-160v-80h80v80h-80Zm0-160v-80h80v80h-80Zm0-160v-80h80v80h-80ZM120-120v-80h80v-560h-80v-80h240v80h-80v560h80v80H120Z"/></svg>
        }
        {cursor == 'play' &&
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" ><path d="M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134v268Z"/></svg>
        }
        {cursor == 'pause' &&
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" ><path d="M520-200v-560h240v560H520Zm-320 0v-560h240v560H200Zm400-80h80v-400h-80v400Zm-320 0h80v-400h-80v400Zm0-400v400-400Zm320 0v400-400Z"/></svg>
        }
      </div>
    );
}