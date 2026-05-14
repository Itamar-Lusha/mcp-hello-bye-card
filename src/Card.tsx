type Variant = "hello" | "bye";

const config: Record<Variant, { word: string; gradient: string; emoji: string }> = {
  hello: {
    word: "Hello",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    emoji: "👋",
  },
  bye: {
    word: "Bye",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    emoji: "✌️",
  },
};

interface CardProps {
  variant: Variant;
}

export function Card({ variant }: CardProps) {
  const { word, gradient, emoji } = config[variant];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "220px",
        borderRadius: "20px",
        background: gradient,
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
        padding: "32px",
        userSelect: "none",
      }}
    >
      <span style={{ fontSize: "56px", marginBottom: "12px" }}>{emoji}</span>
      <h1
        style={{
          fontSize: "64px",
          fontWeight: 800,
          color: "#ffffff",
          letterSpacing: "-1px",
          textShadow: "0 2px 12px rgba(0,0,0,0.2)",
          lineHeight: 1,
        }}
      >
        {word}
      </h1>
    </div>
  );
}
