import Image from "next/image";

export default function HomePage() {
  return (
    <main
      style={{
        margin: 0,
        padding: 0,
        width: "100%",
        maxWidth: "100vw",
        overflowX: "hidden",
        lineHeight: 0,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1199px",
          margin: "0 auto",
        }}
      >
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
            maxWidth: "1199px",
            height: "auto",
            margin: "0 auto",
          }}
        />
      </div>
    </main>
  );
}
