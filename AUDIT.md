# AUDIT — vslezax-portfolio-site

> Сжатый технический контекст проекта. Документ предназначен для передачи новому чату с ИИ: здесь описан состав проекта, принятые соглашения и известные дефекты с точными ссылками на код.
> Дата аудита: 2026-11-02; hero-анимация главной переработана (см. 5.1).

---

## 1. Что это за проект

Персональный сайт-портфолио Ярослава Журкова (бренд **vslezax**, `vslezax.vercel.app`): дизайнер/моушн-специалист, дополнительно фотограф. Сайт состоит из двух независимых полноэкранных «сцен»:

| Маршрут | Файл | Суть |
| --- | --- | --- |
| `/` | [`app/(main)/Hero.tsx`](app/(main)/Hero.tsx:1) | Hero-заставка: два полноэкранных видео (имя → «я» с перелётом), ожидание загрузки и блокировка скролла через `useHeroPreloader`; `page.tsx` только собирает сцену |
| `/photo` | [`app/photo/page.tsx`](app/photo/page.tsx:1) | Фотопортфолио: «перелистываемый» 3D-альбом из 5 экранов (Intro + 4 кейса), стрелки, прогресс-бар |

Ключевая особенность вёрстки: **всё воспроизводит макет до пикселя**. Каждый экран нарисован под дизайн-размер и масштабируется коэффициентом, который считается в рантайме из реальных размеров контейнера. Никакой адаптивной сетки, брейкпоинтов и `rem`-типографики нет.

---

## 2. Стек и версии

| Компонент | Версия / файл |
| --- | --- |
| Next.js | `16.3.5` ([`package.json`](package.json:12)) — App Router, typed routes (`LayoutProps<"/">` в [`app/layout.tsx`](app/layout.tsx:10)) |
| React / React DOM | `19.2.8` |
| TypeScript | `^5`, `strict: true`, `target: ES2017`, alias `@/* → ./*` ([`tsconfig.json`](tsconfig.json:21)) |
| Tailwind CSS | `v4` только через `@import "tailwindcss"` ([`app/globals.css`](app/globals.css:1)); реального утилитарного слоя почти нет — из Tailwind используется лишь несколько классов в прелоадере |
| Стили | CSS Modules (`*.module.css`) + один глобальный [`app/photo/layout.css`](app/photo/layout.css:1) |
| SVG | `@svgr/webpack` → SVG импортируются как React-компоненты ([`next.config.ts`](next.config.ts:4)) |
| Видео | импорт как модуль: `asset/resource` в webpack и `type: "asset"` в Turbopack ([`next.config.ts`](next.config.ts:4)); типы — [`types/media.d.ts`](types/media.d.ts:1) |
| Шрифты | `next/font/local`: CodeNext (4 начертания) и Onest ([`app/fonts.ts`](app/fonts.ts:1)) |
| Сборщик | **webpack принудительно**: `next dev --webpack` / `next build --webpack` ([`package.json`](package.json:6)) |
| Линт | ESLint 9 flat config, `eslint-config-next` core-web-vitals + typescript ([`eslint.config.mjs`](eslint.config.mjs:1)) |

Зависимостей сверх перечисленного нет: ни анимационных библиотек, ни стора, ни UI-китов. Анимации делаются двумя способами: императивная работа с `classList`/`style` (флип на `/photo`) и фазовый сценарий в React-состоянии с передачей параметров в CSS-переменные (hero на `/`).

---

## 3. Запуск

```bash
npm run dev     # next dev --webpack
npm run build   # next build --webpack
npm run start
npm run lint    # eslint
npx tsc --noEmit
```

Важно: [`next-env.d.ts`](next-env.d.ts:3) ссылается на `.next/dev/types/*`, поэтому «с чистого» клона `tsc --noEmit` падает, пока ни разу не выполнялись `dev`/`build`.

Состояние сборки на момент аудита: `npm run build` падает на [`app/photo/1/page.tsx`](app/photo/1/page.tsx:1) (проблема C1, к hero не относится). Hero проверялся production-сборкой с временно вынесенным из `app/` этим роутом; файл не изменялся и возвращён на место.

---

## 4. Карта файлов

