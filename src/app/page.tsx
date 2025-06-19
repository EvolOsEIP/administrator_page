'use client';

import Image from "next/image";
import  { LayoutWithNavbar } from "./components/layout-with-navbar";
import Card from "./components/utils/Card";

export default function Home() {
  const nb_cards = 10;

  return (
    <LayoutWithNavbar>
      <div className="p-8">
        <div className="flex flex-wrap gap-8 gap-x-10 gap-y-10">
          {Array.from({ length: nb_cards }).map((_, index) => (
            <Card
              key={index}
              title={`Card ${index + 1}`}
              imageSrc="/avatar.jpeg"
              description="description"
            />
          ))}
        </div>
      </div>
    </LayoutWithNavbar>
  );
}
