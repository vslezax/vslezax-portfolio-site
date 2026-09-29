"use client";
import styles from "./case3.module.css";
import React from "react";

import image from "./image.webp";
import Image from "next/image";

const DESIGN_W = 968;
const DESIGN_H = 541;

export default function CaseScene({width, height,}: {
    width: number;
    height: number;
}) {
    // коэффициент: во сколько раз реальный contentBody меньше/больше макета
    const k = Math.min(width / DESIGN_W, height / DESIGN_H);

    return (
        <main className={styles.main} style={{ "--case_k": k } as React.CSSProperties}>
            <div className={styles.container}>
                <Image src={image} alt={''}></Image>
                <div className={styles.shadow}/>
            </div>
            <div className={styles.container}>
                <div className={styles.title}>БАЗОВАЯ<br/>ФОТОСЕССИЯ</div>
                <div className={styles.subtitleContainer}>
                    <div className={styles.text}>Базовая фотосессия -</div>
                    <div className={styles.text}>несколько фотографий с простым<br/>белым фоном. Классика.</div>
                </div>
                <div className={styles.leftText}>почему нет, когда да?</div>
                <div className={styles.rightText}>когда да, почему нет?</div>

                <div className={styles.centralTextContainer}>
                    <div className={styles.centalTextOnest}>(</div>
                    <div className={styles.centalTextCodenext}>с цветочком</div>
                    <div className={styles.centalTextOnest}>!)</div>
                </div>
            </div>
        </main>
    );
}