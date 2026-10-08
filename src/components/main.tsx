"use client";
import { Cursor } from "./cursor";
import { CursorProvider } from "./cursorcontext";
import SiteLayout from "./sitelayout";

 

export default function Main({children}: {children: React.ReactNode}) {
    return (
        <CursorProvider>
            <Cursor/>
            <SiteLayout children={children}/>
        </CursorProvider>
    )
}