# Pixel Seed - 基于 AI 生成的 2D 像素风网页游戏

## 项目概述
“用一粒 AI 种子，生长无限像素世界”
Pixel Seed 是一款实验性 2D 像素风网页游戏，核心创新在于：游戏内容完全由用户输入的“种子”（主题/提示词）驱动。用户无需美术基础，仅需选择预设主题（如史诗魔幻、赛博朋克）或输入自定义提示词，系统即调用大模型生成专属的像素风角色形象和关卡背景，动态构建游戏世界。这验证了 AI 作为“创造源头”的潜力——将提示词转化为可玩的像素宇宙。 

### 1. 项目背景
传统像素游戏开发受限于美术资源制作周期长、风格固化。随着AI图像生成技术的发展，尤其是大模型在风格化图像生成上的突破，我们有机会构建一个“AI即内容引擎”的游戏平台。  
**Pixel Seed** 旨在通过大语言模型 + 图像生成模型，实现“输入一个种子（Seed），生成一个世界”的愿景——用户只需选择或输入一个主题，即可获得风格一致的像素游戏角色与场景，快速进入可玩的游戏体验。

### 2. 项目目标
- 实现“AI生成+即时游戏化”的闭环流程。
- 验证使用大模型生成高质量、风格统一的像素美术资源的可行性。
- 构建可扩展的架构，支持未来加入更多游戏玩法、主题风格和交互机制。

### 3. 核心理念
> **“A Seed, A World.”**  
> 每一次生成，都是一次独特的创造。AI 是世界的“种子”，玩家是世界的“探索者”。

## 功能需求

### 1. 主题选择系统

#### 1.1 预设主题
- **史诗魔幻**：包含魔法、龙、城堡、森林等元素
- **赛博朋克**：包含霓虹灯、机械、未来城市等元素

#### 1.2 自定义主题
- 用户可手动输入提示词
- 支持中英文输入
- 提供提示词建议和示例

### 2. AI内容生成系统

#### 2.1 角色生成
- 基于选定主题生成像素风角色形象
- 支持主角、NPC、敌人等不同类型角色
- 生成多个动作帧（行走、跳跃、攻击等）

#### 2.2 关卡背景生成
- 生成符合主题的关卡背景
- 包含前景、中景、背景层次
- 支持不同关卡类型（地面、地下、空中等）

### 3. 游戏玩法系统

#### 3.1 游戏渲染方案
- **Canvas方案**：使用HTML5 Canvas绘制角色和背景
- **CSS方案**：使用div + CSS background-image展示图像
- **混合方案**：背景使用CSS，角色使用Canvas（推荐）

#### 3.2 基础交互功能
- **角色显示**：生成的角色图像居中或左侧显示
- **背景展示**：生成的背景作为游戏场景
- **基础动画**：
  - 角色idle呼吸效果（缩放动画）
  - 背景轻微滚动效果
- **角色移动**：
  - 左右移动（键盘 ← → 键）
  - 跳跃动作（空格键）
  - 平滑的位置过渡

#### 3.3 技术实现细节
- **静态场景**：无碰撞检测，无敌人系统
- **键盘监听**：addEventListener监听keydown/keyup事件
- **动画循环**：requestAnimationFrame实现流畅动画
- **状态管理**：角色位置、动画状态的实时更新

#### 3.4 验证目标
- **核心目标**：验证"生成资源可立即用于游戏"的可行性
- **当前阶段**：仅验证"生成即游戏"概念
- **功能范围**：基础展示 + 简单交互，不涉及复杂游戏逻辑

### 4. 用户界面

#### 4.1 主菜单
- 开始游戏
- 主题选择
- 设置选项
- 关于页面

#### 4.2 主题选择界面
- 预设主题卡片展示
- 自定义输入框
- 生成预览功能
- 确认开始按钮

#### 4.3 游戏界面
- **游戏画布**：Canvas或CSS容器展示游戏内容
- **控制提示**：显示操作说明（← → 移动，空格跳跃）
- **重新生成按钮**：快速生成新的角色和背景
- **返回主菜单按钮**
- **移动端适配**：触屏控制按钮（可选）

#### 4.4 加载界面
- AI生成进度显示
- 生成状态提示
- 预览图展示

#### 4.5 游戏画布技术规格
- **Canvas尺寸**：1200x600px（可响应式调整）
- **角色位置**：初始位置(100, 400)，可在x轴200-1000范围移动
- **背景处理**：拉伸或平铺适配画布尺寸
- **动画帧率**：60fps目标，使用requestAnimationFrame

## 技术架构

### 前端技术栈
- **框架**：Next.js 14+
- **样式**：Tailwind CSS
- **游戏渲染**：HTML5 Canvas 或 div + CSS background
- **状态管理**：Zustand 或 Redux Toolkit
- **UI组件**：Radix UI 或 Headless UI
- **HTTP客户端**：Axios 或 Fetch API
- **动画库**：Framer Motion 或 CSS Animations

### 后端技术栈
- **API路由**：Next.js API Routes
- **数据库**：PostgreSQL + Prisma ORM
- **文件存储**：AWS S3 或 Cloudinary
- **缓存**：Redis（可选）
- **队列处理**：Bull Queue（处理AI生成任务）

