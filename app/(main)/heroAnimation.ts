/**
 * Описание hero-анимации главной страницы.
 *
 * Начало отсчёта (0 s) — момент, когда все видео считаются загруженными.
 * Все значения времени ниже заданы в секундах от этой точки.
 * Все слои полноэкранные (`object-fit: cover`), позиции живут в
 * `page.module.css`, тайминги и кривые — здесь.
 *
 * ── nameAnimation.mp4 ────────────────────────────────────────────────
 *  {0 s}                       появляется и начинает играть
 *  NAME_ANIMATION_VANISHING_TIME  слой остаётся на месте (видео играет)
 *  + NAME_ANIMATION_FADE_TIME     слой становится прозрачным (opacity: 0)
 *
 * ── myAnimation.webm ─────────────────────────────────────────────────
 *  {0 s} … MY_ANIMATION_WAITING   пауза: слой скрыт за нижней границей окна
 *  MY_ANIMATION_WAITING           видео запускается
 *  + MY_ANIMATION_TRANSLATION_TIME  пролетает снизу вверх и останавливается,
 *                                   сглаживание MY_ANIMATION_TRANSLATION_CUBIC_BEZIER
 *  + MY_ANIMATION_PAUSE           остаётся на месте
 *  + MY_ANIMATION_EXITING_TIME    уходит целиком за верхнюю границу окна,
 *                                 сглаживание MY_ANIMATION_EXITING_CUBIC_BEZIER
 *
 *  Прокрутка страницы разблокируется после ухода слоя (HERO_SCROLL_UNLOCK_MS).
 */

/* ============ nameAnimation ============ */

export const NAME_ANIMATION_VANISHING_TIME = 2;
export const NAME_ANIMATION_FADE_TIME = 0.4;

/* ============ myAnimation ============ */

export const MY_ANIMATION_WAITING = 1;
export const MY_ANIMATION_TRANSLATION_TIME = 3;
export const MY_ANIMATION_TRANSLATION_CUBIC_BEZIER = "cubic-bezier(.64,.01,0,1)";
export const MY_ANIMATION_PAUSE = .1;
export const MY_ANIMATION_EXITING_TIME = 2.5;
export const MY_ANIMATION_EXITING_CUBIC_BEZIER = "cubic-bezier(.53,0,.21,.99)";

/* ============ производные метки (мс, для планировщика) ============ */

const SECOND = 1000;

/** Когда гаснет слой nameAnimation. */
export const NAME_ANIMATION_VANISHING_MS = NAME_ANIMATION_VANISHING_TIME * SECOND;

/** Когда запускается myAnimation (и начинается пролёт). */
export const MY_ANIMATION_START_MS = MY_ANIMATION_WAITING * SECOND;

/** Когда пролёт закончен и слой остановился. */
export const MY_ANIMATION_TRANSLATION_END_MS =
    MY_ANIMATION_START_MS + MY_ANIMATION_TRANSLATION_TIME * SECOND;

/** Когда заканчивается пауза и начинается уход. */
export const MY_ANIMATION_PAUSE_END_MS =
    MY_ANIMATION_TRANSLATION_END_MS + MY_ANIMATION_PAUSE * SECOND;

/** Когда слой полностью ушёл за верхнюю границу окна. */
export const MY_ANIMATION_EXIT_END_MS =
    MY_ANIMATION_PAUSE_END_MS + MY_ANIMATION_EXITING_TIME * SECOND;

/** Момент разблокировки прокрутки страницы. */
export const HERO_SCROLL_UNLOCK_MS = MY_ANIMATION_EXIT_END_MS;

/* ============ готовые значения для CSS ============ */

/** Гашение слоя nameAnimation. */
export const NAME_ANIMATION_FADE_TRANSITION = `opacity ${NAME_ANIMATION_FADE_TIME}s linear`;

/** Пролёт myAnimation снизу вверх до остановки. */
export const MY_ANIMATION_TRANSLATION_TRANSITION = [
    `top ${MY_ANIMATION_TRANSLATION_TIME}s ${MY_ANIMATION_TRANSLATION_CUBIC_BEZIER}`,
    `transform ${MY_ANIMATION_TRANSLATION_TIME}s ${MY_ANIMATION_TRANSLATION_CUBIC_BEZIER}`,
].join(", ");

/** Уход myAnimation за верхнюю границу окна. */
export const MY_ANIMATION_EXITING_TRANSITION = [
    `top ${MY_ANIMATION_EXITING_TIME}s ${MY_ANIMATION_EXITING_CUBIC_BEZIER}`,
    `transform ${MY_ANIMATION_EXITING_TIME}s ${MY_ANIMATION_EXITING_CUBIC_BEZIER}`,
].join(", ");

/* ============ состояния ============ */

/** Крупные фазы сцены. */
export const HERO_PHASE = {
    /** Ждём полной загрузки видео, поверх висит спиннер. */
    loading: "loading",
    /** Сцена отыгрывает таймлайн. */
    playing: "playing",
    /** Всё отыграно, прокрутка разблокирована. */
    done: "done",
} as const;

/**
 * Позиции слоя myAnimation. Значения используются как `data-my` в разметке,
 * поэтому их дублируют селекторы в `page.module.css`.
 */
export const MY_ANIMATION_STAGE = {
    /** Скрыт за нижней границей окна. */
    waiting: "waiting",
    /** Летит снизу вверх. */
    translating: "translating",
    /** Стоит на месте. */
    paused: "paused",
    /** Уходит за верхнюю границу. */
    exiting: "exiting",
    /** Полностью за кадром. */
    gone: "gone",
} as const;

/** События, означающие, что видео можно проигрывать без остановок. */
export const VIDEO_READY_EVENTS = [
    "canplaythrough",
    "canplay",
    "loadeddata",
] as const;
