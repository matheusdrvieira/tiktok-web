import { AbsoluteFill } from "remotion";

export const Background = () => {
  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #efe3a7 0%, #e8db94 52%, #dfcf80 100%)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 26,
          background: "linear-gradient(180deg, #0e7490 0%, #155e75 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 26,
          background: "linear-gradient(180deg, #0e7490 0%, #155e75 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "repeating-conic-gradient(from 185deg at 50% 120%, rgba(255,255,255,0.24) 0deg 14deg, rgba(255,255,255,0) 14deg 28deg)",
          opacity: 0.45,
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.26) 0%, rgba(255,255,255,0) 24%)",
        }}
      />
    </AbsoluteFill>
  );
};

export default Background;
