"use client";

import { useState } from "react";

export default function MusicStrip() {
    const [collapsed, setCollapsed] = useState(false);
  
    return (
      <div className={`side-strip${collapsed ? " side-strip--collapsed" : ""}`}>
        <div className="side-strip__corners side-strip__corners--top">
          <div className="side-strip__corner side-strip__corner--tl" />
          <div className="side-strip__corner side-strip__corner--tr" />
        </div>
  
        <div className="side-strip__header">
          <div className="side-strip__titles">
            <div className="side-strip__title-row">
              <div className="side-strip__title">Music</div>

            </div>
            
          </div>
  
        </div>
          <div className="side-strip__spacer side-strip__marg"/>
        <div className="side-strip__footer">
          <button
            type="button"
            className="side-strip__collapse-toggle"
            onClick={() => setCollapsed((c) => !c)}
            aria-expanded={!collapsed}
            aria-label={collapsed ? "Expand strip" : "Collapse strip"}
          >
            {collapsed ? "Expand" : "Collapse"}
          </button>
        </div>
  
        <div className="side-strip__corners side-strip__corners--bottom">
          <div className="side-strip__corner side-strip__corner--bl" />
          <div className="side-strip__corner side-strip__corner--br" />
        </div>
      </div>
    );
  }