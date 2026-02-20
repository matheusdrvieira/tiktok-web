import { comicFontFamily } from "../comic-font";

export const IntroContent = () => {
  return (
    <div style={{ position: "relative", paddingBottom: 26, fontFamily: comicFontFamily }}>
      <div
        style={{
          position: "relative",
          borderRadius: 34,
          border: "6px solid #0f172a",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(243,247,252,0.98) 100%)",
          boxShadow:
            "0 10px 0 rgba(15, 23, 42, 0.3), 0 16px 24px rgba(15, 23, 42, 0.24), inset 0 0 0 3px rgba(255,255,255,0.78)",
          padding: "34px 38px",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(rgba(15,23,42,0.08) 1.1px, transparent 1.1px)",
            backgroundSize: "12px 12px",
            opacity: 0.35,
          }}
        />
        <div
          style={{
            position: "relative",
            fontSize: 52,
            lineHeight: 1.2,
            color: "#0f172a",
            fontWeight: 800,
          }}
        >
          O quiz vai comecar.
        </div>
        <div
          style={{
            position: "relative",
            marginTop: 12,
            fontSize: 40,
            lineHeight: 1.2,
            color: "#334155",
            fontWeight: 600,
          }}
        >
          Escute a pergunta, responda no tempo e confira o resultado.
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 70,
          bottom: 0,
          width: 42,
          height: 42,
          backgroundColor: "rgba(248, 250, 252, 0.98)",
          borderLeft: "6px solid #0f172a",
          borderBottom: "6px solid #0f172a",
          borderBottomLeftRadius: 12,
          transform: "rotate(45deg)",
          boxShadow: "6px 6px 0 rgba(15, 23, 42, 0.2)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 36,
          bottom: 8,
          width: 20,
          height: 20,
          borderRadius: "999px",
          backgroundColor: "rgba(248, 250, 252, 0.98)",
          border: "4px solid #0f172a",
        }}
      />
    </div>
  );
};

export default IntroContent;