### AI集成
- **图像生成模型**：Qwen-Image (通过DashScope API)
- **API端点**：https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation
- **认证方式**：Bearer Token (API Key: sk-84083f55216c4c53ad9ebf77e3f2dc7f)
- **调用方式**：HTTP同步接口，发送POST请求后立即返回结果
- **图像处理**：Sharp.js 进行格式转换和优化
- **并发控制**：Promise.all 并行处理角色和背景生成
- **参考文档**：GitHub - https://github.com/QwenLM/Qwen-Image

### DashScope API集成细节
- **请求头配置**：
  - Content-Type: application/json
  - Authorization: Bearer sk-84083f55216c4c53ad9ebf77e3f2dc7f
- **请求体结构**：使用messages数组格式，支持prompt_extend自动优化
- **参数配置**：
  - negative_prompt: 负面提示词（可选）
  - prompt_extend: true（启用提示词扩展优化）
  - watermark: false（关闭水印）
  - size: 支持多种尺寸（1328*1328, 1920*1080等）
- **错误处理**：实现重试机制和API限流处理

## AI生成流程设计

### 生成流程时序图
```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant QwenImage
    User->>Frontend: 点击"生成"
    Frontend->>Backend: POST /api/generate (含提示词)
    Backend->>Backend: 拆分请求
    Backend->>QwenImage: 调用角色生成API
    QwenImage-->>Backend: 返回角色图
    Backend->>QwenImage: 调用背景生成API
    QwenImage-->>Backend: 返回背景图
    Backend-->>Frontend: 统一响应 {character, background}
    Frontend->>User: 显示预览 + "开始游戏"按钮
```

### 详细实现流程

#### 1. 前端交互流程
1. **用户选择主题**：用户在主题选择界面选择预设主题或输入自定义提示词
2. **点击生成按钮**：触发生成请求，显示加载状态
3. **实时进度显示**：通过WebSocket或轮询显示生成进度
4. **预览展示**：生成完成后展示角色和背景预览
5. **确认开始**：用户确认满意后点击"开始游戏"按钮

#### 2. 后端处理流程
1. **请求接收**：接收前端POST请求，验证参数
2. **提示词构建**：根据主题和用户输入构建具体的提示词
3. **并行生成**：同时调用DashScope Qwen-Image API生成角色和背景
   - 使用Bearer Token认证 (sk-84083f55216c4c53ad9ebf77e3f2dc7f)
   - 发送HTTP POST请求到DashScope端点
   - 角色生成使用1328*1328尺寸，背景生成使用1920*1080尺寸
4. **图像处理**：对生成的图像进行格式转换和优化
5. **资源存储**：将生成的图像上传到云存储
6. **响应返回**：返回包含角色和背景URL的统一响应

#### 3. 错误处理机制
- **生成失败重试**：自动重试机制，最多3次
- **部分失败处理**：角色或背景单独失败时的降级策略
- **超时处理**：设置合理的超时时间，避免长时间等待
- **用户友好提示**：清晰的错误信息和重新生成选项

## AI生成内容规范

### 1. 图像规格
- **分辨率**：角色 1328x1328px（可后期裁剪为32x32px），背景 1920x1080px
- **格式**：PNG（支持透明度）
- **色彩**：由AI模型自动生成，支持像素艺术风格调色板
- **风格**：像素艺术风格（通过prompt_extend参数优化）
- **水印**：关闭水印（watermark: false）

### 2. 生成接口设计

#### 2.1 统一生成接口
```
POST /api/generate
{
  "theme": "epic-fantasy" | "cyberpunk" | "custom",
  "prompt": "string",
  "characterType": "player" | "enemy" | "npc",
  "levelType": "ground" | "underground" | "sky"
}

Response:
{
  "success": boolean,
  "data": {
    "character": {
      "url": "string",
      "actions": {
        "idle": "string",
        "walk": "string",
        "jump": "string",
        "attack": "string"
      }
    },
    "background": {
      "url": "string",
      "layers": {
        "background": "string",
        "midground": "string",
        "foreground": "string"
      }
    }
  },
  "generationId": "string",
  "timestamp": "string"
}
```

#### 2.2 DashScope Qwen-Image调用接口
```
// 角色生成调用
POST https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation
Headers:
  Content-Type: application/json
  Authorization: Bearer sk-84083f55216c4c53ad9ebf77e3f2dc7f

Body:
{
  "model": "qwen-image",
  "input": {
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "text": "pixel art character, {theme} style, {characterType}, {specific_prompt}"
          }
        ]
      }
    ]
  },
  "parameters": {
    "negative_prompt": "",
    "prompt_extend": true,
    "watermark": false,
    "size": "1328*1328"
  }
}

// 背景生成调用
同样的API端点和Headers，Body中的text内容为：
"pixel art landscape, {theme} world, {levelType}, {specific_prompt}"
参数中size可调整为 "1920*1080" 用于背景生成
```

### 3. 提示词模板

#### 史诗魔幻主题
- 角色："pixel art character, fantasy style, {characterType}, medieval armor, magical elements"
- 背景："pixel art landscape, fantasy world, {levelType}, castles, forests, magical atmosphere"

#### 赛博朋克主题
- 角色："pixel art character, cyberpunk style, {characterType}, neon colors, futuristic clothing"
- 背景："pixel art cityscape, cyberpunk world, {levelType}, neon lights, skyscrapers, dark atmosphere"

## 后续扩展计划

### 短期扩展
- 更多预设主题
- 基础碰撞检测
- 简单的收集元素
- 音效生成集成

### 长期扩展
- 完整游戏引擎集成（Phaser.js）
- 多关卡系统
- 敌人和障碍物
- 分数和成就系统
