"use client";

import { useContext, MouseEvent, useState, useEffect, useRef, use } from "react";
import { CursorContext } from "./cursorcontext";
import { isInteractive } from "./cursor_changer";

interface AudioBlock {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
}

function AudioBlockComponent({ block }: { block: AudioBlock }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);
  const audioElement = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);

  const { cursorSetter } = useContext(CursorContext);

  const handleTimeUpdate = () => {
    if (audioElement.current) {
      setCurrentTime(audioElement.current.currentTime);
    }
  };

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (audioElement.current) {
      if (isPlaying) {
        audioElement.current.pause();
      } else {
        audioElement.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }

  useEffect(() => {
    if (hovered)
      cursorSetter(isPlaying ? 'pause' : 'play');
  }, [isPlaying]);

  function formatTime(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
  
    const paddedMinutes = minutes.toString().padStart(2, '0');
    const paddedSeconds = Math.floor(seconds).toString().padStart(2, '0');
  
    return `${paddedMinutes}:${paddedSeconds}`;
  }


  return (
    <div className="audio-info-col">
      <div className="audio-block">
        <audio 
          controls 
          src={block.audioUrl} 
          hidden 
          ref={audioElement} 
          onEnded={() => setIsPlaying(false)}
          onTimeUpdate={handleTimeUpdate}
        >
          Your browser does not support the audio element.
        </audio>
        <svg 
          className={`play-button ${isPlaying ? 'pause' : 'play'}`} 
          onClick={(e: any) => handleClick(e)}
          onMouseEnter={(e: any) => {
            e.stopPropagation();
            setHovered(true);
            cursorSetter(isPlaying ? 'pause' : 'play');
          }}
          onMouseLeave={(e: any) => {
            e.stopPropagation();
            setHovered(false);
            cursorSetter('plus');
          }}
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 -960 960 960"
        >
          <path d="M287-167q-47-47-47-113t47-113q47-47 113-47 23 0 42.5 5.5T480-418v-422h240v160H560v400q0 66-47 113t-113 47q-66 0-113-47Z"
        /></svg>
        <div className="audio-info-col">
          <div>{block.title}</div>
          <div className="desc">{block.description}</div>        
        </div>
      </div>
      {audioElement.current && <div className="audio-block">
        <div>
          {formatTime(currentTime)} / {formatTime(audioElement.current.duration || 0)}
        </div>
        <input 
          type="range" 
          min="0" 
          max={audioElement.current.duration || 0} 
          value={currentTime} 
          onChange={(e) => {
            const newTime = parseFloat(e.target.value);
            if (audioElement.current) {
              audioElement.current.currentTime = newTime;
            }
          }} 
          style={{
            background: `
              linear-gradient(
                to right, 
                #2d2d2d 0%, 
                #2d2d2d ${100 * currentTime / audioElement.current.duration}%, 
                #111111 ${100 * currentTime / audioElement.current.duration}%, #111111 100%
              )
            `
          }}
        />
        {/* <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={volume} 
          onChange={(e) => {
            const newVolume = parseFloat(e.target.value);
            setVolume(newVolume);
            if (audioElement.current) {
              audioElement.current.volume = newVolume;
            }
          }} 
        /> */}
      </div>}
    </div>
  );
}

const ARENA_URL = 'https://api.are.na/v3/channels/db-cms/contents';

export default function SideStrip() {

  const [audioBlocks, setAudioBlocks] = useState<null | AudioBlock[]>(null);

  useEffect(() => {
    const fetchAudioBlocks = async () => {
      try {
        const response = await fetch(ARENA_URL);
        if (!response.ok) {
          throw new Error('Failed to fetch audio blocks');
        }
        const data = await response.json();
        setAudioBlocks(data.data.map((block: any) => {
          console.log('Block:', block);
          if (block.type != 'Attachment') return null;
          if (block.attachment.content_type?.startsWith('audio/') === false) return null;
          return {
            id: block.id,
            title: block.title,
            description: block.description?.markdown ?? "",
            audioUrl: block.attachment?.url || '',
          }
        }));
      } catch (error) {
        console.error('Error fetching audio blocks:', error);
      }
    };

    fetchAudioBlocks();
  }, []);

  const { cursorSetter } = useContext(CursorContext);

  const handleMouseOver = (e: MouseEvent<HTMLDivElement>) => {
    cursorSetter(isInteractive(e.target) ?? 'plus');
  };

  return (
    <div
      className={`side-strip side-strip-music`}
      onMouseOver={handleMouseOver}
      onMouseLeave={() => cursorSetter("plus")}
    >
      <div className="side-strip__corners side-strip__corners--top">
        <div className="side-strip__corner side-strip__corner--tl" />
        <div className="side-strip__corner side-strip__corner--tr" />
      </div>

      <div className="side-strip__full">
        {audioBlocks?.map((block) => block && 
          <AudioBlockComponent key={block.id} block={block} />
        )}
      </div>
        

      <div className="side-strip__corners side-strip__corners--bottom">
        <div className="side-strip__corner side-strip__corner--bl" />
        <div className="side-strip__corner side-strip__corner--br" />
      </div>
    </div>
  );
}