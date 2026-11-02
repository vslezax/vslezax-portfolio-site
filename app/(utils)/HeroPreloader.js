'use client';

import { useEffect, useState } from 'react';

import {
    HERO_PHASE,
    HERO_SCROLL_UNLOCK_MS,
    MY_ANIMATION_PAUSE_END_MS,
    MY_ANIMATION_STAGE,
    MY_ANIMATION_START_MS,
    MY_ANIMATION_TRANSLATION_END_MS,
    NAME_ANIMATION_VANISHING_MS,
    VIDEO_READY_EVENTS,
} from '@/app/(main)/heroAnimation';

/* */
/* Скрипт-дополнение к hero-анимации главной страницы. */
/* 1. Ждёт полной загрузки всех видео; незагрузившиеся за отведённое время */
/*    отдаёт наружу как "failed" — страница подменяет их постерами. */
/* 2. Запускает таймлайн из heroAnimation.ts (nameAnimation гасятся, */
/*    myAnimation ждёт -> летит -> стоит -> уходит). */
/* 3. Держит прокрутку заблокированной до конца таймлайна. */
/* */

/** readyState, при котором видео можно проигрывать без остановок. */
const HAVE_ENOUGH_DATA = 4;

/**
 * Ждёт готовности видео к плавному воспроизведению.
 * @param {HTMLVideoElement} video
 * @returns {Promise<boolean>} `true`, если видео готово, `false` при ошибке.
 */
const waitUntilPlayable = (video) =>
    new Promise((resolve) => {
        if (video.readyState >= HAVE_ENOUGH_DATA) {
            resolve(true);
            return;
        }

        let settled = false;

        const finish = (isPlayable) => {
            if (settled) return;
            settled = true;

            VIDEO_READY_EVENTS.forEach((event) =>
                video.removeEventListener(event, onProgress),
            );
            video.removeEventListener('error', onError, true);

            resolve(isPlayable);
        };

        const onProgress = () => {
            if (video.readyState >= HAVE_ENOUGH_DATA) finish(true);
        };

        const onError = () => finish(false);

        VIDEO_READY_EVENTS.forEach((event) =>
            video.addEventListener(event, onProgress),
        );
        video.addEventListener('error', onError, true);

        // На всякий случай форсируем загрузку.
        if (video.readyState === 0) video.load();
    });

/**
 * Хук hero-анимации: ожидание загрузки, запуск таймлайна
 * и блокировка прокрутки до конца сценария.
 *
 * @param {object} options
 * @param {React.RefObject<HTMLVideoElement | null>} options.nameVideoRef
 * @param {React.RefObject<HTMLVideoElement | null>} options.myVideoRef
 * @param {number} options.loadTimeoutMs сколько ждём загрузку видео, мс
 * @returns {{
 *   phase: string,
 *   nameHidden: boolean,
 *   myStage: string,
 *   failed: { name: boolean, my: boolean },
 * }}
 */
