"use client";

import {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
  MouseEvent,
  KeyboardEvent,
} from "react";
import { CursorContext } from "./cursorcontext";
import { isInteractive } from "./cursor_changer";
import ReactLenis from "lenis/react";
import Image from "next/image";

interface ShowBlock {
  id: string;
  title: string;
  description: string;
  imageUrlSm: string;
  imageUrlLg: string;
  ratio?: number;
}

const ARENA_URL = "https://api.are.na/v3/channels/db-shows/contents";

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
  onSelect
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
          {block.description && <button className="show-card__desc" data-lenis-prevent>
            {block.description}
          </button>}
          <div className="inspector" data-lenis-prevent onClick={(e: any) => {
            e.preventDefault();
            onSelect();
          }}>
            Inspect
          </div>
          <Corners />
        </div>
      </div>
    </div>
  );
}

export default function ShowGrid() {
  const [showBlocks, setShowBlocks] = useState<ShowBlock[] | null>(null);
  // Ratios discovered on image load, for blocks the API gave no dimensions for.
  const [measured, setMeasured] = useState<Record<string, number>>({});
  const { ref, columns } = useColumnCount<HTMLDivElement>();
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
            return {
              id: String(block.id),
              title: block.title ?? block.image.filename,
              description: block.description?.markdown ?? "",
              imageUrlSm: block.image.small.src,
              imageUrlLg: block.image.large.src,
              ratio: w && h ? w / h : undefined,
            };
          });

        setShowBlocks(blocks);
      } catch (error) {
        console.error("Error fetching show blocks:", error);
      }
    };

    fetchShowBlocks();
  }, []);

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
  // Column "height" per card is proportional to 1 / ratio (width is equal).
  const columnsData = useMemo(() => {
    const cols: ShowBlock[][] = Array.from({ length: columns }, () => []);
    const heights = new Array(columns).fill(0);
    for (const block of showBlocks ?? []) {
      let target = 0;
      for (let i = 1; i < columns; i++) {
        if (heights[i] < heights[target] - 0.0001) target = i;
      }
      cols[target].push(block);
      heights[target] += 1 / ratioOf(block);
    }
    return cols;
    // ratioOf changes whenever a new ratio is measured
  }, [showBlocks, columns, ratioOf]);



  return (
    <>
      <ReactLenis
        className="side-strip__scroll"
        options={{
          orientation: "vertical",
          gestureOrientation: "vertical",
          lerp: 0.9,
        }}
      >
        <div
          ref={ref}
          className="show-grid"

        >
          {columnsData.map((col, i) => (
            <div className="show-grid__col" key={i}>
              {col.map((block) => (
                <ShowCard
                  key={block.id}
                  block={block}
                  ratio={ratioOf(block)}
                  onRatio={handleRatio}
                  onSelect={() => setSelectedImg(block.imageUrlLg)}
                />
              ))}
            </div>
          ))}
        </div>
      </ReactLenis>
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
        {selectedImg && 
          <img 
            src={selectedImg} 
            alt={selectedImg}
            onLoad={() => setSelectedImgLoaded(true)}
            style={{ 
              opacity: selectedImgLoaded ? 1 : 0,
              marginTop: selectedImgLoaded ? 0 : "20px",
            }}
          />
        }
      </div>
    </>
  );
}