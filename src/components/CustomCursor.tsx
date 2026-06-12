import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const [hovering, setHovering] = useState(false);
    const [clicking, setClicking] = useState(false);
    const [visible, setVisible] = useState(false);

    const mouseRef = useRef({ x: -100, y: -100 });
    const cursorCoordsRef = useRef({ x: -100, y: -100 });

    useEffect(() => {
        const hasMouse = window.matchMedia("(pointer: fine)").matches;
        if (!hasMouse) return;

        setVisible(true);

        const onMove = (e: MouseEvent) => {
            mouseRef.current.x = e.clientX;
            mouseRef.current.y = e.clientY;
        };

        const onOver = (e: MouseEvent) => {
            const el = e.target as HTMLElement;
            setHovering(el.closest("a, button, [role='button'], input, textarea, select, [tabindex]") !== null);
        };

        const onDown = () => setClicking(true);
        const onUp = () => setClicking(false);

        window.addEventListener("mousemove", onMove, { passive: true });
        window.addEventListener("mouseover", onOver, { passive: true });
        window.addEventListener("mousedown", onDown, { passive: true });
        window.addEventListener("mouseup", onUp, { passive: true });

        let rafId = 0;
        const updateCursor = () => {
            const dx = mouseRef.current.x - cursorCoordsRef.current.x;
            const dy = mouseRef.current.y - cursorCoordsRef.current.y;
            
            // Easing
            cursorCoordsRef.current.x += dx * 0.2;
            cursorCoordsRef.current.y += dy * 0.2;

            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate3d(${cursorCoordsRef.current.x - 20}px, ${cursorCoordsRef.current.y - 20}px, 0)`;
            }

            rafId = requestAnimationFrame(updateCursor);
        };

        rafId = requestAnimationFrame(updateCursor);

        return () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseover", onOver);
            window.removeEventListener("mousedown", onDown);
            window.removeEventListener("mouseup", onUp);
            cancelAnimationFrame(rafId);
        };
    }, []);

    if (!visible) return null;

    const color = clicking ? "#00FF88" : hovering ? "#00FF88" : "#22d3ee";
    const glow = clicking ? "rgba(0, 255, 136, 0.6)" : hovering ? "rgba(0, 255, 136, 0.5)" : "rgba(34, 211, 238, 0.4)";

    return (
        <div
            ref={cursorRef}
            className="fixed top-0 left-0 z-[9999] pointer-events-none will-change-transform"
            style={{ width: 40, height: 40, transform: "translate3d(-100px, -100px, 0)" }}
        >
            {/* ── Outer ring ── */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    border: `1.5px solid ${color}`,
                    boxShadow: `0 0 10px 2px ${glow}`,
                    transform: clicking ? "scale(0.8)" : hovering ? "scale(1.2)" : "scale(1)",
                    transition: "border-color 0.15s, box-shadow 0.15s, transform 0.15s",
                }}
            />

            {/* ── Inner dot ── */}
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: clicking ? 4 : 6,
                    height: clicking ? 4 : 6,
                    marginTop: clicking ? -2 : -3,
                    marginLeft: clicking ? -2 : -3,
                    borderRadius: "50%",
                    background: color,
                    boxShadow: `0 0 8px 3px ${glow}`,
                    transition: "background 0.15s, box-shadow 0.15s, width 0.15s, height 0.15s",
                }}
            />
        </div>
    );
}
