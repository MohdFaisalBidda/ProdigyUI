import TeamSection from "@/components/TeamSection";

export default function Home() {
  const teamMembers = [
    { image: "/img4.avif", name: "Jack" },
    { image: "/img2.avif", name: "Jane" },
    { image: "/img3.avif", name: "Bob" },
    { image: "/img1.avif", name: "John" },
    { image: "/img5.avif", name: "Lisa" },
    { image: "/img6.avif", name: "Harry" },
  ];

  return (
    <main>
      <TeamSection defaultName="Our Squad" members={teamMembers} />
    </main>
  );
}
