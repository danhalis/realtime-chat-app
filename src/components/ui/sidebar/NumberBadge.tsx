import React from "react";

function NumberBadge({ number = 0 }: { number?: number }) {
  return (
    <>{number > 0 ? <span className="number-badge">{number}</span> : null}</>
  );
}

export default NumberBadge;
