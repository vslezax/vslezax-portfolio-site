"use client";
import styles from "./case1.module.css";
import React from "react";
import Lines from "./lines.svg";

const DESIGN_W = 968;
const DESIGN_H = 541;

export default function CaseScene({n, width, height,}: {
    n: number;
    width: number;
    height: number;
}) {
    // коэффициент: во сколько раз реальный contentBody меньше/больше макета
    const k = Math.min(width / DESIGN_W, height / DESIGN_H);

    return (
        <main className={styles.main}
              style={{ "--case_k": k } as React.CSSProperties}
        >
            <div className={styles.image}>
                <Lines className={styles.lines} />
                <div className={styles.imageTitle}>ФОТО-<br/>ПОРТФОЛИО</div>
                <div className={styles.imageSubtitle}>Сборник работ за 2023-2026 год</div>
                <div className={styles.imageDescription}>Хоть я и позиционирую себя, в основном, как специалиста<br/>
                    в области видео и моушна, когда меня наскучивает основной<br/>
                    профиль я люблю фотографировать людей, мероприятия<br/>
                    и другие красивые вещи в мире</div>
            </div>
            <div className={styles.content}>
            </div>
        </main>
    );
}