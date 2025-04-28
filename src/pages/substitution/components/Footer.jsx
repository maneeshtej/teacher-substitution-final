import React from "react";
export function Footer({ handleCheckSubstitutions, handleDraft }) {
  return (
    <div
      className="h-[10dvh] w-[100%] flex justify-center items-center 
    bg-gradient-to-b from-[rgba(30,30,30,0)] via-[rgba(30,30,30,0.4)] to-[rgba(30,30,30,1)] gap-[10px]"
    >
      {/* Send button (functionality likely needs to be added to onClick) */}
      <span
        onClick={() => {
          handleDraft(); // Call handleCheckSubstitutions where appropriate
        }}
        className="bg-textc flex items-center justify-center text-backgroundc font-bold tracking-wide p-[min(3vw,20px)] rounded-md cursor-pointer h-[80%] "
      >
        Draft
      </span>
      <span
        onClick={() => {
          handleCheckSubstitutions(); // Call handleCheckSubstitutions where appropriate
        }}
        className="bg-textc flex items-center justify-center text-backgroundc font-bold tracking-wide p-[min(3vw,20px)] rounded-md cursor-pointer h-[80%] w-[min(60%,300px)]"
      >
        Send
      </span>
    </div>
  );
}