export function useHeroPreloader({ nameVideoRef, myVideoRef, loadTimeoutMs }) {
    const [phase, setPhase] = useState(HERO_PHASE.loading);
    const [nameHidden, setNameHidden] = useState(false);
    const [myStage, setMyStage] = useState(MY_ANIMATION_STAGE.waiting);
    const [failed, setFailed] = useState({ name: false, my: false });

    // --- Блокировка прокрутки до конца таймлайна ---
    useEffect(() => {
        if (phase === HERO_PHASE.done) return undefined;

        const { body } = document;
        const prevOverflow = body.style.overflow;
        const prevOverscroll = body.style.overscrollBehavior;

        body.style.overflow = 'hidden';
        body.style.overscrollBehavior = 'none';

        return () => {
            body.style.overflow = prevOverflow;
            body.style.overscrollBehavior = prevOverscroll;
        };
    }, [phase]);

    // --- Скрываем скроллбар на главной, чтобы не было сдвига ширины ---
    // Класс живёт только пока смонтирован hero: на других страницах скроллбар
    // остаётся обычным, а прокрутка главной работает без видимой полосы.
    useEffect(() => {
        const root = document.documentElement;
        root.classList.add('hide-scrollbar');

        return () => root.classList.remove('hide-scrollbar');
    }, []);

    // --- Ожидание загрузки и запуск таймлайна ---
    useEffect(() => {
        const nameVideo = nameVideoRef.current;
        const myVideo = myVideoRef.current;

        if (!nameVideo || !myVideo) return undefined;

        let cancelled = false;
        const timers = [];

        /** Выполнить действие по абсолютной метке таймлайна. */
        const schedule = (atMs, run) => {
            timers.push(
                setTimeout(() => {
                    if (!cancelled) run();
                }, atMs),
            );
        };

        const play = async (video, label) => {
            try {
                video.currentTime = 0;
                await video.play();
                return true;
            } catch (error) {
                console.warn(`[HeroPreloader] Не удалось запустить ${label}:`, error);
                return false;
            }
        };

        const deadline = new Promise((resolve) => {
            timers.push(setTimeout(resolve, loadTimeoutMs));
        });

        const bothPlayable = Promise.all([
            waitUntilPlayable(nameVideo),
            waitUntilPlayable(myVideo),
        ]);

        const run = async () => {
            // Ждём либо готовности обоих видео, либо истечения лимита времени.
            await Promise.race([bothPlayable, deadline]);
            if (cancelled) return;

            const nameReady = nameVideo.readyState >= HAVE_ENOUGH_DATA;
            const myReady = myVideo.readyState >= HAVE_ENOUGH_DATA;

            setFailed({ name: !nameReady, my: !myReady });
            setPhase(HERO_PHASE.playing);

            // Ни одно видео не загрузилось — показываем постеры в остановленной
            // позиции и сразу пускаем прокрутку.
            if (!nameReady && !myReady) {
                setMyStage(MY_ANIMATION_STAGE.paused);
                setPhase(HERO_PHASE.done);
                return;
            }

            // nameAnimation: играет с начала отсчёта, по метке гаснет.
            if (nameReady) play(nameVideo, 'nameAnimation');
            schedule(NAME_ANIMATION_VANISHING_MS, () => setNameHidden(true));

            // myAnimation: ждёт за нижней границей, стартует и летит вверх.
            schedule(MY_ANIMATION_START_MS, () => {
                setMyStage(MY_ANIMATION_STAGE.translating);
                if (myReady) play(myVideo, 'myAnimation');
            });
            schedule(MY_ANIMATION_TRANSLATION_END_MS, () =>
                setMyStage(MY_ANIMATION_STAGE.paused),
            );
            schedule(MY_ANIMATION_PAUSE_END_MS, () =>
                setMyStage(MY_ANIMATION_STAGE.exiting),
            );

            // Уход завершён — слой за кадром, прокрутка разблокирована.
            schedule(HERO_SCROLL_UNLOCK_MS, () => {
                setMyStage(MY_ANIMATION_STAGE.gone);
                setPhase(HERO_PHASE.done);
            });
        };

        run();

        return () => {
            cancelled = true;
            timers.forEach((timer) => clearTimeout(timer));
            nameVideo.pause();
            myVideo.pause();
        };
    }, [nameVideoRef, myVideoRef, loadTimeoutMs]);

    return { phase, nameHidden, myStage, failed };
}

/**
 * Оверлей ожидания загрузки видео.
 * Скролл на это время блокирует сам хук.
 *
 * @param {object} props
 * @param {boolean} [props.visible]
 */
export default function HeroPreloader({ visible = true }) {
    if (!visible) return null;

    return (
        <div
            role="status"
            aria-live="polite"
            aria-label="Загрузка сайта"
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
        >
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent" />
        </div>
    );
}
