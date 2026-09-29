"use client";
import styles from "./case4.module.css";
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

            <div className={styles.title}>SUMMER<br/>MUSIC</div>
            <div className={styles.subtitle}>park</div>
            <div className={styles.text}>
                Eжегодный музыкальный фестиваль под открытым небом, который проходит в Санкт-Петербурге
                <br/>
                на территории Ботанического сада
                <br/>
                Петра Великого
            </div>
        </main>
    );
}