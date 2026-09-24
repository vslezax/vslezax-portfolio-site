"use client";

import Link from "next/link";
import { useRef } from "react";
import styles from "./page.module.css";
import ArrowIcon from "./arrow.svg";
import "./layout.css";

import { useCasesViewer, CaseImage, usePageFlip } from "./casesViewer";
import ProgressBar from "./progressBar";

export default function PhotoPage() {
    const bodyRef = useRef<HTMLAnchorElement>(null);

    const { n, image, href, goTo, total } = useCasesViewer(1);

    const flip = usePageFlip(bodyRef);

    const handleNext = () => {
        flip(1, () => goTo(n === total ? 1 : n + 1));
    };

    const handlePrev = () => {
        flip(-1, () => goTo(n === 1 ? total : n - 1));
    };

    return (
        <main className={styles.main}>
            {/* Content */}
            <div className={styles.content}>
                <div className={styles.contentBack2}></div>
                <div className={styles.contentBack1}></div>

                {/* Сцена с perspective — внутри крутится contentBody */}
                <div className={styles.contentBodyScene}>
                    <Link
                        href={href}
                        ref={bodyRef}
                        className={styles.contentBody}
                    >
                        <CaseImage
                            src={image}
                            alt={`case ${n}`}
                            className={styles.caseImage}
                        />
                    </Link>
                </div>

                {/* Кнопки */}
                <button
                    type="button"
                    className={styles.leftButton}
                    onClick={handlePrev}
                    aria-label="Предыдущий кейс"
                >
                    <div className={styles.buttonCircle}></div>
                    <ArrowIcon className={styles.leftButtonArrow} />
                </button>

                <button
                    type="button"
                    className={styles.rightButton}
                    onClick={handleNext}
                    aria-label="Следующий кейс"
                >
                    <div className={styles.buttonCircle}></div>
                    <ArrowIcon className={styles.rightButtonArrow} />
                </button>
            </div>

            {/* Top Left Bar */}
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

            {/* Top Right Bar */}
            <div className={styles.topRightBar}>
                <div className={styles.topRightBarInside}>
                    <div className={styles.topRightBarText}>вернуться на главную</div>
                    <ArrowIcon className={styles.topRightBarArrow} />
                </div>
            </div>

            {/* Progress bar */}
            <ProgressBar value={n} total={total} />
        </main>
    );
}