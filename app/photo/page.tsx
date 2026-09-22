import styles from "./page.module.css";
import ArrowIcon from "./arrow.svg";
import anim from "./topBarBackAnimation.module.css";
import Drop from "./drop.svg";
import Link from "next/link";

import "./layout.css";

export default function PhotoPage() {
    return (
        <main className={styles.container}>
            {/* Черная капля вверху */}
            <Drop className={styles.drop} />

            {/* Верхнее меню (текст + кнопка назад) */}
            <header className={styles.topBar}>
                <h1 className={styles.topBarTitle}>
                    Фотоработы
                </h1>

                <Link href="/" className={`${styles.topBarBack} ${anim.topBarBack}`}>
                    <span className={styles.backText}>
                        вернуться на главную
                    </span>
                    <ArrowIcon className={`${styles.topBarBackIcon} ${anim.topBarBackIcon}`} />
                </Link>
            </header>

        </main>
    );
}