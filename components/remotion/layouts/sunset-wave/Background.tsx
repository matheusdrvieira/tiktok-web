import { AbsoluteFill } from "remotion";

export const Background = () => {
  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, #d9eb36 0%, #d2e42f 42%, #c5da1f 100%)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          width: 54,
          background: "linear-gradient(180deg, #6d28d9 0%, #5b21b6 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          right: 0,
          width: 54,
          background: "linear-gradient(180deg, #6d28d9 0%, #5b21b6 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: "20% -20% -25% -15%",
          transform: "rotate(-12deg)",
          background:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.11) 0 74px, rgba(255,255,255,0) 74px 170px)",
          opacity: 0.35,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: -260,
          left: 160,
          width: 980,
          height: 760,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.52) 0%, rgba(255,255,255,0.14) 46%, rgba(255,255,255,0) 74%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 16,
          top: "54%",
          transform: "rotate(-90deg)",
          transformOrigin: "left top",
          color: "rgba(255,255,255,0.45)",
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: 1,
          textTransform: "lowercase",
        }}
      >
        quizzio
      </div>
    </AbsoluteFill>
  );
};

export default Background;
