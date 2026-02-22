import { useEffect, useState, useRef } from "react";

interface TypewriterOptions {
    texts: string[];           // Array of texts to cycle through
    typingSpeed?: number;      // ms per character while typing
    deletingSpeed?: number;    // ms per character while deleting
    pauseAfterType?: number;   // ms to hold after fully typed
    pauseAfterDelete?: number; // ms to hold after fully deleted
}

/**
 * useTypewriter — returns { displayText, isTyping, cursorVisible }
 * Cycles through the given texts with a realistic typing + deleting effect.
 */
export function useTypewriter({
    texts,
    typingSpeed = 90,
    deletingSpeed = 50,
    pauseAfterType = 1800,
    pauseAfterDelete = 400,
}: TypewriterOptions) {
    const [displayText, setDisplayText] = useState("");
    const [isTyping, setIsTyping] = useState(true);
    const [cursorVisible, setCursorVisible] = useState(true);

    const textIndexRef = useRef(0);
    const charIndexRef = useRef(0);
    const phaseRef = useRef<"typing" | "pausing" | "deleting" | "pause-after-delete">("typing");

    // Blinking cursor — always on
    useEffect(() => {
        const id = setInterval(() => setCursorVisible((v) => !v), 530);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        if (!texts.length) return;

        let timeoutId: ReturnType<typeof setTimeout>;

        const tick = () => {
            const currentText = texts[textIndexRef.current];
            const phase = phaseRef.current;

            if (phase === "typing") {
                if (charIndexRef.current < currentText.length) {
                    charIndexRef.current++;
                    setDisplayText(currentText.slice(0, charIndexRef.current));
                    setIsTyping(true);
                    timeoutId = setTimeout(tick, typingSpeed);
                } else {
                    phaseRef.current = "pausing";
                    setIsTyping(false);
                    timeoutId = setTimeout(tick, pauseAfterType);
                }
            } else if (phase === "pausing") {
                phaseRef.current = "deleting";
                timeoutId = setTimeout(tick, 0);
            } else if (phase === "deleting") {
                if (charIndexRef.current > 0) {
                    charIndexRef.current--;
                    setDisplayText(currentText.slice(0, charIndexRef.current));
                    setIsTyping(true);
                    timeoutId = setTimeout(tick, deletingSpeed);
                } else {
                    phaseRef.current = "pause-after-delete";
                    setIsTyping(false);
                    timeoutId = setTimeout(tick, pauseAfterDelete);
                }
            } else {
                // Move to next text
                textIndexRef.current = (textIndexRef.current + 1) % texts.length;
                charIndexRef.current = 0;
                phaseRef.current = "typing";
                timeoutId = setTimeout(tick, 0);
            }
        };

        timeoutId = setTimeout(tick, 200);
        return () => clearTimeout(timeoutId);
    }, [texts, typingSpeed, deletingSpeed, pauseAfterType, pauseAfterDelete]);

    return { displayText, isTyping, cursorVisible };
}
