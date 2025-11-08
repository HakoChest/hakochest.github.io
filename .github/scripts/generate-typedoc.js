#!/usr/bin/env node
/**
 * TypeDoc Generation Script
 * 从 typedoc-config.json 读取配置，自动生成 TypeDoc 文档
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const config = JSON.parse(fs.readFileSync('typedoc-config.json', 'utf8'));
const combinedOutputDir = path.join(process.cwd(), 'combined-output');

// 确保输出目录存在
if (!fs.existsSync(combinedOutputDir)) {
  fs.mkdirSync(combinedOutputDir, { recursive: true });
}

config.forEach((item, index) => {
  console.log(`\n=== [${index + 1}/${config.length}] Generating TypeDoc for ${item.package} ===`);

  const buildDir = path.join('/tmp', `typedoc-build-${index}`);
  const outputDir = path.join(combinedOutputDir, item.deployPath);

  try {
    // 创建构建目录
    if (!fs.existsSync(buildDir)) {
      fs.mkdirSync(buildDir, { recursive: true });
    }

    // 下载包
    console.log(`📦 Downloading ${item.package}...`);
    execSync(`npm install --no-save ${item.package}`, {
      cwd: buildDir,
      stdio: 'inherit',
    });

    const pkgPath = path.join(buildDir, 'node_modules', item.package);
    const entryPoint = item.entryPoints[0];
    const fullEntryPath = path.join(pkgPath, entryPoint);

    // 验证入口点存在
    if (!fs.existsSync(fullEntryPath)) {
      console.error(`❌ Entry point not found: ${entryPoint}`);
      console.log(`📂 Available files:`);
      execSync(`ls -la`, { cwd: pkgPath, stdio: 'inherit' });
      process.exit(1);
    }

    // 创建输出目录
    fs.mkdirSync(outputDir, { recursive: true });

    // 构建 TypeDoc 配置
    const typedocConfig = {
      out: outputDir,
      entryPoints: [fullEntryPath],
      excludeExternals: false,
      treatWarningsAsErrors: false,
      highlightLanguages: ['typescript', 'bash', 'json', 'vue', 'javascript'],
      skipErrorChecking: true,
    };

    // 包含 README 如果存在
    const readmePath = path.join(pkgPath, 'README.md');
    if (fs.existsSync(readmePath)) {
      typedocConfig.readme = readmePath;
    }

    // 写入配置文件
    const configPath = path.join(buildDir, 'typedoc.json');
    fs.writeFileSync(configPath, JSON.stringify(typedocConfig, null, 2));

    // 生成文档
    console.log(`📚 Generating TypeDoc...`);
    execSync(`typedoc --config ${configPath}`, { stdio: 'inherit' });

    console.log(`✅ Successfully generated at /${item.deployPath}`);
  } catch (error) {
    console.error(`❌ Error:`, error.message);
    process.exit(1);
  } finally {
    // 清理临时文件
    if (fs.existsSync(buildDir)) {
      try {
        execSync(`rm -rf ${buildDir}`, { stdio: 'pipe' });
      } catch (e) {
        // 忽略清理错误
      }
    }
  }
});

console.log('\n✨ All TypeDoc documentation generated successfully!');
