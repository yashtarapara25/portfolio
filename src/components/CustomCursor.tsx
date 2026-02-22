import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const [hovering, setHovering] = useState(false);
    const [clicking, setClicking] = useState(false);

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            if (cursorRef.current) {
                // Centre the wrapper on the cursor — wrapper is 40px wide
                cursorRef.current.style.transform = `translate(${e.clientX - 20}px, ${e.clientY - 20}px)`;
            }
        };
        const onOver = (e: MouseEvent) => {
            const el = e.target as HTMLElement;
            setHovering(el.closest("a, button, [role='button'], input, textarea") !== null);
        };
        const onDown = () => setClicking(true);
        const onUp = () => setClicking(false);

        window.addEventListener("mousemove", onMove, { passive: true });
        window.addEventListener("mouseover", onOver);
        window.addEventListener("mousedown", onDown);
        window.addEventListener("mouseup", onUp);
        return () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseover", onOver);
            window.removeEventListener("mousedown", onDown);
            window.removeEventListener("mouseup", onUp);
        };
    }, []);

    const color = clicking ? "#ec4899" : hovering ? "#a855f7" : "#22d3ee";
    const glow = clicking ? "#ec489980" : hovering ? "#a855f780" : "#22d3ee70";

    return (
        <div
            ref={cursorRef}
            className="fixed top-0 left-0 z-[9999] pointer-events-none will-change-transform"
            style={{ width: 40, height: 40 }}
        >
            {/* ── Outer ring ── */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    border: `1.5px solid ${color}`,
                    boxShadow: `0 0 10px 2px ${glow}`,
                    transition: "border-color 0.15s, box-shadow 0.15s",
                    transform: clicking ? "scale(0.85)" : hovering ? "scale(1.15)" : "scale(1)",
                    transitionProperty: "border-color, box-shadow, transform",
                    transitionDuration: "0.15s",
                }}
            />

            {/* ── Inner dot (always centred) ── */}
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: clicking ? 6 : 8,
                    height: clicking ? 6 : 8,
                    marginTop: clicking ? -3 : -4,
                    marginLeft: clicking ? -3 : -4,
                    borderRadius: "50%",
                    background: color,
                    boxShadow: `0 0 8px 3px ${glow}`,
                    transition: "all 0.15s",
                }}
            />
        </div>
    );
}
