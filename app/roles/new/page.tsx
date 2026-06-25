import Link from "next/link";
import { Croissant_One, Black_Ops_One, Bebas_Neue } from "next/font/google";
import { ChevronLeft, Shield } from "lucide-react";
import { RoleForm } from "@/components/roles/RoleForm";

// Initialize Fonts
const croissant = Croissant_One({ 
  subsets: ["latin"],
  weight: "400",
  display: 'swap',
});

const blackOps = Black_Ops_One({
  subsets: ["latin"],
  weight: "400",
  display: 'swap',
});

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  display: 'swap',
});

export default function NewRolePage() {
  return (
    // Added Flexbox to perfectly center the child container vertically and horizontally
    <div className={`min-h-screen bg-[#0a0a0a] text-zinc-100 p-6 md:p-8 flex flex-col justify-center items-center ${bebas.className} tracking-wide`}>
      
      {/* Centered Max-Width Wrapper */}
      <div className="w-full max-w-3xl mx-auto py-10">
        
        {/* Animated Back Navigation */}
        <Link 
          href="/roles" 
          className={`mb-8 inline-flex items-center gap-2 text-zinc-500 hover:text-violet-400 hover:-translate-x-2 transition-all duration-300 ease-out ${blackOps.className} tracking-widest text-lg`}
        >
          <ChevronLeft className="h-5 w-5" />
          BACK TO ROLES
        </Link>
        
        {/* High-End Header Section */}
        <div className="group cursor-default mb-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600 shadow-[0_0_20px_rgba(124,58,237,0.3)] group-hover:scale-105 group-hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all duration-300 ease-out">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <h1 className={`text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400 ${croissant.className}`}>
              Create Role
            </h1>
          </div>
          <p className="mt-2 text-xl md:text-2xl text-zinc-400 ml-[4.5rem] tracking-wider leading-relaxed">
            Define a new role with specific permissions across resources.
          </p>
        </div>

        {/* Glassmorphic Form Container */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 md:p-10 shadow-2xl backdrop-blur-sm transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/50 hover:shadow-[0_0_40px_rgba(124,58,237,0.15)]">
          <RoleForm mode="create" />
        </div>

      </div>
    </div>
  );
}