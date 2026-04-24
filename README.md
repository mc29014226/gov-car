# 公務車里程記錄系統

這個版本可直接放到 GitHub，並用 Netlify 部署，資料庫使用 Supabase。

## 專案結構

- `index.html`：主畫面
- `netlify.toml`：Netlify 設定
- `netlify/functions/ocr-km.js`：儀表板里程 OCR 代理
- `supabase/schema-demo.sql`：Supabase 初始化 SQL（快速可跑版）
- `.devcontainer/devcontainer.json`：GitHub Codespaces 設定

## 你要做的事

### 1. 建 GitHub Repo
把整個資料夾內容推到新的 GitHub repository。

### 2. 建 Supabase 專案
1. 新建一個 Supabase project
2. 到 SQL Editor 執行 `supabase/schema-demo.sql`
3. 到 `Project Settings -> API` 複製：
   - Project URL
   - anon key

### 3. 建 Netlify 專案
1. 在 Netlify 選 `Add new project`
2. 選 `Import an existing project`
3. 連接你的 GitHub repo
4. 這個專案是靜態站，`publish` 直接用 `.` 即可

### 4. 設 Netlify 環境變數
到 Netlify 專案設定加入：

- `ANTHROPIC_API_KEY`：你的 Anthropic API key

### 5. 上線後第一次設定
打開網站後，到「資料庫設定」頁面，填入：
- Supabase URL
- Supabase Anon Key

這兩個值目前會存在瀏覽器 localStorage。

## Codespaces 使用方式

建立 codespace 後，終端機執行：

```bash
npm install
npm run netlify:dev
```

之後會在 Codespaces 開一個預覽網址。

如果你只想看純前端，不測試 Netlify Function：

```bash
npm run dev
```

## 重要提醒

1. 你原本的 `index.html` 直接從瀏覽器呼叫 Anthropic API，不適合正式上線，因為 API key 不能放前端。
2. 我已經把 OCR 改成走 `netlify/functions/ocr-km.js`。
3. `schema-demo.sql` 是「快速可跑版」，安全性偏低，正式使用建議再加登入與更嚴格的 RLS。
