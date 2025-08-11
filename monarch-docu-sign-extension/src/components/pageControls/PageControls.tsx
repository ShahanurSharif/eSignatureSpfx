import * as React from "react";

const PageControls = ({
  current,
  total,
  onNext,
  onPrev,
}: {
  current: number;
  total: number;
  onNext: () => void;
  onPrev: () => void;
}) => {
  return (
    <div
      style={{
        margin: "10px 0",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <button onClick={onPrev} disabled={current === 1}>
        Previous
      </button>
      <span>
        Page {current} / {total}
      </span>
      <button onClick={onNext} disabled={current === total}>
        Next
      </button>
    </div>
  );
};

export default PageControls;
