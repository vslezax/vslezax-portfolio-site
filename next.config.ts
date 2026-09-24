import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Конфигурация для Webpack
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack"],
        });
        return config;
    },

    // Конфигурация для Turbopack (на случай, если запустите с --turbopack)
    turbopack: {
        rules: {
            "*.svg": {
                loaders: ["@svgr/webpack"],
                as: "*.js",
            },
        },
    },
};

export default nextConfig;