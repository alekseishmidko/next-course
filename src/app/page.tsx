import Image from "next/image";

async function Banner() {
  return (
    <Image
      src="/images/img.png"
      alt={"banner"}
      fill={true}
      // className="object-cover"
      sizes={"(max-width: 640px) 100vw, (max-width: 1024px) 60vw, 33vw"}
      priority={true}
      quality={90}
      // placeholder={"blur"}
    />
  );
}

export default function Home() {
  return (
    <main className="p-10 bg-black text-white min-h-screen">
      <Banner />
    </main>
  );
}
