<div align="center">

<!-- Header Banner -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=250&section=header&text=Oh%20My%20OpenCode%20Dev&fontSize=48&fontColor=fff&animation=twinkling&fontAlignY=38&desc=AI%20%EC%BD%94%EB%94%A9%20%EC%96%B4%EC%8B%9C%EC%8A%A4%ED%84%B4%ED%8A%B8%20%E2%80%94%20%EB%8D%B0%EC%8A%A4%ED%81%AC%ED%86%B1%20%2B%20%ED%94%8C%EB%9F%AC%EA%B7%B8%EC%9D%B8%20%7C%20%ED%81%AC%EB%A1%9C%EC%8A%A4%ED%94%8C%EB%9E%AB%ED%8F%BC&descSize=18&descAlignY=55" width="100%" />

<!-- Badges -->
[![GitHub Stars](https://img.shields.io/github/stars/sjkncs/oh-my-opencode-dev?style=for-the-badge&logo=github&logoColor=white&labelColor=0d1117&color=ffcb47)](https://github.com/sjkncs/oh-my-opencode-dev/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/sjkncs/oh-my-opencode-dev?style=for-the-badge&logo=github&logoColor=white&labelColor=0d1117&color=8ae8ff)](https://github.com/sjkncs/oh-my-opencode-dev/network/members)
[![GitHub Issues](https://img.shields.io/github/issues/sjkncs/oh-my-opencode-dev?style=for-the-badge&logo=github&logoColor=white&labelColor=0d1117&color=ff80eb)](https://github.com/sjkncs/oh-my-opencode-dev/issues)
[![License](https://img.shields.io/badge/license-SUL--1.0-white?style=for-the-badge&labelColor=0d1117)](LICENSE.md)

[![Electron](https://img.shields.io/badge/Electron-47848F?style=flat-square&logo=electron&logoColor=white)](https://www.electronjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![OpenCode](https://img.shields.io/badge/OpenCode-Plugin-6c5ce7?style=flat-square)](https://github.com/sst/opencode)

**[English](README.md)** | **[简体中文](README.zh-cn.md)** | **[한국어](README.ko.md)**

</div>

---

> **[Oh My OpenCode](https://github.com/code-yeongyu/oh-my-opencode)의 Fork 및 확장 — 원작자 [@code-yeongyu](https://github.com/code-yeongyu)**
>
> 이 프로젝트는 원본을 기반으로 **크로스플랫폼 Electron 데스크톱 애플리케이션**을 추가했습니다. 플로팅 AI 버블, 빠른 작업 패널, 글로벌 단축키, 음성 입력, 테마 시스템 등을 포함합니다.

---

## 이 Fork의 새로운 기능

<table>
<tr>
<td width="50%">

### 데스크톱 애플리케이션 (신규)

- **크로스플랫폼** — Windows / macOS / Linux
- **플로팅 AI 버블** — 항상 위에 표시되는 빠른 접근
- **미니 퀵 액션 패널** — 번역, 요약, 코드 설명, 코드 수정
- **음성 입력 (ASR/TTS)** — Whisper API 통합
- **글로벌 단축키** — `Ctrl+Shift+Space` 패널 토글
- **테마 시스템** — 라이트/다크/시스템, 8가지 강조색, 5가지 사이드바 색상
- **시스템 트레이** — 트레이로 최소화, 컨텍스트 메뉴
- **내장 터미널** — 크로스플랫폼 셸
- **채팅 기록** — 검색 가능한 영구 대화 기록

</td>
<td width="50%">

### 확장 및 최적화

- **i18n 다국어** — 简体中文 / English / 한국어 실시간 전환
- **Electron 데스크톱 래퍼** — 네이티브 앱 경험
- **IPC 아키텍처** — 안전한 contextBridge 통신
- **OpenCode SDK 통합** — 직접 API 연결, 스트리밍
- **이벤트 기반 스트리밍** — 실시간 AI 응답 표시
- **설정 동기화** — 메인 창과 버블 간 공유
- **접근성** — ARIA 속성, 키보드 내비게이션
- **CSS 아키텍처** — 유틸리티 클래스, Safari 호환
- **CI/CD 파이프라인** — GitHub Actions 자동 빌드 (전 플랫폼)
- **보안 패치** — Electron 40.4.1, node-tar 취약점 수정

</td>
</tr>
</table>

---

## 빠른 시작

### 데스크톱 앱

```bash
cd desktop
npm install
npm start            # 개발 모드
npm run build:win    # Windows 빌드
npm run build:mac    # macOS 빌드
npm run build:linux  # Linux 빌드
```

### 원본 플러그인

```bash
# AI 에이전트에게 설치를 맡기세요:
# "다음 지침에 따라 oh-my-opencode를 설치하세요: https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/refs/heads/master/docs/guide/installation.md"
```

---

## 다운로드

사전 빌드된 바이너리는 [GitHub Actions](https://github.com/sjkncs/oh-my-opencode-dev/actions) 아티팩트에서 다운로드하거나 로컬에서 빌드할 수 있습니다:

| 플랫폼 | 형식 | 로컬 빌드 | CI 빌드 |
|---|---|---|---|
| **Windows** | NSIS 설치 프로그램 + Portable exe | `npm run build:win` | ✅ GitHub Actions |
| **macOS** | DMG + ZIP | `npm run build:mac` | ✅ GitHub Actions |
| **Linux** | AppImage + DEB | `npm run build:linux` | ✅ GitHub Actions |
| **빠른 테스트** | 압축 해제 폴더 | `npm run build:dir` | — |

> **팁**: [Actions → Build & Release](https://github.com/sjkncs/oh-my-opencode-dev/actions/workflows/build.yml) → 최신 실행 → **Artifacts** 섹션에서 다운로드하세요.

---

## 다국어 지원 (i18n)

전체 데스크톱 UI가 **3개 언어**를 실시간으로 전환합니다:

| 언어 | 코드 | 상태 |
|---|---|---|
| **简体中文** | `zh` | ✅ 기본 |
| **English** | `en` | ✅ 완전 |
| **한국어** | `ko` | ✅ 완전 |

**전환 방법:** 설정 → 인터페이스 언어 → 언어 선택 → 즉시 적용.

모든 UI 요소가 번역됨: 타이틀바, 사이드바, 환영 화면, 패널, 입력 영역, 버블, 컨텍스트 메뉴, 설정 모달, 터미널.

---

## 데스크톱 앱 기능

### 플로팅 AI 버블

| 동작 | 기능 |
|---|---|
| **클릭** | 미니 퀵 액션 패널 확장 |
| **드래그** | 버블 자유 이동 (5px 임계값) |
| **우클릭** | 컨텍스트 메뉴 (패널 / 메인 창 / 설정 / 종료) |
| **Esc** | 현재 오버레이 닫기 |

### 글로벌 단축키

| 단축키 | 동작 |
|---|---|
| `Ctrl+Shift+O` | 메인 창 토글 |
| `Ctrl+Shift+B` | 버블 표시 토글 |
| `Ctrl+Shift+Space` | 미니 퀵 액션 패널 토글 |
| `Ctrl+Shift+Q` | 애플리케이션 종료 |

### 퀵 액션

| 버튼 | 기능 |
|---|---|
| **번역** | 선택한 텍스트 번역 |
| **요약** | 콘텐츠 요약 |
| **코드 설명** | 코드 스니펫 설명 |
| **코드 수정** | 코드 문제 수정 |
| **음성** | Whisper ASR을 통한 음성 입력 |

### CI/CD — GitHub Actions 자동 빌드

모든 플랫폼은 GitHub Actions를 통해 자동 빌드됩니다:

```yaml
# 트리거: 태그 푸시 (v*) 또는 수동 workflow_dispatch
# 빌드: Windows (NSIS+Portable) / macOS (DMG+ZIP) / Linux (AppImage+DEB)
# 아티팩트가 플랫폼별로 업로드됨
```

새 버전 릴리스:

```bash
git tag v1.0.1
git push --tags   # Win/Mac/Linux 전 플랫폼 자동 빌드 트리거
```

또는 수동 트리거: **Actions → Build & Release → Run workflow**

---

## 프로젝트 구조

```text
oh-my-opencode-dev/
├── src/                    # 원본 플러그인 소스 (TypeScript)
├── desktop/                # 신규: Electron 데스크톱 애플리케이션
│   ├── main.js             # 메인 프로세스 (IPC, 단축키, OpenCode SDK)
│   ├── preload.js          # 보안 IPC 브릿지
│   ├── package.json        # 데스크톱 의존성 + 빌드 설정
│   └── renderer/
│       ├── index.html      # 메인 창 UI
│       ├── styles.css      # 테마 시스템
│       ├── app.js          # 애플리케이션 로직
│       ├── i18n.js         # 국제화 (zh/en/ko)
│       └── bubble.html     # 플로팅 버블 + 미니 패널
├── .github/workflows/      # CI/CD (GitHub Actions)
├── docs/                   # 문서
├── packages/               # 플랫폼 바이너리
├── bin/                    # CLI 진입점
└── README.md               # 영어 문서
```

---

## 원본 플러그인 기능

> [Oh My OpenCode](https://github.com/code-yeongyu/oh-my-opencode)의 모든 원본 기능이 보존되어 있습니다.

<details>
<summary><b>전체 기능 목록 보기</b></summary>

- **에이전트**: Sisyphus (메인), Prometheus (플래너), Oracle (디버깅), Librarian (문서), Explore (검색), Hephaestus (딥 워커)
- **백그라운드 에이전트**: 여러 에이전트 병렬 실행
- **LSP & AST 도구**: 리팩토링, 이름 변경, 진단
- **컨텍스트 주입**: AGENTS.md, README.md 자동 주입
- **Claude Code 호환**: 완전한 Hook 시스템, 명령, 스킬, MCP
- **내장 MCP**: websearch (Exa), context7 (문서), grep_app (GitHub 검색)
- **세션 도구**: 기록, 검색, 분석
- **생산성**: Ralph Loop, Todo Enforcer, Comment Checker, Think Mode

원본 [기능 문서](docs/features.md) 및 [설정 문서](docs/configurations.md)를 참조하세요.

</details>

---

## 감사의 말

<table>
<tr>
<td align="center" width="50%">

### 원본 프로젝트

<a href="https://github.com/code-yeongyu/oh-my-opencode">
<img src="https://img.shields.io/badge/Oh_My_OpenCode-원본_프로젝트-6c5ce7?style=for-the-badge&logo=github&logoColor=white" />
</a>

**[Oh My OpenCode](https://github.com/code-yeongyu/oh-my-opencode)** — **[@code-yeongyu](https://github.com/code-yeongyu)**

최고의 AI 에이전트 하네스 — 배터리 포함 OpenCode 플러그인, 다중 모델 오케스트레이션, 병렬 백그라운드 에이전트, 정교한 LSP/AST 도구.

*원작자가 구축한 놀라운 기반 없이는 이 Fork가 존재할 수 없었습니다.*

</td>
<td align="center" width="50%">

### OpenCode

<a href="https://github.com/sst/opencode">
<img src="https://img.shields.io/badge/OpenCode-코어_플랫폼-369eff?style=for-the-badge&logo=github&logoColor=white" />
</a>

**[OpenCode](https://github.com/sst/opencode)** — **[@sst](https://github.com/sst)**

이 모든 것을 가능하게 한 오픈소스 AI 코딩 플랫폼.

</td>
</tr>
</table>

### 특별 감사

- **[@code-yeongyu](https://github.com/code-yeongyu)** — Oh My OpenCode 원작자, 혁명적인 에이전트 하네스 설계
- **[@junhoyeo](https://github.com/junhoyeo)** — 원본 프로젝트의 멋진 히어로 이미지
- **[@sst](https://github.com/sst)** — OpenCode 구축 및 유지보수
- **오픈소스 커뮤니티** — 지속적인 피드백과 기여

---

## 기여

기여를 환영합니다! Issue와 Pull Request를 자유롭게 제출해 주세요.

1. 이 저장소를 Fork하세요
2. 기능 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. 변경사항 커밋 (`git commit -m 'feat: add amazing feature'`)
4. 브랜치에 푸시 (`git push origin feature/amazing-feature`)
5. Pull Request 열기

---

## 라이선스

이 프로젝트는 원본 Oh My OpenCode 프로젝트의 [SUL-1.0 라이선스](LICENSE.md)를 상속합니다.

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=120&section=footer" width="100%" />

**[@sjkncs](https://github.com/sjkncs)가 열정으로 구축**

*거인의 어깨 위에 서서*

[![GitHub](https://img.shields.io/badge/GitHub-sjkncs-181717?style=for-the-badge&logo=github)](https://github.com/sjkncs)

</div>
