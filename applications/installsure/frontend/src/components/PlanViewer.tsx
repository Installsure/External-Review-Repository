import React from "react";

type Props = { src: string; onClickTag: (pt:{x:number;y:number})=>void };

export default function PlanViewer({ src, onClickTag }: Props){
  const ref = React.useRef<HTMLDivElement>(null);
  
  function handleClick(e: React.MouseEvent){
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    onClickTag({x,y});
  }
  
  return (
    <div 
      id="plan-viewer"
      ref={ref} 
      onClick={handleClick} 
      style={{width:"100%", height:"100%", position:"relative"}}
    >
      <img 
        src={src} 
        alt="plan" 
        style={{objectFit:"contain", width:"100%", height:"100%"}}
      />
    </div>
  );
}
