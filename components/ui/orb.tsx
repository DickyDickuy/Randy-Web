"use client";
import React from "react";
import ParticleSphere from "./particle-sphere";

export const Orb = () => {
  return (
    <div className="relative flex h-[320px] w-[320px] sm:h-[380px] sm:w-[380px] md:h-[420px] md:w-[420px] items-center justify-center select-none">
      <div className="relative size-full">
        <ParticleSphere
          particlesCount={8000}
          particleScale={3.5}
          speed={20}
          scale={10}
          drag={true}
          stopOnHover={false}
          cursorOn={true}
          cursorRadiusUI={150}
          cursorStrengthUI={6}
          clickForce={12}
          sphereColor="#000000"
        />
      </div>
    </div>
  );
};
export default Orb;
