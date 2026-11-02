import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    webpack(config) {
        config.module.rules.push(
            {
                test: /\.svg$/,
                use: ["@svgr/webpack"],
            },
            {
                // Видео импортируются как модули: сборка отдаёт хешированный URL.
                test: /\.(mp4|webm|ogv|mov|m4v)$/i,
                type: "asset/resource",
                generator: {
                    filename: "static/media/[name].[contenthash][ext]",
                },
            },
        );

        return config;
    },

    turbopack: {
        rules: {
            "*.svg": {
                loaders: ["@svgr/webpack"],
                as: "*.js",
            },
            // Аналог asset/resource для Turbopack: импорт возвращает URL файла.
            "*.mp4": {
                type: "asset",
            },
            "*.webm": {
                type: "asset",
            },
            "*.ogv": {
                type: "asset",
            },
            "*.mov": {
                type: "asset",
            },
            "*.m4v": {
                type: "asset",
            },
        },
    },
};

export default nextConfig;
