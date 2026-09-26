"use client";

import { useRef } from "react";
import styles from "./page.module.css";
import ArrowIcon from "./arrow.svg";
import "./layout.css";

import { useCasesViewer, usePageFlip } from "./casesViewer";
import ProgressBar from "./progressBar";
import { useElementSize } from "@/app/photo/useElementSize";

export default function PhotoPage() {
    const bodyRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<HTMLDivElement>(null);

    const { n, Case, goTo, total } = useCasesViewer(1);

    const flip = usePageFlip(bodyRef);

    const handleNext = () => {
        flip(1, () => goTo(n === total ? 1 : n + 1));
    };

    const handlePrev = () => {
        flip(-1, () => goTo(n === 1 ? total : n - 1));
    };

    const { width, height } = useElementSize(sceneRef);

    return (
        <main className={styles.main}>
            <div className={styles.content}>
                <div className={styles.contentBack2} />
                <div className={styles.contentBack1} />

                <div className={styles.contentBodyScene} ref={sceneRef}>
                    {/* было <Link>, стало <div> — ссылки больше нет */}
                    <div ref={bodyRef} className={styles.contentBody}>
                        <Case width={width} height={height} />
                    </div>
                </div>

                <button
                    type="button"
                    className={styles.leftButton}
                    onClick={handlePrev}
                    aria-label="Предыдущий кейс"
                >
                    <div className={styles.buttonCircle} />
                    <ArrowIcon className={styles.leftButtonArrow} />
                </button>

                <button
                    type="button"
                    className={styles.rightButton}
                    onClick={handleNext}
                    aria-label="Следующий кейс"
                >
                    <div className={styles.buttonCircle} />
                    <ArrowIcon className={styles.rightButtonArrow} />
                </button>
            </div>

            <div className={styles.topLeftBar}>
                <div className={styles.topLeftBarTitle}>
                    <div className={styles.topLeftBarTitleName}>VSLEZAX</div>
                    <div className={styles.topLeftBarTitleRegistered}>®</div>
                </div>
                <div className={styles.topLeftBarDescription}>
                    <div className={styles.topLeftBarDescriptionSlash}>{"//"}</div>
                    <div className={styles.topLeftBarDescriptionTitle}>Фотоработы</div>
                </div>
            </div>

            <div className={styles.topRightBar}>
                <div className={styles.topRightBarInside}>
                    <div className={styles.topRightBarText}>вернуться на главную</div>
                    <ArrowIcon className={styles.topRightBarArrow} />
                </div>
            </div>

            <ProgressBar value={n} total={total} />
        </main>
    );
}