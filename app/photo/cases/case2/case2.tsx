"use client";
import styles from "./case2.module.css";
import React from "react";
import Image from "next/image";

import image from "./image.webp";

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
            <Image src={image} alt={''} className={styles.image}/>
            <div className={styles.shadow}/>

            <div className={styles.textContainer}>
                <div className={styles.title}>Igora Drive</div>
                <div className={styles.subtitle}>drift challenge</div>
            </div>
            <div className={styles.text}>
                IDDC — это официальный Кубок Санкт-Петербурга
                <br/>
                по дрифту, который проходит на  кольцевой
                трассе автодрома Игора Драйв
            </div>
        </main>
    );
}