```
app/
├── layout.tsx                     корневой layout (шрифты, metadata)
├── globals.css                    тема, переменные, --k
├── fonts.ts                       localFont: codeNext, onest
├── designtools-registry.ts        автоген (gitignore), нигде не подключается
├── (main)/                        route group → "/"
│   ├── page.tsx                   серверный: VIDEO_LOAD_TIMEOUT_MS + <Hero /> + заглушка .about
│   ├── Hero.tsx                   клиентская секция: видео/постеры модулями, refs, слои
│   ├── heroAnimation.ts           тайминги и кривая hero-анимации (единый источник)
│   ├── page.module.css            геометрия hero: старт/финал myAnimation, transition
│   ├── page.scale.module.css      ПУСТОЙ файл (импортируется намеренно)
│   ├── nameAnimation.mp4 / .webp  видео и постеры (лежат в app/, импортируются модулями)
│   └── myAnimation.webm / .webp
├── (utils)/
│   └── HeroPreloader.js           useHeroPreloader (загрузка, сценарий, скролл) + оверлей
└── photo/                         → "/photo"
    ├── page.tsx                   каркас альбома, стрелки, бары
    ├── page.module.css            вёрстка каркаса + 3D-флип
    ├── layout.css                 :root переменные страницы (--photo-page_*)
    ├── casesViewer.tsx            хуки: useCases, useCasesViewer, usePageFlip
    ├── progressBar.tsx            индикатор прогресса
    ├── useElementSize.ts          ResizeObserver-размер контейнера
    ├── arrow.svg                  иконка стрелки (SVGR)
    ├── 1/page.tsx                 МЁРТВЫЙ роут: битые импорты
    ├── _casePage/                 пустая папка (остаток отменённого дизайна)
    └── cases/
        ├── index.ts               реестр CASES = [Intro, Case1..4]
        ├── _intro/                обложка «ФОТО-ПОРТФОЛИО» (лого, линии, ссылки)
        └── case1..case4/          по одному экрану: .tsx + .module.css + image.webp
public/fonts/*.woff2               единственные статик-ассеты в public + дефолтные svg от create-next-app
types/media.d.ts                   declare module для *.mp4 / *.webm (импорт возвращает URL)
```

---

## 5. Как это работает

### 5.1 Главная `/`

Разделение ответственности:

| Файл | Роль |
| --- | --- |
| [`app/(main)/page.tsx`](app/(main)/page.tsx:1) | серверный: задаёт `VIDEO_LOAD_TIMEOUT_MS` (сколько ждём загрузку видео), рендерит `<Hero />` и заглушку `.about` (1500 px) — она и создаёт прокрутку под hero |
| [`app/(main)/Hero.tsx`](app/(main)/Hero.tsx:1) | клиентская секция: импорт видео и постеров модулями, `ref` на оба `<video>`, слои, оверлей |
| [`app/(main)/heroAnimation.ts`](app/(main)/heroAnimation.ts:1) | весь таймлайн: `NAME_ANIMATION_VANISHING_TIME`, `MY_ANIMATION_WAITING`, `MY_ANIMATION_TRANSLATION_TIME` + `_CUBIC_BEZIER`, `MY_ANIMATION_PAUSE`, `MY_ANIMATION_EXITING_TIME` + `_CUBIC_BEZIER`, производные метки в мс и готовые `transition` |
| [`app/(utils)/HeroPreloader.js`](app/(utils)/HeroPreloader.js:1) | `useHeroPreloader` — ожидание загрузки, сценарий, блокировка скролла; default export — спиннер |
| [`app/(main)/page.module.css`](app/(main)/page.module.css:1) | геометрия и состояния: `.hero` 100svh, `data-name` (`visible`/`hidden` → `opacity`), `data-my` = `waiting` / `translating` / `paused` / `exiting` / `gone` |

Сценарий [`useHeroPreloader`](app/(utils)/HeroPreloader.js:1):

