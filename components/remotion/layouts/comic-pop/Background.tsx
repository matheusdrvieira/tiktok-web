import { AbsoluteFill, Img, staticFile } from "remotion";

export const Background = () => {
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #12243f 0%, #0b1f36 100%)" }}>
      <Img
        src={staticFile("background.png")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      <AbsoluteFill
        style={{
          background: "linear-gradient(180deg, rgba(15, 23, 42, 0.22) 0%, rgba(15, 23, 42, 0.34) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

export default Background;
