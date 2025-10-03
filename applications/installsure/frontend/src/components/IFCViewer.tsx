import React, { useEffect, useRef } from "react";

export default function IFCViewer({ src }: {src: string}){
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(()=>{
    // Lazy load IFC.js and mount basic viewer
    // This is a placeholder implementation for the demo
    // In production, this would use web-ifc-three or similar library
    (async ()=>{
      try {
        // For now, just show a placeholder
        if (ref.current) {
          ref.current.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #f3f4f6; border: 2px dashed #d1d5db; border-radius: 8px;">
              <div style="text-align: center; color: #6b7280;">
                <div style="font-size: 48px; margin-bottom: 16px;">🏗️</div>
                <p style="font-size: 14px; font-weight: 500;">IFC Viewer (Demo Mode)</p>
                <p style="font-size: 12px; margin-top: 8px;">Source: ${src}</p>
                <p style="font-size: 12px; color: #9ca3af; margin-top: 4px;">Full IFC.js integration available in production</p>
              </div>
            </div>
          `;
        }
      } catch (err) {
        console.error("Failed to initialize IFC viewer:", err);
      }
    })().catch(()=>{});
  },[src]);
  
  return <div ref={ref} style={{width:"100%", height:"100%"}}/>;
}