1. Ждём `readyState >= 4` у обоих видео (`canplaythrough`/`canplay`/`loadeddata`) либо истечения `VIDEO_LOAD_TIMEOUT_MS` (15 000 мс, задаётся в [`page.tsx`](app/(main)/page.tsx:9)).
2. Прокрутка заблокирована (`document.body.style.overflow = "hidden"` + `overscrollBehavior = "none"`) с монтирования до фазы `done`; при размонтировании прежние значения восстанавливаются.
3. Пока hero смонтирован, на `<html>` висит класс `hide-scrollbar` (ставится и снимается в [`useHeroPreloader`](app/(utils)/HeroPreloader.js:130), CSS — [`app/globals.css`](app/globals.css:35)): скроллбар скрыт **только на главной**, прокрутка при этом работает. Это устраняет скачок ширины при снятии блокировки — в обоих состояниях скроллбара нет.
4. Незагрузившиеся файлы помечаются `failed` — `Hero` рендерит вместо них `next/image` с соответствующим постером, по каждому файлу отдельно.
5. Дальше всё считается от момента «оба видео загружены» (0 s): `nameAnimation.mp4` (2.0 с, 4K AV1, без аудио) играет сразу, по метке `NAME_ANIMATION_VANISHING_TIME` (2 s) слой гаснет до `opacity: 0` за `NAME_ANIMATION_FADE_TIME` (0.4 s).
6. `myAnimation.webm` (5.021 с, 4K AV1 + аудиодорожка **opus**) ждёт `MY_ANIMATION_WAITING` (2 s) скрытым за нижней границей окна, затем стартует и пролетает вверх за `MY_ANIMATION_TRANSLATION_TIME` (5 s) с кривой `MY_ANIMATION_TRANSLATION_CUBIC_BEZIER` до `top: 65%` + `translateY(-100%)`.
7. Стоит на месте `MY_ANIMATION_PAUSE` (1 s), затем уходит целиком за верхнюю границу (`translateY(-165%)`) за `MY_ANIMATION_EXITING_TIME` (1 s) с кривой `MY_ANIMATION_EXITING_CUBIC_BEZIER`.
8. На `HERO_SCROLL_UNLOCK_MS` (2 + 5 + 1 + 1 = 9 s по значениям по умолчанию) ставится `gone`/`done` — прокрутка разблокирована.
9. Если не загрузилось ни одно видео — слой сразу ставится в позицию `paused` с постерами, прокрутка разблокируется; при `prefers-reduced-motion` переходы отключены, но таймлайн всё равно отщёлкивает метки.

Оба видео всегда `muted` (иначе автоплей заблокирован браузером; opus-дорожка в `myAnimation.webm` — остаток исходника, владелец планирует заменить файл). Атрибута `autoPlay` нет: воспроизведением управляет хук по таймлайну. Состояние сцены передаётся в CSS двумя атрибутами (`data-name`, `data-my`), значения — из `MY_ANIMATION_STAGE`; переходы (`transition`) приходят из `heroAnimation.ts` в CSS-переменные `--name-fade-transition`, `--my-transition`, `--my-exit-transition`. Геометрия слоёв — только в `page.module.css`.

Проверено: `npm run build` + `npx next start` — SSR-HTML содержит оба `<video>` с `/_next/static/media/*.mp4|webm`, `data-name="visible"`, `data-my="waiting"` и спиннер; оба медиа-URL возвращают `200` с `video/mp4` и `video/webm`.

### 5.2 Фотогалерея `/photo`

1. [`useCasesViewer`](app/photo/casesViewer.tsx:32) хранит номер кейса `n` (1..`CASES_COUNT`), `goTo` нормализует значение по кругу.
2. [`usePageFlip`](app/photo/casesViewer.tsx:47) анимирует «страницу» императивно: `rotateY(±25deg)` за 300 мс → на середине вызывается `onMidpoint` (подмена кейса) → мгновенный перенос на противоположный угол → возврат в 0 за 600 мс. Пока идёт анимация, повторные клики игнорируются флагом `isAnimating`.
3. [`useElementSize`](app/photo/useElementSize.ts:5) меряет `.contentBodyScene`, и `width/height` передаются в текущий `Case` ([`app/photo/page.tsx`](app/photo/page.tsx:28)).
4. Каждый кейс сам считает `k = min(width/968, height/541)` и ставит CSS-переменную `--case_k` инлайн-стилем на свой корень.

### 5.3 Модель масштабирования (главная особенность проекта)

Два независимых коэффициента:

| Переменная | Где задана | Формула | Назначение |
| --- | --- | --- | --- |
| `--k` | [`app/globals.css`](app/globals.css:4) | `calc(100vw / var(--design-width))`, `--design-width: 1280` | масштаб «макета 1280 px»: бары, отступы страницы фото ([`app/photo/layout.css`](app/photo/layout.css:8)) |
| `--case_k` | инлайн в каждом кейсе | `min(width/968, height/541)` | масштаб содержимого кейса (дизайн 968×541) |

