import React from "react";

function HelpPage({ visible = false }) {
  return <h1 className={`h-[100dvh] ${visible ? "" : "hidden"}`}>Help</h1>;
}

export default HelpPage;
