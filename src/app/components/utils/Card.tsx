import Image from "next/image";
import { EllipsisVertical, Trash2} from "lucide-react";
import { useState } from "react";

type CardProps = {
  title: string;
  imageSrc: string;
  description?: string;
  onClick?: () => void;
  onDelete?: () => void;
  canBeDeleted?: boolean;
};

export default function Card({ title, imageSrc, description, onClick, onDelete, canBeDeleted }: CardProps) { const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div
      className="relative rounded-lg overflow-visible shadow-lg bg-white border border-gray-200 hover:shadow-xl transition-shadow duration-200 cursor-pointer"
      style={{ width: 150, height: 188 }}
      onClick={onClick}
    >
{/* Kebab Menu Button */}
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

        {/* Kebab Menu (bottom-right) */}
        <div
          className="absolute bottom-2 right-2 z-10 bg-blue"
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(!menuOpen);
          }}
        >
          <button className="text-black hover:text-black text-xl font-bold px-2 cursor-pointer">
            <EllipsisVertical className="w-5 h-5" />
          </button>

          {menuOpen && (
            <div className="absolute bottom-full right-0 mb-2 w-32 bg-white border rounded shadow-lg z-20">
              <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-black">
                View
              </button>
              {canBeDeleted && (
                <button
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-500"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onDelete) onDelete();
                  setMenuOpen(false);
                }}
                >
                  <Trash2 className="inline mr-2 w-4" />
                  Delete

                </button>
              )}
            </div>
          )}
        </div>
    </div>
  );
}
