import Image from "next/image";

export default function HomePage() {
  return (
    <main style={{ margin: 0, padding: 0, width: "100%", lineHeight: 0 }}>
      <Image
        src="/NagaSphere_Local_Marketplace_in_Nagaland.png"
        alt="NagaSphere — Local Marketplace in Nagaland"
        width={1199}
        height={1312}
        priority
        sizes="100vw"
        style={{
          display: "block",
          width: "100%",
          height: "auto",
        }}
      />
    </main>
  );
}
