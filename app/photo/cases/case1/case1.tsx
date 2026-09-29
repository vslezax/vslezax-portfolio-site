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
        <main className={styles.main} style={{ "--case_k": k } as React.CSSProperties}>
            <div className={styles.label}>SILENCE</div>
            <Image src={image} alt={''} className={styles.image}/>
            <div className={styles.leftTextContainer}>
                <div className={styles.leftText}>В графическом дизайне это слово чаще всего работает как концепт: пауза, пустота, воздух, промежуток между элементами</div>
                <div className={styles.leftText}>Silence — это не просто «нет звука», это намеренное безмолвие, которое отражает напряжение, акцент или покой</div>
            </div>
            <div className={styles.rightText}>
                Случайная фотосессия, которую мы провели
                <br/>
                без четкой цели и плана. Немного сумбурные,
                <br/>
                немного креативные, немного
                <br/>
                черно-белые кадры
            </div>
            <div className={styles.bigTextContainer}>
                <div className={styles.bigTextInsideContainer}>
                    <div className={styles.bigTextInsideInsideContainer}>
                        <div className={styles.bigTextUncountableContainer}>
                            <div className={styles.bigTextOnest}>[</div>
                            <div className={styles.bigTextUncountable}>uncountable</div>
                            <div className={styles.bigTextOnest}>]</div>
                        </div>
                        <div className={styles.bigTextDefinition}>the complete absence of sound.</div>
                    </div>
                    <div className={styles.bigTextExample}>The silence of the empty studio felt heavy.</div>
                </div>
                <div className={styles.bigTextInsideContainer}>
                    <div className={styles.bigTextInsideInsideContainer}>
                        <div className={styles.bigTextUncountableContainer}>
                            <div className={styles.bigTextOnest}>[</div>
                            <div className={styles.bigTextUncountable}>uncountable</div>
                            <div className={styles.bigTextOnest}>]</div>
                        </div>
                        <div className={styles.bigTextDefinition}>the fact of saying nothing.</div>
                    </div>
                    <div className={styles.bigTextExample}>His silence on the brief spoke louder than words.</div>
                </div>
            </div>
        </main>
    );
}