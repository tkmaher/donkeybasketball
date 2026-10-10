"use client";

import { useContext, MouseEvent, useState, useEffect, useRef } from "react";
import { CursorContext } from "./cursorcontext";
import { isInteractive } from "./cursor_changer";
import ReactLenis from "lenis/react";

interface AudioBlock {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
}

function formatTime(totalSeconds: number): string {
  if (!isFinite(totalSeconds)) totalSeconds = 0;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

/** Shared play/pause icon, used by both the list items and the bottom player. */
function PlayButton({ isPlaying, onClick }: { isPlaying: boolean; onClick: () => void }) {
  const { cursorSetter } = useContext(CursorContext);
  const [hovered, setHovered] = useState(false);

  // Keep the custom cursor in sync if play state changes while hovering
  useEffect(() => {
    if (hovered) cursorSetter(isPlaying ? "pause" : "play");
  }, [isPlaying, hovered]);

  return (
    <svg
      className={`play-button ${isPlaying ? "pause selected" : "play"}`}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onMouseEnter={(e) => {
        e.stopPropagation();
        setHovered(true);
        cursorSetter(isPlaying ? "pause" : "play");
      }}
      onMouseLeave={(e) => {
        e.stopPropagation();
        setHovered(false);
        cursorSetter("plus");
      }}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
    >
      <path d="M287-167q-47-47-47-113t47-113q47-47 113-47 23 0 42.5 5.5T480-418v-422h240v160H560v400q0 66-47 113t-113 47q-66 0-113-47Z" />
    </svg>
  );
}

/** Bottom player: purely presentational, driven by props from SideStrip. */
function AudioPlayer({
  block,
  isPlaying,
  currentTime,
  duration,
  onToggle,
  onSeek,
}: {
  block: AudioBlock | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onToggle: () => void;
  onSeek: (time: number) => void;
}) {
  const { cursorSetter } = useContext(CursorContext);

  const handleMouseOver = (e: MouseEvent<HTMLDivElement>) => {
    cursorSetter(isInteractive(e.target) ?? "plus");
  };

  const percent = duration > 0 ? (100 * currentTime) / duration : 0;

  if (block) return (
    <div
      className="side-strip side-strip-music"
      onMouseOver={handleMouseOver}
      onMouseLeave={() => cursorSetter("plus")}
      style={{flexGrow: 0}}
    >
      <div className="side-strip__corners side-strip__corners--top">
        <div className="side-strip__corner side-strip__corner--tl" />
        <div className="side-strip__corner side-strip__corner--tr" />
      </div>
      
      <div className="audio-info-col side-strip__full">
        <div className="audio-block">
          <PlayButton isPlaying={isPlaying} onClick={onToggle} />
          <div className="audio-info-col">
            <div>{block.title}</div>
            <div className="desc">{block.description}</div>
          </div> 
        </div>

          <div className="audio-block">
            <div>
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
            <input
              type="range"
              min="0"
              max={duration || 0}
              step="any"
              value={currentTime}
              onChange={(e) => onSeek(parseFloat(e.target.value))}
              style={{
                background: `linear-gradient(
                  to right,
                  #2d2d2d 0%,
                  #2d2d2d ${percent}%,
                  #111111 ${percent}%,
                  #111111 100%
                )`,
              }}
            />
          </div>
      </div>

      <div className="side-strip__corners side-strip__corners--bottom">
        <div className="side-strip__corner side-strip__corner--bl" />
        <div className="side-strip__corner side-strip__corner--br" />
      </div>
    </div>
  );
}

/** One row in the list. Shows playing state only if it's the current track. */
function AudioBlockComponent({
  block,
  isCurrent,
  isPlaying,
  onToggle,
}: {
  block: AudioBlock;
  isCurrent: boolean;
  isPlaying: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="audio-info-col">
      <div className="audio-block">
        <PlayButton isPlaying={isCurrent && isPlaying} onClick={onToggle} />
        <div className="audio-info-col">
          <div>{block.title}</div>
          <div className="desc">{block.description}</div>
        </div>
      </div>
    </div>
  );
}

const ARENA_URL = "https://api.are.na/v3/channels/db-cms/contents";

export default function SideStrip() {
  const [audioBlocks, setAudioBlocks] = useState<AudioBlock[] | null>(null);
  const [currentBlock, setCurrentBlock] = useState<AudioBlock | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // The single source of truth for playback
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { cursorSetter } = useContext(CursorContext);

  useEffect(() => {
    const fetchAudioBlocks = async () => {
      try {
        const response = await fetch(ARENA_URL);
        if (!response.ok) throw new Error("Failed to fetch audio blocks");
        const data = await response.json();

        const blocks: AudioBlock[] = data.data
          .filter(
            (block: any) =>
              block.type === "Attachment" &&
              block.attachment?.content_type?.startsWith("audio/") &&
              block.attachment?.url
          )
          .map((block: any) => ({
            id: block.id,
            title: block.title ?? block.attachment.url,
            description: block.description?.markdown ?? "",
            audioUrl: block.attachment.url,
          }));

        setAudioBlocks(blocks);
      } catch (error) {
        console.error("Error fetching audio blocks:", error);
      }
    };

    fetchAudioBlocks();
  }, []);

  /** Play a given block, or toggle play/pause if it's already the current one. */
  const toggleBlock = (block: AudioBlock) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (currentBlock?.id === block.id) {
      if (audio.paused) audio.play();
      else audio.pause();
      return;
    }

    setCurrentBlock(block);
    setCurrentTime(0);
    setDuration(0);
    audio.src = block.audioUrl;
    audio.play().catch((err) => console.error("Playback failed:", err));
  };

  const toggleCurrent = () => {
    const audio = audioRef.current;
    if (!audio || !currentBlock) return;
    if (audio.paused) audio.play();
    else audio.pause();
  };

  const seek = (time: number) => {
    if (audioRef.current) audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const handleMouseOver = (e: MouseEvent<HTMLDivElement>) => {
    cursorSetter(isInteractive(e.target) ?? "plus");
  };

  return (
    <>
      <audio
        ref={audioRef}
        hidden
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
      />

    <div
      className="side-strip side-strip-music"
      onMouseOver={handleMouseOver}
      onMouseLeave={() => cursorSetter("plus")}
      style={{ 
        flexGrow: 1, 
        display: "flex", 
        flexDirection: "column", 
        minHeight: 0, 
        overflow: "hidden",
        opacity: audioBlocks ? 1 : 0, transition: "opacity 0.5s" 
      }}
    >
      <div className="side-strip__corners side-strip__corners--top">
        <div className="side-strip__corner side-strip__corner--tl" />
        <div className="side-strip__corner side-strip__corner--tr" />
      </div>

      <ReactLenis 
        className="side-strip__scroll" 
        options={{ 
          orientation: "vertical", 
          gestureOrientation: "vertical", 
          lerp: 0.9
        }}
      >
        <div className="side-strip__full">
          {audioBlocks?.map((block) => (
            <AudioBlockComponent
              key={block.id}
              block={block}
              isCurrent={currentBlock?.id === block.id}
              isPlaying={isPlaying}
              onToggle={() => toggleBlock(block)}
            />
          ))}
        </div>
      </ReactLenis>

      <div className="side-strip__corners side-strip__corners--bottom">
        <div className="side-strip__corner side-strip__corner--bl" />
        <div className="side-strip__corner side-strip__corner--br" />
      </div>
    </div>

      <AudioPlayer
        block={currentBlock}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        onToggle={toggleCurrent}
        onSeek={seek}
      />
    </>
  );
}