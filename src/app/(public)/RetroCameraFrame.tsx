export default function RetroCameraFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="retro-camera-wrapper">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/camera.png" alt="Appareil Photo" className="retro-camera-img" />

      {/* Screen overlay — photos appear here */}
      <div className="retro-camera-screen">
        <div className="retro-camera-screen-glow"></div>
        {children}
      </div>
    </div>
  );
}
