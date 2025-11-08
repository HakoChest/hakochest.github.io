# TypeDoc 自动化部署配置

## 📋 概述

这个系统允许你通过简单的配置文件 `typedoc-config.json` 来管理多个 npm 包的 TypeDoc 文档自动生成和部署。

## 🔧 配置说明

### `typedoc-config.json` 格式

```json
[
  {
    "package": "@osynicite/osynic-osuapi",
    "deployPath": "osynic-osuapi",
    "entryPoints": ["./osynic_osuapi.d.ts"],
    "description": "Osynic OSU API TypeScript Definitions"
  },
  {
    "package": "@另一个包/包名",
    "deployPath": "another-path",
    "entryPoints": ["./index.d.ts"],
    "description": "另一个包的文档"
  }
]
```

### 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `package` | string | npm 包的完整名称 |
| `deployPath` | string | 部署到 GitHub Pages 的相对路径（相对于根目录） |
| `entryPoints` | string[] | TypeScript 定义文件的路径（相对于包根目录） |
| `description` | string | 对该文档的描述（可选） |

## 🚀 工作流程

### 1. 主部署工作流 (`gh-pages.yml`)

**触发条件：** 推送到 `main` 分支

**工作流步骤：**
1. ✅ 检出代码
2. ✅ 安装 Node.js 依赖
3. ✅ 构建 Vue 主页
4. ✅ 构建 mdbook 文档
5. ✅ **自动生成 TypeDoc 文档**（根据 `typedoc-config.json`）
6. ✅ 合并所有输出到 `combined-output/`
7. ✅ 部署到 GitHub Pages

### 2. 独立 TypeDoc 更新工作流 (`typedoc-update.yml`)

**触发条件：** 
- 手动触发（`workflow_dispatch`）
- 每天 UTC 早上 8 点自动运行

**工作流步骤：**
1. ✅ 检出代码
2. ✅ 安装 TypeDoc
3. ✅ 读取 `typedoc-config.json`
4. ✅ 为每个配置的包生成 TypeDoc
5. ✅ 输出到 `combined-output/` 目录
6. ✅ 生成工件供下载

## 📦 部署结构

生成的 GitHub Pages 结构如下：

```
https://hakochest.github.io/
├── index.html                    # Vue 主页
├── assets/                       # Vue 资源
├── book/                         # 默认 mdbook
├── gxci-cn/                      # GXCI 中文文档
├── gxci-en/                      # GXCI 英文文档
├── vielpork-cn/                  # Vielpork 中文文档
├── vielpork-en/                  # Vielpork 英文文档
└── osynic-osuapi/                # TypeDoc 文档（自动生成）
    ├── index.html
    ├── modules.html
    ├── classes/
    ├── interfaces/
    ├── functions/
    └── assets/
```

## 🔄 如何添加新的 TypeDoc 文档

1. **编辑 `typedoc-config.json`：**

   ```json
   [
     {
       "package": "@osynicite/osynic-osuapi",
       "deployPath": "osynic-osuapi",
       "entryPoints": ["./osynic_osuapi.d.ts"],
       "description": "Osynic OSU API"
     },
     {
       "package": "@neworg/newpackage",
       "deployPath": "new-docs",
       "entryPoints": ["./index.d.ts"],
       "description": "新包的文档"
     }
   ]
   ```

2. **推送到 `main` 分支：**
   - 下次部署时会自动生成新文档

3. **或手动触发：**
   - 在 GitHub Actions 页面 → "Update TypeDoc Documentation" → "Run workflow"

## ⚙️ 配置项要求

### `entryPoints` 路径

- 必须是相对于包根目录的相对路径
- 对于 WASM 库，文件通常在根目录（如 `./osynic_osuapi.d.ts`）
- 对于常规库，可能在 `./src/index.d.ts` 或 `./dist/index.d.ts`

### 查找正确的 `entryPoints`

安装包后，可以在 `node_modules/@org/package/` 中查找 `.d.ts` 文件：

```bash
npm install @org/package
ls node_modules/@org/package/*.d.ts
```

## 🔍 故障排除

### 1. TypeDoc 生成失败

**检查日志：**
- 在 GitHub Actions 页面查看工作流运行日志
- 查看 "Generate TypeDoc documentation" 步骤的输出

**常见问题：**
- ❌ `entryPoints` 路径错误
  - 解决：在 npm 包中找到实际的 `.d.ts` 文件位置

- ❌ 包不存在或私有
  - 解决：确保包名正确且包是公开的

### 2. 文档没有在预期位置显示

**检查：**
- 确认 `deployPath` 在 `typedoc-config.json` 中正确设置
- 查看工作流日志中的 "Verify combined output structure" 部分

## 🎯 最佳实践

1. **保持配置有序：** 使用清晰的 `deployPath` 名称
2. **测试新配置：** 手动运行 `typedoc-update` 工作流进行测试
3. **监控 GitHub Pages：** 在部署后访问对应 URL 确认文档可用
4. **定期更新：** 工作流每天自动运行一次，保持文档最新

## 📚 更新主页导航

当添加新文档时，别忘了更新 `src/App.vue` 中的链接！

示例：
```vue
<a href="/new-docs/">New Documentation</a>
```

## 🔗 相关文件

- `typedoc-config.json` - TypeDoc 包配置
- `.github/workflows/gh-pages.yml` - 主部署工作流
- `.github/workflows/typedoc-update.yml` - 独立 TypeDoc 更新工作流
- `src/App.vue` - 主页导航
