type AtmosphereVariant = "blake" | "durere" | "neutral";

const variants: Record<AtmosphereVariant, string> = {
  // Noapte, oraș, tensiune — lumini calde difuze pe fundal aproape negru,
  // ca niște ferestre luminate văzute prin ploaie.
  blake:
    "radial-gradient(60% 50% at 18% 20%, rgba(90,30,42,0.35), transparent 60%), radial-gradient(45% 40% at 85% 15%, rgba(169,135,93,0.14), transparent 65%), radial-gradient(70% 60% at 50% 100%, rgba(20,18,17,0.9), #0E0D0C 70%)",
  // Singurătate, lumină care apare din întuneric — un singur punct de lumină,
  // mai rece, mai calm.
  durere:
    "radial-gradient(50% 45% at 80% 10%, rgba(169,135,93,0.16), transparent 60%), radial-gradient(60% 50% at 20% 90%, rgba(42,39,36,0.6), transparent 70%), #0E0D0C",
  neutral:
    "radial-gradient(ellipse 80% 50% at 20% 0%, rgba(90,30,42,0.45) 0%, transparent 55%), radial-gradient(ellipse 60% 40% at 80% 20%, rgba(169,135,93,0.08) 0%, transparent 50%)"
};

export default function Atmosphere({
  variant = "neutral",
  className = ""
}: {
  variant?: AtmosphereVariant;
  className?: string;
}) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div
        className="absolute inset-0 animate-drift"
        style={{ backgroundImage: variants[variant], backgroundSize: "140% 140%" }}
      />
      <div className="grain-overlay bg-grain bg-repeat" style={{ backgroundSize: "200px 200px" }} />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent from-[35%] to-black" />
    </div>
  );
}
