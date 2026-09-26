"use client";
import styles from "./case1.module.css";
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
        <main className={styles.mainContainer}>
            <div className={styles.allShadow} style={{ "--case_k": k } as React.CSSProperties}/>
            <div className={styles.centralShadow} style={{ "--case_k": k } as React.CSSProperties}/>
            <main className={styles.main} style={{ "--case_k": k } as React.CSSProperties}>
                <div className={styles.image}>
                    <Image src={image} alt={''}></Image>
                </div>
                <div className={styles.content}>

                </div>
            </main>
        </main>
    );
}