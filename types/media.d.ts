// Типы для импорта видео как модулей (asset/resource в webpack, type: "asset" в Turbopack).
// Сам файл попадает в сборку как хешированный URL.

declare module "*.mp4" {
    const src: string;
    export default src;
}

declare module "*.webm" {
    const src: string;
    export default src;
}

declare module "*.ogv" {
    const src: string;
    export default src;
}

declare module "*.mov" {
    const src: string;
    export default src;
}
