"use client";
import { createContext, useContext, useState } from 'react';

type CursorType = "plus" | "expand" | "collapse" | "donut" | "text";

export const CursorContext = createContext({
    cursor: 'plus',
    cursorSetter: (s: CursorType) => {}
});


export function CursorProvider({children}: {children: React.ReactNode}) {
  const [cursor, setCursor] = useState<CursorType>('plus');

  const cursorSetter = (s: CursorType) => {
    setCursor(s);
  };

  // Provide the values to the rest of your app
  return (
    <CursorContext value={{ cursor, cursorSetter }}>
      {children}
    </CursorContext>
  );
}
