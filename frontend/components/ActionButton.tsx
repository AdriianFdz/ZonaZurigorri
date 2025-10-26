import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface ActionButtonProps {
  href: string;
  variant?: "primary" | "secondary";
  icon: LucideIcon;
  iconPosition?: "left" | "right";
  children: React.ReactNode;
}

export default function ActionButton({
  href,
  variant = "primary",
  icon: Icon,
  iconPosition = "right",
  children,
}: ActionButtonProps) {
  const baseStyles =
    "flex items-center gap-2 py-3 px-6 text-lg rounded transition-all duration-300 cursor-pointer font-semibold";

  const variantStyles = {
    primary: "bg-white text-burdeos-dark hover:bg-gray-50 hover:text-burdeos-light shadow-md hover:shadow-xl",
    secondary:
      "bg-burdeos-dark/70 text-white border border-burdeos-dark hover:bg-burdeos-dark hover:text-white shadow-md hover:shadow-xl backdrop-blur-sm box-border",
  };

  return (
    <Link href={href} className="cursor-pointer">
      <button className={`${baseStyles} ${variantStyles[variant]}`}>
        {iconPosition === "left" && <Icon className="w-6 h-6" />}
        {children}
        {iconPosition === "right" && <Icon className="w-6 h-6" />}
      </button>
    </Link>
  );
}