Все размеры внутри кейсов записываются как `calc(Npx * var(--case_k))`, включая шрифты. Значения по умолчанию `--case_k: 0` объявлены в каждом `*.module.css` кейса (например [`case1.module.css`](app/photo/cases/case1/case1.module.css:5)), чтобы вёрстка не «прыгала» до гидратации.

### 5.4 Шрифты и тема

- `codeNext` — основной (`--font-codenext`), подключён на `<html>` ([`app/layout.tsx`](app/layout.tsx:12)); `onest` объявлен, но его CSS-переменная на `<html>` **не навешивается** (см. проблему H2).
- В [`app/globals.css`](app/globals.css:14) обе переменные шрифтов переопределены «ручными» значениями (`'CodeNext'`, `'Onest'`) — это конфликтует с автогенерируемыми `next/font` и зависит от порядка каскада.
- Палитра: `--main-white: #F2F3F8`, `--white`, `--black`; доступна в Tailwind через `@theme inline` (`bg-main-white` и т. п.).
- В кейсах встречаются «локальные» хардкод-цвета (`#C74F4A`, `#1C1C1C`, `#D8D8D8`) и инлайновые градиенты.

---

## 6. Соглашения кода

- Стили — только CSS Modules рядом с компонентом; **длинные «пути» классов** (`contentBodyScene`, `bigTextInsideInsideContainer`) вместо вложенности; глобальный CSS — исключение, только для `:root`-переменных ([`app/photo/layout.css`](app/photo/layout.css:1)).
- Все кейсы и страницы, использующие хуки, помечены `"use client"`; `cases/index.ts` — общий реестр, порядок массива = порядок листания.
- Тип пропсов кейса один: `CaseProps = { width: number; height: number }` ([`app/photo/cases/index.ts`](app/photo/cases/index.ts:8)), все кейсы дублируют эту сигнатуру вручную.
- Комментарии в коде — по-русски, часто в формате «`/* */`-баннеров»; тексты интерфейса тоже русские (`lang="ru"`).
- Импорты ассетов — статические (`import image from "./image.webp"`); внешние URL и `public/` не используются. Hero-видео тоже импортируются модулями — **из клиентского компонента**, см. [`app/(main)/Hero.tsx`](app/(main)/Hero.tsx:12) и раздел 7.5.
- Route groups `(main)` и `(utils)` используются не по назначению: `(utils)` — это фактически папка компонентов (импорт вида `'./../(utils)/HeroPreloader'` в [`app/(main)/Hero.tsx`](app/(main)/Hero.tsx:6)).

---

## 7. Известные проблемы

### 7.1 Критическое

**C1. Битые импорты в мёртвом роуте → сборка/типы падают.**
[`app/photo/1/page.tsx`](app/photo/1/page.tsx:1) импортирует `@/components/casePageShell` и `@/components/case1Bento`. Каталога `components/` в проекте нет (`@/*` указывает в корень), поэтому `next build` и `tsc` выдают «Cannot find module». Рядом пустая папка `app/photo/_casePage/` — остатки отменённого дизайна страницы кейса.
_Следствие:_ `npm run build` не проходит целиком (hero при этом собирается и работает — проверено отдельно).
_Решение:_ удалить `app/photo/1/` и `app/photo/_casePage/` либо создать недостающие компоненты.

### 7.2 Высокие

**H1. 3D-флип не включает перспективу: класс не совпадает.**
[`usePageFlip`](app/photo/casesViewer.tsx:61) добавляет литеральный класс `flipping` через `classList`, а CSS-правила объявлены в CSS-модуле ([`page.module.css`](app/photo/page.module.css:214) и [`строка 231`](app/photo/page.module.css:231)), где имена хешируются. Совпадения нет → `perspective`, `transform-style: preserve-3d`, `backface-visibility` и `will-change` **никогда не применяются**; `rotateY` без перспективы выглядит как горизонтальное сжатие.
_Решение:_ в CSS использовать `:global(.flipping)` либо добавлять `styles.flipping` (и передавать его в хук).

**H2. Шрифт Onest нигде не активен.**
[`app/layout.tsx`](app/layout.tsx:12) навешивает только `${codeNext.variable}`, переменная `onest.variable` ([`app/fonts.ts`](app/fonts.ts:17)) в разметку не попадает. При этом [`globals.css`](app/globals.css:15) объявляет `--font-onest: 'Onest', sans-serif` — семейства с таким именем в CSS нет (`localFont` генерирует собственное), поэтому всё, что просит `var(--font-onest)` (регистр `®`, слэши, микротипографика в кейсах), падает в системный sans-serif. Аналогичный риск есть у `--font-codenext` ([`строка 14`](app/globals.css:14)): переопределение может выиграть у сгенерированного значения в зависимости от порядка каскада.

