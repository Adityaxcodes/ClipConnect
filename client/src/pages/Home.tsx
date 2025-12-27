import { BackgroundGradientAnimation } from "../components/ui/background-gradient-animation";
import { HoverBorderGradient } from "../components/ui/hover-border-gradient";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <BackgroundGradientAnimation>
      <div className="absolute top-4 right-4 z-50 flex gap-3 pointer-events-auto">
        <HoverBorderGradient
          containerClassName="rounded-full"
          as="button"
          className="bg-black text-white flex items-center justify-center space-x-2 px-6 py-2"
          onClick={() => navigate("/login")}
        >
          <span className="text-xl">&gt;</span>
          <span className="text-sm font-medium">Login</span>
        </HoverBorderGradient>
        
        <HoverBorderGradient
          containerClassName="rounded-full"
          as="button"
          className="bg-black text-white flex items-center justify-center space-x-2 px-6 py-2"
          onClick={() => navigate("/signup")}
        >
          <span className="text-xl">&gt;</span>
          <span className="text-sm font-medium">Sign Up</span>
        </HoverBorderGradient>
      </div>

      <div className="absolute z-50 inset-0 flex items-center justify-center text-white font-bold px-4 pointer-events-none text-3xl text-center md:text-4xl lg:text-7xl">
        <p className="bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-b from-white/80 to-white/20">
          ClipConnect
        </p>
      </div>
    </BackgroundGradientAnimation>
  );
}
