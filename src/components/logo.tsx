import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-lg">N</span>
      </div>
      <span className="text-blue-900 font-bold text-xl">NuBarber</span>
    </Link>
  );
}