**H3. Навигации между страницами нет.**
- С главной на `/photo` ссылки нет ни в одной форме.
- Блок «вернуться на главную» на странице фото — это `<div>` ([`app/photo/page.tsx`](app/photo/page.tsx:75)), а не ссылка; в коде оставлен комментарий «было `<Link>`, стало `<div>`» ([`строка 37`](app/photo/page.tsx:37)).
- `.contentBody` имеет `cursor: pointer` ([`page.module.css`](app/photo/page.module.css:226)), но обработчика клика нет — ложная аффордансность.
_Решение:_ вернуть `next/link` на оба направления, убрать лишний `cursor`.

**H4. Таймеры в `usePageFlip` не отменяются при размонтировании.**
[`casesViewer.tsx:70`](app/photo/casesViewer.tsx:70) и [`строка 80`](app/photo/casesViewer.tsx:80) создают `setTimeout` без сохранения id; cleanup-эффект ([`строки 92–103`](app/photo/casesViewer.tsx:92)) только сбрасывает инлайн-стили. При уходе со страницы в середине анимации `onMidpoint` вызовет `setState` у размонтированного компонента, а элементы останутся с инлайн-транзишенами.

### 7.3 Средние

**M1. Невалидный CSS-цвет.** [`case3.module.css`](app/photo/cases/case3/case3.module.css:34): `linear-gradient(to left, rgba(.1, .1, .1, 1), rgba(.1, .1, .1, 0))` — `rgba()` с дробными каналами без `%`; правило отбрасывается, тень не отображается.

**M2. Прогресс-бар показывает 0 % на первом кейсе.** [`progressBar.tsx`](app/photo/progressBar.tsx:17) считает `(value-1)/(total-1)*100`, то есть первый экран — пустая полоса. Для «точки-индикатора» логика ок, для полосы загрузки — визуальный баг.

**M3. Модель масштабирования хрупкая и продублирована.**
- `--k` считается только от ширины ([`globals.css:5`](app/globals.css:5)) — на широком низком окне верхние бары фото-страницы раздуваются; вертикаль нигде не учитывается.
- Формула `Math.min(width/968, height/541)` + константы `DESIGN_W/DESIGN_H` скопированы в _пять_ файлов (`_intro.tsx`, `case1..case4.tsx`) — любое изменение дизайн-размера нужно вносить пять раз.
- `useElementSize` стартует с `{0, 0}` ([`useElementSize.ts:6`](app/photo/useElementSize.ts:6)), поэтому первый кадр кейса рендерится с `--case_k: 0` (все размеры 0 px) → заметный «схлопнутый» кадр/скачок до срабатывания `ResizeObserver`.

**M4. Дублирующиеся правила в `page.module.css`.** `.contentBody` объявлен дважды — [строки 19–37](app/photo/page.module.css:19) и [219–228](app/photo/page.module.css:219); `filter: var(--photo-page_contentDropShadowFilter)` из первого блока продолжает действовать, геометрия берётся из второго. Из-за этого трудно предсказать каскад.

**M5. Мусор от внешних инструментов.** [`app/designtools-registry.ts`](app/designtools-registry.ts:1) автогенерируется плагином `@designtools/next-plugin` (в `package.json` его нет), добавлен в `.gitignore` ([`.gitignore:44`](.gitignore:44)) и нигде не импортируется, хотя комментарий в файле утверждает, что монтируется в `layout`. Похожий след — каталог `.moldui/` (pending visual edits от стороннего tool). Реестр пуст и безопасен, но создаёт впечатление подключённой интеграции.

**M6. Двойная конфигурация бандлера.** [`next.config.ts`](next.config.ts:4) содержит и `webpack()`, и `turbopack.rules` для SVG и видео, но скрипты форсируют webpack. Turbopack-ветка (`as: "*.js"` для SVG, `type: "asset"` для медиа) не проверена; любые изменения пайплайна ассетов нужно вносить в оба места.

