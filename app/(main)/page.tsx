import Hero from './Hero';
import scale from './page.scale.module.css';
import page from './page.module.css';

/**
 * Сколько ждём полной загрузки видео, прежде чем заменить незагрузившийся
 * файл его постером (миллисекунды).
 */
const VIDEO_LOAD_TIMEOUT_MS = 15_000;

export default function Home() {
    return (
        <main className={`${page.main} ${scale}`}>
            <Hero loadTimeoutMs={VIDEO_LOAD_TIMEOUT_MS} />
            <div className={`${page.about} ${scale}`}/>
        </main>
    );
}
