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

#### 3.2 基础交互功能 (已实现)
- **角色显示**：使用绝对定位在游戏区域显示角色
- **背景展示**：CSS背景图片作为游戏场景
- **基础动画**：
  - 角色方向翻转（左右移动时scaleX变化）
  - 平滑的位置过渡动画
  - 暂停状态的淡入淡出效果
- **角色移动**：
  - 多键位支持：WASD + 方向键
  - 跳跃动作：W键、上方向键、空格键
  - 下蹲移动：S键、下方向键
  - 实时位置更新和边界限制

#### 3.3 技术实现细节 (已实现)
- **静态场景**：当前为展示版本，无碰撞检测和敌人系统
- **键盘监听**：使用Set数据结构管理多键同时按下
- **游戏循环**：setInterval实现16ms间隔的游戏循环
- **状态管理**：Zustand管理游戏状态、角色位置、动作状态
- **重力系统**：简单的重力效果，角色自动下落到地面
- **暂停机制**：ESC键暂停/恢复游戏

#### 3.4 验证目标
- **核心目标**：验证"生成资源可立即用于游戏"的可行性
- **当前阶段**：仅验证"生成即游戏"概念
- **功能范围**：基础展示 + 简单交互，不涉及复杂游戏逻辑

### 4. 用户界面 (已实现)

#### 4.1 主菜单 (已实现)
- 项目标题和描述展示
- 主题选择功能
- 开始游戏按钮
- 响应式布局设计

#### 4.2 主题选择界面 (已实现)
- **预设主题卡片**：Epic Fantasy 和 Cyberpunk 主题
- **自定义输入框**：支持200字符限制的自定义主题输入
- **主题预览**：显示主题描述和示例元素
- **确认和重试按钮**：主题确认和重置功能
- **Radio组件**：使用Ant Design Radio实现主题选择

#### 4.3 游戏界面 (已实现)
- **游戏画布**：使用CSS背景 + 绝对定位的混合渲染方案
- **控制提示**：底部显示WASD/方向键操作说明
- **实时信息面板**：显示角色位置、当前动作和游戏状态
- **暂停功能**：ESC键暂停游戏，显示暂停遮罩
- **返回主菜单**：游戏内返回功能
- **移动端适配**：响应式设计，支持不同屏幕尺寸

#### 4.4 加载界面 (已实现)
- **进度条显示**：使用Ant Design Progress组件
- **加载状态提示**：动态显示生成进度信息
- **模拟生成过程**：当前使用模拟进度，待接入真实API

#### 4.5 游戏画布技术规格 (已实现)
- **Canvas尺寸**：全屏响应式设计，适配不同设备
- **角色位置**：初始位置(100, 400)，x轴移动范围0-800
- **背景处理**：CSS background-size: cover 自适应
- **动画帧率**：16ms间隔实现60fps游戏循环
- **重力系统**：简单的重力效果，地面高度350px

## 技术架构

### 前端技术栈
- **框架**：Next.js 15.5.2 (已实现)
- **样式**：Tailwind CSS 4.0 (已实现)
- **游戏渲染**：混合方案 - 背景使用CSS，角色使用Canvas (已实现)
- **状态管理**：Zustand 5.0.8 (已实现)
- **UI组件**：Ant Design 5.27.1 (已实现)
- **HTTP客户端**：Fetch API (待实现)
- **动画库**：Framer Motion 12.23.12 (已实现)
- **图标库**：Ant Design Icons 6.0.0 + Lucide React 0.542.0 (已实现)

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

## 当前项目架构图

