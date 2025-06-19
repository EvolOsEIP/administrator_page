import Image from "next/image";

type CardProps = {
  title: string;
  imageSrc: string;
  description?: string;
};

export default function Card({ title, imageSrc, description, onClick }: CardProps) {
  return (
    <div
      className="rounded-lg overflow-hidden shadow-lg bg-white border border-gray-200 hover:shadow-xl transition-shadow duration-200 cursor-pointer"
      style={{ width: 150, height: 188 }}
      onClick={onClick}
    >
      <div style={{ width: 150, height: 100, position: "relative" }}>
        <Image
          src={imageSrc}
          alt={title}
          fill
          style={{ objectFit: "cover" }}
          sizes="150px"
          priority
        />
      </div>
      <div className="p-2" style={{ height: 88, overflow: "hidden" }}>
        <h2 className="text-sm font-semibold mb-1 truncate text-black">{title}</h2>
        <p className="text-xs text-gray-600" style={{ lineHeight: "1.1rem" }}>
          {description || "This is a reusable card component using props."}
        </p>
      </div>
    </div>
  );
}