**M7. Вес ассетов.** Hero-видео (`nameAnimation.mp4` 2 с, `myAnimation.webm` 5 с, оба **4K AV1**) лежат внутри `app/`, копируются в репозиторий и попадают в первую загрузку (постер-first помогает, но `preload="auto"` тянет видео целиком). Кейсы используют `webp` без `sizes`/`quality`. Стоит пережать/уменьшить 4K-исходники и рассмотреть 720p/1080p варианты.

### 7.4 Низкие / гигиена

- **L1.** [`README.md`](README.md:1) — нетронутый шаблон create-next-app (упоминает Geist и `app/page.tsx`, которых нет).
- **L2.** Доступность: декоративные SVG (`ArrowIcon`, `Lines`, `MicroGraphic`) без `aria-hidden`; `alt={''}` вместо `alt=""`; прокрутка блокируется на время анимации (по дизайну, но без альтернативы для клавиатуры).
- **L3.** Route groups используются как папки: `(utils)` — компоненты, `(main)` — единственная страница, при этом `/photo` лежит отдельно. Импорт `'./../(utils)/HeroPreloader'` неочевиден.
- **L4.** [`HeroPreloader.js`](app/(utils)/HeroPreloader.js:1) — `.js` без типов при `strict: true`; контракт хука описан только JSDoc, а не TypeScript. Кандидат на переименование в `.tsx`.
- **L5.** Метаданные: только глобальные в [`layout.tsx`](app/layout.tsx:5); нет `viewport`-экспорта, OG-картинок, метаданных для `/photo`.
- **L6.** Нет тестов, CI, Prettier-конфига и husky; линт — единственная проверка.
- **L7.** [`casesViewer.tsx:35`](app/photo/casesViewer.tsx:35): `CASES[n - 1]` без защиты от выхода за границы (сейчас безопасно только благодаря нормализации в `goTo`).
- **L8.** Абсолютное позиционирование каркаса фото-страницы опирается на то, что ни один предок не позиционирован: `.main` без `position` ([`page.module.css:1`](app/photo/page.module.css:1)), `.content` и бары — `position: absolute` ([строки 8, 89, 137](app/photo/page.module.css:8)). Любой `transform`/`position: relative` на `body`/обёртке сломает центрирование.
- **L9.** В [`case3.module.css:13`](app/photo/cases/case3/case3.module.css:13) два контейнера `width: 50%; height: 50%` внутри экрана 968×541 — размеры не соответствуют макету, содержимое нижнего блока визуально «выпадает»; стоит перепроверить по дизайну.
- **L10.** Мелочи: пустой [`app/photo/_casePage/`](app/photo/_casePage), мёртвые дефолтные иконки в `public/` (`next.svg`, `vercel.svg`, `file.svg`, `globe.svg`, `window.svg`), лишняя точка с запятой `;;` в [`_intro.module.css:233`](app/photo/cases/_intro/_intro.module.css:233) и [`case2.module.css:54`](app/photo/cases/case2/case2.module.css:54).
- **L11.** В [`app/(main)/page.tsx`](app/(main)/page.tsx:13) остаётся `` className={`${page.main} ${scale}`} ``, где `scale` — объект CSS-модуля: в SSR-HTML попадает класс `[object Object]`. Оставлено осознанно по решению владельца; безвредно, но мусорно. Пустой [`app/(main)/page.scale.module.css`](app/(main)/page.scale.module.css:1) тоже сохранён намеренно.

### 7.5 Исправлено в итерации «hero-анимация»

Закрыты бывшие C2, C3 и часть M6/M7 из первой версии аудита:

**Прелоадер.** Старый `HeroPreloader` рендерил `children` только после загрузки, поэтому `<video>` отсутствовали в DOM, `querySelectorAll` находил пустой список и ожидание мгновенно «завершалось». Теперь дети рендерятся всегда, а ожидание работает через `ref` на реальные элементы; спиннер — отдельный fixed-оверлей ([`app/(utils)/HeroPreloader.js`](app/(utils)/HeroPreloader.js:1)).

**Источники видео.** Было: `/nameAnimation.mp4` и `/myAnimation.webm` — файлы лежат в `app/(main)/`, Next их не раздаёт (404), плюс `type="video/webm; codecs=av1"` с несуществующим идентификатором кодека. Стало: импорт модулями и `type="video/mp4"` / `video/webm`. Правила сборки — [`next.config.ts`](next.config.ts:4) (`asset/resource` для webpack, `type: "asset"` для Turbopack), типы — [`types/media.d.ts`](types/media.d.ts:1).

