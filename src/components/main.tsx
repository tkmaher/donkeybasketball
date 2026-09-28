"use client";
import { Cursor } from "./cursor";
import { CursorProvider } from "./cursorcontext";

 

export default function Main({children}: {children: React.ReactNode}) {
    return (
        <CursorProvider>
            <Cursor/>
            {children}
        </CursorProvider>
    )
}