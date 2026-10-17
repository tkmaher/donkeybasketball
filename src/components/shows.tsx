"use client";

import {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
  MouseEvent,
} from "react";
import { CursorContext } from "./cursorcontext";
import { isInteractive } from "./cursor_changer";
import ReactLenis from "lenis/react";
import Image from "next/image";
import { useIsMobile } from "./isMobile";

interface ShowBlock {
  id: string;
  title: string;
  description: string; // still stored, no longer displayed
  date: string | null; // YYYY-MM-DD parsed from the description
  imageUrlSm: string;
  imageUrlLg: string;
  ratio?: number;
}

const ARENA_URL = "https://api.are.na/v3/channels/db-shows/contents";
const DATE_RE = /\d{4}-\d{2}-\d{2}/;

const BREAKPOINTS: { minWidth: number; columns: number }[] = [
  { minWidth: 1500, columns: 6 },
  { minWidth: 1100, columns: 5 },
  { minWidth: 800, columns: 4 },
  { minWidth: 500, columns: 3 },
  { minWidth: 0, columns: 2 },
];

function columnsForWidth(width: number) {
  return BREAKPOINTS.find((b) => width >= b.minWidth)!.columns;
}

// Today as YYYY-MM-DD in the viewer's local time, so it can be compared
// to the show dates with plain string comparison.
function todayString() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function useColumnCount<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [columns, setColumns] = useState(3);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setColumns(columnsForWidth(el.clientWidth));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return { ref, columns };
}

function Corners() {
  return (
    <>
      <span className="show-card__corner show-card__corner--tl" />
      <span className="show-card__corner show-card__corner--tr" />
      <span className="show-card__corner show-card__corner--bl" />
      <span className="show-card__corner show-card__corner--br" />
    </>
  );
}

function ShowCard({
  block,
  ratio,
  onRatio,
  onSelect,
}: {
  block: ShowBlock;
  ratio: number;
  onRatio: (id: string, ratio: number) => void;
  onSelect: () => void;
}) {
  const [flipped, setFlipped] = useState(false);
  const toggle = () => {
    setFlipped((f) => !f);
  };
  const [loaded, setLoaded] = useState(false);

  const { cursorSetter } = useContext(CursorContext);

  const handleMouseOver = (e: MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains("inspector")) {
      cursorSetter("expand");
      return;
    }
    cursorSetter(isInteractive(e.target) ?? "donut");
  };

  return (
    <div
      className={`show-card${flipped ? " show-card--flipped" : ""}`}
      style={{ aspectRatio: ratio, opacity: loaded ? 1 : 0, transition: "opacity 0.5s" }}
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      aria-label={`${block.title} — ${flipped ? "show image" : "show info"}`}
      onClick={toggle}
      onMouseLeave={() => cursorSetter("plus")}
      onMouseOver={(e: any) => handleMouseOver(e)}
    >
      <div className="show-card__inner">
        <button className="show-card__face show-card__face--front" aria-hidden={flipped}>
          <Image
            src={block.imageUrlLg}
            alt={block.title}
            fill
            sizes="(max-width: 500px) 50vw, (max-width: 800px) 33vw, (max-width: 1100px) 25vw, (max-width: 1500px) 20vw, 17vw"
            style={{ objectFit: "cover" }}
            onLoad={(e) => {
              const img = e.currentTarget;
              setLoaded(true);
              if (img.naturalWidth && img.naturalHeight) {
                onRatio(block.id, img.naturalWidth / img.naturalHeight);
              }
            }}
          />
          <Corners />
        </button>

        <div className="show-card__face show-card__face--back" aria-hidden={!flipped}>
          <button className="show-card__title">{block.title}</button>
          <button className="show-card__desc">{block.description}</button>
          <div
            className="inspector"
            data-lenis-prevent
            onClick={(e: any) => {
              e.preventDefault();
              onSelect();
            }}
          >
            Inspect
          </div>
          <Corners />
        </div>
      </div>
    </div>
  );
}