**Подводный камень (важно для будущих правок):** импортировать медиа нужно **из клиентского** (`"use client"`) модуля. Импорт из серверного `page.tsx` эмитит файл в `.next/server/chunks/static/media`, а URL при этом указывает на `.next/static/media` → в production 404. Именно поэтому видео лежат в [`Hero.tsx`](app/(main)/Hero.tsx:1).

**Поведение.** Добавлена сама анимация по таймлайну: `nameAnimation` играет и гаснет, `myAnimation` ждёт, пролетает снизу вверх, стоит и уходит за верхнюю границу; прокрутка заблокирована до конца ухода, незагрузившиеся видео подменяются постерами по истечении `VIDEO_LOAD_TIMEOUT_MS`. Все тайминги, кривые и готовые `transition` вынесены в [`app/(main)/heroAnimation.ts`](app/(main)/heroAnimation.ts:1); компоненты только читают их и передают в CSS-переменные.

**Дубли конфигурации бандлера (M6).** Медиа-правила добавлены в обе ветки (`webpack` + `turbopack`), но проверена только webpack-ветка — сборка форсируется через `--webpack`.

---

## 8. Приоритетный план работ

1. **Сборка:** удалить `app/photo/1/` + `_casePage/` (C1) — без этого `build`/`tsc` не проходят.
2. **Главная:** ✅ сделано — hero-анимация собрана заново (5.1). Осознанно оставлено: `${scale}` в `page.tsx` и пустой `page.scale.module.css`.
3. **Флип:** `:global(.flipping)` + отмена таймеров (H1, H4).
4. **Шрифты:** навесить `onest.variable`, убрать ручные переопределения `--font-*` из `globals.css` (H2).
5. **Навигация:** `next/link` в обе стороны, убрать ложный `cursor` (H3).
6. **Рефакторинг масштабирования:** вынести `useCaseScale` / `DESIGN_W,H` в общий модуль, инициализировать `--case_k` значением из CSS до первого измерения (M3).
7. Гигиена: README, `.moldui`/`designtools`, чистка дублей CSS, `rgba()` в case3 (M1, M4–M7, L1–L11).
8. **Hero, полировка:** дождаться замены `myAnimation.webm` на версию без аудиодорожки; при желании пересжать 4K-исходники и убрать `[object Object]` из `page.tsx` (L11).

---

## 9. Правила для ИИ-агентов

- Это **Next.js 16** с изменёнными API. Перед правками читать гайды в `node_modules/next/dist/docs/` (в частности про App Router, typed routes и `LayoutProps`/`PageProps`), не полагаться на память о Next 13–15.
- Не редактировать автогенерируемые файлы: [`app/designtools-registry.ts`](app/designtools-registry.ts:1) и [`next-env.d.ts`](next-env.d.ts:1).
- Блок `<!-- BEGIN:nextjs-agent-rules -->` в [`AGENTS.md`](AGENTS.md:1) перезаписывается `next dev`; при коммите его нужно сохранять, иначе в дереве останется незакоммиченное изменение.
- Сборка идёт только через webpack (`--webpack` в скриптах). Новые loaders/rules добавлять в [`next.config.ts`](next.config.ts:4) и учитывать обе ветки (`webpack` + `turbopack`).
- Видео и прочие крупные медиа импортировать **только из клиентских модулей**; тайминги hero-анимации менять в [`app/(main)/heroAnimation.ts`](app/(main)/heroAnimation.ts:1), геометрию — в [`app/(main)/page.module.css`](app/(main)/page.module.css:1), не дублировать их в компонентах.
- Скрытие скроллбара на главной — это класс `hide-scrollbar` на `<html>` из [`useHeroPreloader`](app/(utils)/HeroPreloader.js:130) (CSS в [`app/globals.css`](app/globals.css:35)), обязательно со снятием в cleanup, иначе полоса пропадёт на `/photo`. Подход `scrollbar-gutter: stable` владельцем отвергнут: он меняет ширину лэйаута на всех страницах. Блокировку прокрутки делать через `body.style.overflow`, не через `position: fixed` на `body`.
- Стили — CSS Modules; не добавлять Tailwind-классы в основной UI без необходимости (в проекте принят «ручной» пиксельный CSS).
- Все новые размеры внутри кейсов писать как `calc(Npx * var(--case_k))`, не «голыми» пикселями, иначе экран перестанет масштабироваться.
- Тексты в UI и комментарии — на русском; код и идентификаторы — на английском.