### 系统架构图
```mermaid
graph TB
    subgraph "前端层 (已实现)"
        A["Next.js 15.5.2 应用"]
        B["Ant Design UI 组件"]
        C["Framer Motion 动画"]
        D["Tailwind CSS 样式"]
    end
    
    subgraph "状态管理层 (已实现)"
        E["Zustand Store"]
        F["游戏状态管理"]
        G["角色位置追踪"]
        H["主题选择状态"]
    end
    
    subgraph "游戏渲染层 (已实现)"
        I["CSS 背景渲染"]
        J["绝对定位角色"]
        K["键盘事件监听"]
        L["游戏循环 (16ms)"]
    end
    
    subgraph "AI生成层 (待实现)"
        M["DashScope API"]
        N["Qwen-Image 模型"]
        O["图像处理"]
    end
    
    A --> B
    A --> C
    A --> D
    A --> E
    E --> F
    E --> G
    E --> H
    F --> I
    F --> J
    K --> L
    L --> G
    A -.-> M
    M -.-> N
    N -.-> O
```

### 用户交互流程图
```mermaid
flowchart TD
    Start(["用户访问应用"]) --> Menu["主菜单界面"]
    Menu --> ThemeSelect{"选择主题类型"}
    
    ThemeSelect -->|"预设主题"| PresetTheme["Epic Fantasy / Cyberpunk"]
    ThemeSelect -->|"自定义主题"| CustomTheme["输入自定义提示词"]
    
    PresetTheme --> Confirm["确认主题选择"]
    CustomTheme --> Confirm
    
    Confirm --> Generate["点击开始游戏"]
    Generate --> Loading["显示生成进度"]
    Loading --> GameInterface["进入游戏界面"]
    
    GameInterface --> GamePlay{"游戏交互"}
    GamePlay -->|"WASD/方向键"| Movement["角色移动"]
    GamePlay -->|"空格键"| Jump["角色跳跃"]
    GamePlay -->|"ESC键"| Pause["暂停游戏"]
    
    Movement --> GamePlay
    Jump --> GamePlay
    Pause --> Resume{"继续游戏?"}
    Resume -->|"是"| GamePlay
    Resume -->|"否"| BackToMenu["返回主菜单"]
    BackToMenu --> Menu
    
    GameInterface --> Restart["重新生成"]
    Restart --> Generate
```

## AI生成流程设计 (待实现)

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

## 当前实现状态

### 已完成功能 ✅
- **基础项目架构**：Next.js + TypeScript + Tailwind CSS
- **UI组件系统**：Ant Design 完整集成
- **状态管理**：Zustand 全局状态管理
- **主题选择系统**：预设主题 + 自定义主题输入
- **游戏渲染引擎**：CSS + 绝对定位混合方案
- **角色控制系统**：多键位支持 + 重力系统
- **动画系统**：Framer Motion 平滑过渡
- **响应式设计**：移动端适配
- **游戏循环**：60fps 实时更新
- **暂停功能**：ESC键暂停/恢复

### 待实现功能 🚧
- **AI生成集成**：DashScope API 接入
- **图像处理**：生成图片的格式转换和优化
- **后端API路由**：Next.js API Routes
- **数据持久化**：游戏数据存储
- **错误处理**：生成失败重试机制

### 技术债务 ⚠️
- **模拟数据**：当前使用占位符图片，需接入真实AI生成
- **性能优化**：游戏循环可优化为requestAnimationFrame
- **类型安全**：部分组件props类型定义待完善
- **测试覆盖**：缺少单元测试和集成测试

## 后续扩展计划

### 短期扩展 (1-2周)
- **AI生成集成**：完成DashScope API接入
- **真实图片渲染**：替换占位符为AI生成内容
- **错误处理优化**：完善生成失败的用户体验
- **性能优化**：游戏循环和渲染优化

### 中期扩展 (1-2月)
- **更多预设主题**：科幻、恐怖、卡通等风格
- **基础碰撞检测**：角色与环境交互
- **简单的收集元素**：道具和奖励系统
- **音效生成集成**：AI生成背景音乐和音效

### 长期扩展 (3-6月)
- **完整游戏引擎集成**：考虑Phaser.js或自研引擎
- **多关卡系统**：程序化关卡生成
- **敌人和障碍物**：AI生成的游戏机制
- **分数和成就系统**：用户进度追踪
- **多人游戏**：实时对战功能