// A single masonry grid. Receives its blocks as a prop so it can be
// instantiated once for upcoming shows and once for past shows.
function ShowGrid({
  blocks,
  onSelect,
}: {
  blocks: ShowBlock[];
  onSelect: (url: string) => void;
}) {
  // Ratios discovered on image load, for blocks the API gave no dimensions for.
  const [measured, setMeasured] = useState<Record<string, number>>({});
  const { ref, columns } = useColumnCount<HTMLDivElement>();

  const handleRatio = useCallback((id: string, ratio: number) => {
    setMeasured((prev) =>
      Math.abs((prev[id] ?? 0) - ratio) < 0.001 ? prev : { ...prev, [id]: ratio }
    );
  }, []);

  const ratioOf = useCallback(
    (b: ShowBlock) => b.ratio ?? measured[b.id] ?? 1,
    [measured]
  );

  // Masonry: place each card in the currently-shortest column, so the
  // reading order stays roughly left→right and columns end up balanced.
  const columnsData = useMemo(() => {
    const cols: ShowBlock[][] = Array.from({ length: columns }, () => []);
    const heights = new Array(columns).fill(0);
    for (const block of blocks) {
      let target = 0;
      for (let i = 1; i < columns; i++) {
        if (heights[i] < heights[target] - 0.0001) target = i;
      }
      cols[target].push(block);
      heights[target] += 1 / ratioOf(block);
    }
    return cols;
  }, [blocks, columns, ratioOf]);

  return (
    <div ref={ref} className="show-grid">
      {columnsData.map((col, i) => (
        <div className="show-grid__col" key={i}>
          {col.map((block) => (
            <ShowCard
              key={block.id}
              block={block}
              ratio={ratioOf(block)}
              onRatio={handleRatio}
              onSelect={() => onSelect(block.imageUrlLg)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}



export default function Shows() {
  const [showBlocks, setShowBlocks] = useState<ShowBlock[] | null>(null);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [selectedImgLoaded, setSelectedImgLoaded] = useState(false);

  useEffect(() => {
    const fetchShowBlocks = async () => {
      try {
        const response = await fetch(ARENA_URL);
        if (!response.ok) throw new Error("Failed to fetch show blocks");
        const data = await response.json();

        const blocks: ShowBlock[] = data.data
          .filter((block: any) => block.type === "Image" && block.image)
          .map((block: any) => {
            const w = block.image.width ?? block.image.large?.width;
            const h = block.image.height ?? block.image.large?.height;
            const description: string = block.description?.markdown ?? "";
            return {
              id: String(block.id),
              title: block.title ?? block.image.filename,
              description,
              date: description.match(DATE_RE)?.[0] ?? null,
              imageUrlSm: block.image.small.src,
              imageUrlLg: block.image.large.src,
              ratio: w && h ? w / h : undefined,
            };
          });
        console.log("fetched blocks:", blocks);
        setShowBlocks(blocks);
      } catch (error) {
        console.error("Error fetching show blocks:", error);
      }
    };

    fetchShowBlocks();
  }, []);

  // Upcoming: today or later, soonest first.
  // Past: before today (or undated), most recent first.
  const { upcoming, past } = useMemo(() => {
    const today = todayString();
    const up: ShowBlock[] = [];
    const pa: ShowBlock[] = [];
    for (const b of showBlocks ?? []) {
      if (b.date && b.date >= today) up.push(b);
      else pa.push(b);
    }
    up.sort((a, b) => a.date!.localeCompare(b.date!));
    pa.sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
    console.log("upcoming:", up, "past:", pa);
    return { upcoming: up, past: pa };
  }, [showBlocks]);

  const select = useCallback((url: string) => setSelectedImg(url), []);

  const isMobile = useIsMobile();

  return (
    <>
      {isMobile ? 
        <div>
          {upcoming.length > 0 && (
            <section className="show-section">
              <div className="show-card show-card__section-title">
                <Corners />
                <div>
                  Upcoming
                </div>
              </div>
              <ShowGrid blocks={upcoming} onSelect={select} />
            </section>
            
          )}
          {past.length > 0 && upcoming.length > 0 && <br/>}
          {past.length > 0 && (
            <section className="show-section">
              <div className="show-card show-card__section-title" >
                <Corners />
                <div>
                  Past
                </div>
              </div>
              <ShowGrid blocks={past} onSelect={select} />
            </section>
          )}
        </div> :
        <ReactLenis
          className="side-strip__scroll"
          options={{
            orientation: "vertical",
            gestureOrientation: "vertical",
            lerp: 0.9,
          }}
          style={{
            opacity: showBlocks ? 1 : 0,
          }}
        >
          <div>
            {upcoming.length > 0 && (
              <section className="show-section">
                <div className="show-card show-card__section-title">
                  <Corners />
                  <div>
                    Upcoming
                  </div>
                </div>
                <ShowGrid blocks={upcoming} onSelect={select} />
              </section>
              
            )}
            {past.length > 0 && upcoming.length > 0 && <br/>}
            {past.length > 0 && (
              <section className="show-section">
                <div className="show-card show-card__section-title" >
                  <Corners />
                  <div>
                    Past
                  </div>
                </div>
                <ShowGrid blocks={past} onSelect={select} />
              </section>
            )}
          </div>
        </ReactLenis>
      }
      <div
        className="image-display"
        style={{
          opacity: selectedImg ? 1 : 0,
          pointerEvents: selectedImg ? "auto" : "none",
        }}
        onClick={() => {
          setSelectedImg(null);
          setSelectedImgLoaded(false);
        }}
      >
        {selectedImg && (
          <img
            src={selectedImg}
            alt={selectedImg}
            onLoad={() => setSelectedImgLoaded(true)}
            style={{
              opacity: selectedImgLoaded ? 1 : 0,
              marginTop: selectedImgLoaded ? 0 : "20px",
            }}
          />
        )}
      </div>
    </>
  );
}
