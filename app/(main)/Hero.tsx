'use client';

import Image from 'next/image';
import { useRef, type CSSProperties } from 'react';

import HeroPreloader, { useHeroPreloader } from './../(utils)/HeroPreloader';
import {
    HERO_PHASE,
    MY_ANIMATION_EXITING_TRANSITION,
    MY_ANIMATION_TRANSLATION_TRANSITION,
    NAME_ANIMATION_FADE_TRANSITION,
} from './heroAnimation';
import myAnimationSrc from './myAnimation.webm';
import myAnimationPoster from './myAnimationPoster.webp';
import nameAnimationSrc from './nameAnimation.mp4';
import nameAnimationPoster from './nameAnimationPoster.webp';
import page from './page.module.css';

/**
 * Hero-секция главной страницы: два полноэкранных видео друг над другом.
 *
 * Медиа импортируется здесь, а не в `page.tsx`, потому что `page.tsx` —
 * серверный компонент: webpack эмитит такие ассеты в серверную часть сборки,
 * откуда они не раздаются. Клиентский импорт кладёт файлы в
 * `.next/static/media` и отдаёт по `/_next/static/media/...`.
 *
 * Сценарий воспроизведения и блокировку скролла описывает `useHeroPreloader`,
 * тайминги и кривая — в `heroAnimation.ts`, геометрия — в `page.module.css`.
 */

export type HeroProps = {
    /** Сколько ждём загрузку видео перед подменой на постер, мс. */
    loadTimeoutMs: number;
};

export default function Hero({ loadTimeoutMs }: HeroProps) {
    const nameVideoRef = useRef<HTMLVideoElement>(null);
    const myVideoRef = useRef<HTMLVideoElement>(null);

    const { phase, nameHidden, myStage, failed } = useHeroPreloader({
        nameVideoRef,
        myVideoRef,
        loadTimeoutMs,
    });

    // Длительности, кривые и сами transition приходят из heroAnimation.ts.
    const animationStyle = {
        '--name-fade-transition': NAME_ANIMATION_FADE_TRANSITION,
        '--my-transition': MY_ANIMATION_TRANSLATION_TRANSITION,
        '--my-exit-transition': MY_ANIMATION_EXITING_TRANSITION,
    } as CSSProperties;

    return (
        <>
            <section
                className={page.hero}
                data-name={nameHidden ? 'hidden' : 'visible'}
                data-my={myStage}
                style={animationStyle}
            >
                {failed.name ? (
                    <Image
                        src={nameAnimationPoster}
                        alt=""
                        className={page.nameAnimationPoster}
                        sizes="100vw"
                    />
                ) : (
                    <video
                        ref={nameVideoRef}
                        data-preload
                        className={page.nameAnimation}
                        poster={nameAnimationPoster.src}
                        preload="auto"
                        muted
                        playsInline
                        disablePictureInPicture
                        aria-hidden="true"
                    >
                        <source src={nameAnimationSrc} type="video/mp4" />
                    </video>
                )}

                {failed.my ? (
                    <Image
                        src={myAnimationPoster}
                        alt=""
                        className={page.myAnimationPoster}
                        sizes="100vw"
                    />
                ) : (
                    <video
                        ref={myVideoRef}
                        data-preload
                        className={page.myAnimation}
                        poster={myAnimationPoster.src}
                        preload="auto"
                        muted
                        playsInline
                        disablePictureInPicture
                        aria-hidden="true"
                    >
                        <source src={myAnimationSrc} type="video/webm" />
                    </video>
                )}
            </section>

            <HeroPreloader visible={phase === HERO_PHASE.loading} />
        </>
    );
}
