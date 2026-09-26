"use client";
import styles from "./_intro.module.css";
import React from "react";
import Image from "next/image";

import Logo from "./logo.png"
import Lines from "./lines.svg";
import MicroGraphic from "./microGraphic.svg";
import ArrowIcon from "./arrow.svg";

const DESIGN_W = 968;
const DESIGN_H = 541;

export default function Intro({width, height,}: {
    width: number;
    height: number;
}) {
    // коэффициент: во сколько раз реальный contentBody меньше/больше макета
    const k = Math.min(width / DESIGN_W, height / DESIGN_H);

    return (
        <main className={styles.mainContainer}>
            <div className={styles.allShadow} style={{ "--case_k": k } as React.CSSProperties}/>
            <div className={styles.centralShadow} style={{ "--case_k": k } as React.CSSProperties}/>
            <main className={styles.main} style={{ "--case_k": k } as React.CSSProperties}>
                <div className={styles.image}>
                    <Lines className={styles.lines} />
                    <div className={styles.imageTitle}>ФОТО-<br/>ПОРТФОЛИО</div>
                    <div className={styles.imageSubtitle}>Сборник работ за 2023-2026 год</div>
                    <div className={styles.imageDescription}>Хоть я и позиционирую себя, в основном, как специалиста<br/>
                        в области видео и моушна, когда меня наскучивает основной<br/>
                        профиль я люблю фотографировать людей, мероприятия<br/>
                        и другие красивые вещи в мире</div>

                    <div className={styles.imageTopLinkContainer}>
                        <div className={styles.imageTopLink}>vslezax.vercel.app</div>
                        <div className={styles.imageTopLinkOnest}>/</div>
                        <div className={styles.imageTopLink}>photo</div>
                    </div>
                    <div className={styles.imageTop2026Container}>
                        <div className={styles.imageTop2026Onest}>©</div>
                        <div className={styles.imageTop2026}>2026</div>
                    </div>

                    <MicroGraphic className={styles.imageMicrographic} />
                    <Image src={Logo} alt={''} className={styles.imageLogo}/>
                </div>

                <div className={styles.content}>
                    <div className={styles.contentContact}>CONTACT</div>
                    <div className={styles.contentLocationContainer}>
                        <div className={styles.contentLocation}>SAINT-PETERSBURG</div>
                        <div className={styles.contentLocationOnest}>/</div>
                        <div className={styles.contentLocation}>RUSSIA</div>
                    </div>
                    <div className={styles.contentName}>
                        ЖУРКОВ<br/>
                        ЯРОСЛАВ
                    </div>
                    <div className={styles.contentLinks}>
                        <div className={styles.contentLink}>
                            <div className={styles.contentLinkNameContainer}>
                                <div className={styles.contentLinkName}>INSTAGRAM</div>
                                <ArrowIcon className={styles.contentLinkArrow}/>
                            </div>
                            <div className={styles.contentLinkLine}/>
                        </div>
                        <div className={styles.contentLink}>
                            <div className={styles.contentLinkNameContainer}>
                                <div className={styles.contentLinkName}>TELEGRAM</div>
                                <ArrowIcon className={styles.contentLinkArrow}/>
                            </div>
                            <div className={styles.contentLinkLine}/>
                        </div>
                        <div className={styles.contentLink}>
                            <div className={styles.contentLinkNameContainer}>
                                <div className={styles.contentLinkName}>VK</div>
                                <ArrowIcon className={styles.contentLinkArrow}/>
                            </div>
                            <div className={styles.contentLinkLine}/>
                        </div>
                        <div className={styles.contentLink}>
                            <div className={styles.contentLinkNameContainer}>
                                <div className={styles.contentLinkName}>EMAIL</div>
                                <ArrowIcon className={styles.contentLinkArrow}/>
                            </div>
                            <div className={styles.contentLinkLine}/>
                        </div>
                    </div>
                </div>
            </main>
        </main>
    );
}