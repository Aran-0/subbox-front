import { Link } from "@mui/material";

const Logo = () => {
  return (
    <div className=" items-center justify-center gap-3 hidden min-[1300px]:flex">
      <Link href="/">
        <svg
          width="42"
          height="42"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="boxGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="50%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>
          </defs>
          
          <circle cx="50" cy="50" r="40" fill="url(#boxGradient)" opacity="0.2"/>
          <circle cx="50" cy="50" r="30" fill="url(#boxGradient)" opacity="0.4"/>
          <circle cx="50" cy="50" r="20" fill="url(#boxGradient)"/>
          
          <path d="M 35 50 L 45 60 L 65 40" 
                stroke="white" 
                strokeWidth="3" 
                fill="none" 
                strokeLinecap="round" 
                strokeLinejoin="round"/>
        </svg>
      </Link>
      <h1 className="font-inter font-bold text-2xl bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-600 bg-clip-text text-transparent">Subbox</h1>
    </div>
  );
};
export default Logo;
