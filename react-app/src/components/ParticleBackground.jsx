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
            value: '#8B0000',
        },
        move: {
            enable: true,
            speed: 0.5,
        },
        size: {
            value: 10
        },
        opacity: {
            value: 0.5
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