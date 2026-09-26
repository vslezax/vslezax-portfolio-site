"use client";

import { useCallback, useMemo, useState, useEffect, useRef } from "react";
import { CASES, CASES_COUNT } from "./cases";

export { CASES, CASES_COUNT };

/**
 * Хук для управления текущим кейсом.
 * N — номер кейса (1..CASES_COUNT), ходит по кругу.
 */
export function useCases(initial: number = 1) {
    const [n, setN] = useState(initial);

    const next = useCallback(() => {
        setN((prev) => (prev % CASES_COUNT) + 1);
    }, []);

    const prev = useCallback(() => {
        setN((prev) => ((prev - 2 + CASES_COUNT) % CASES_COUNT) + 1);
    }, []);

    const goTo = useCallback((value: number) => {
        const clamped = ((value - 1 + CASES_COUNT) % CASES_COUNT) + 1;
        setN(clamped);
    }, []);

    return { n, next, prev, goTo, total: CASES_COUNT };
}

/** Хук-обёртка над useCases, отдаёт всё нужное для рендера. */
export function useCasesViewer(initial: number = 1) {
    const { n, next, prev, goTo, total } = useCases(initial);

    const Case = useMemo(() => CASES[n - 1], [n]);

    return { n, Case, next, prev, goTo, total };
}

/** Длительность одной фазы в мс. */
export const FLIP_DURATION = 300;

/**
 * Хук анимации «перелистывания страницы» для contentBody.
 * (без изменений — оставляем как есть)
 */
export function usePageFlip(
    ref: React.RefObject<HTMLElement | null>,
    duration = FLIP_DURATION,
) {
    const isAnimating = useRef(false);

    const flip = useCallback(
        (direction: 1 | -1, onMidpoint: () => void) => {
            const el = ref.current;
            if (!el || isAnimating.current) return;
            isAnimating.current = true;

            const scene = el.parentElement;

            scene?.classList.add("flipping");
            el.classList.add("flipping");

            const phase1 = direction === 1 ? -25 : 25;
            const phase3 = -phase1;

            el.style.transition = `transform ${duration}ms cubic-bezier(.66,0,.89,.47)`;
            el.style.transform = `rotateY(${phase1}deg)`;

            window.setTimeout(() => {
                onMidpoint();

                el.style.transition = "none";
                el.style.transform = `rotateY(${phase3}deg)`;
                void el.offsetWidth;

                el.style.transition = `transform ${duration * 2}ms cubic-bezier(.14,.71,.28,.93)`;
                el.style.transform = "rotateY(0deg)";

                window.setTimeout(() => {
                    el.style.transition = "";
                    el.style.transform = "";
                    el.classList.remove("flipping");
                    scene?.classList.remove("flipping");
                    isAnimating.current = false;
                }, duration * 2);
            }, duration);
        },
        [ref, duration],
    );

    useEffect(() => {
        const el = ref.current;
        const scene = el?.parentElement;
        return () => {
            if (el) {
                el.style.transition = "";
                el.style.transform = "";
                el.classList.remove("flipping");
            }
            scene?.classList.remove("flipping");
        };
    }, [ref]);

    return flip;
}