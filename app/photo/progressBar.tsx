"use client";

import styles from "./page.module.css";

type Props = {
    /** Текущий шаг, 1..total */
    value: number;
    /** Всего шагов */
    total: number;
};

export default function ProgressBar({ value, total }: Props) {
    const safeTotal = Math.max(total, 1);
    const clamped = Math.min(Math.max(value, 1), safeTotal);

    // при total = 1 избегаем деления на ноль
    const percent = safeTotal === 1
        ? 100
        : ((clamped - 1) / (safeTotal - 1)) * 100;

    return (
        <div
            className={styles.progressBar}
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={safeTotal}
            aria-valuenow={clamped}
        >
            <div
                className={styles.progressBarFill}
                style={{ width: `${percent}%` }}
            />
        </div>
    );
}