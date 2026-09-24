"use client";

import { useCallback, useMemo, useState, useEffect, useRef } from "react";
import Image, { StaticImageData } from "next/image";

// images import
import img1 from "./cases/1.webp";
import img2 from "./cases/2.webp";
import img3 from "./cases/3.webp";
import img4 from "./cases/4.webp";
import img5 from "./cases/5.webp";
const CASES: StaticImageData[] = [img1, img2, img3, img4, img5];
export const CASES_COUNT = CASES.length;

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

    const image = useMemo(() => CASES[n - 1], [n]);
    const href = useMemo(() => `/photo/${n}`, [n]);

    return { n, image, href, next, prev, goTo, total };
}

/** Компонент-картинка кейса. */
export function CaseImage({
                              src,
                              alt,
                              className,
                          }: {
    src: StaticImageData;
    alt?: string;
    className?: string;
}) {
    return (
        <Image
            src={src}
            alt={alt ?? "case"}
            className={className}
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
            priority
            unoptimized
        />
    );
}

export { CASES };

/** Длительность одной фазы в мс. */
export const FLIP_DURATION = 300;

/**
 * Хук анимации «перелистывания страницы» для contentBody.
 * Возвращает ref на элемент и функцию flip(direction).
 *  - direction: 1 — вперёд (next), -1 — назад (prev)
 * Во время смены картинки (когда элемент отвернут на 90°)
 * вызывается onMidpoint — тут меняется N.
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

            const phase1 = direction === 1 ? -3 : 3;
            const phase3 = -phase1;

            el.style.transition = `transform ${duration}ms cubic-bezier(.66,0,.89,.47)`;
            el.style.transform = `rotateY(${phase1}deg)`;

            window.setTimeout(() => {
                onMidpoint();

                el.style.transition = "none";
                el.style.transform = `rotateY(${phase3}deg)`;
                void el.offsetWidth;

                el.style.transition = `transform ${duration*2}ms cubic-bezier(.14,.71,.28,.93)`;
                el.style.transform = "rotateY(0deg)";

                window.setTimeout(() => {
                    isAnimating.current = false;
                }, duration);
            }, duration);
        },
        [ref, duration],
    );

    useEffect(() => {
        const el = ref.current;
        return () => {
            if (el) {
                el.style.transition = "";
                el.style.transform = "";
            }
        };
    }, [ref]);

    return flip;
}