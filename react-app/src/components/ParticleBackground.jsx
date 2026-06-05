import Particles, { ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
const particlesInit = async (engine) => {
    await loadSlim(engine);
}
const particleOptions = {
    background: {
        color: "transparent",
    },
    particles: {
        number: {
            value: 40,
        },
        color: {
            value: "rgba(72, 219, 236, 0.4)"
        },
        links: {
        enable: true,
        color: "rgba(72, 219, 236, 0.4)",
        opacity: 0.35
      },
        move: {
            enable: true,
            speed: 0.5,
        },
        size: {
            value: { min: 2, max: 6 }
        },
        opacity: {
            value: 0.7
        }
    }
}
function ParticleBackground() {
    return (
        <ParticlesProvider init={particlesInit}>
            <Particles
                id="tsparticles"
                options={particleOptions}
            />
        </ParticlesProvider>

    );
}

export default ParticleBackground;