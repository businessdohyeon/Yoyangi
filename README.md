**프로젝트 개요**

Yoyangi는 React Native로 작성된 모바일 애플리케이션입니다. iOS와 Android를 모두 지원하며 지역 기반 서비스(지도), 소켓 통신, 국제화(i18n), 이미지/미디어 업로드 등 여러 기능을 포함합니다.

<!-- TODO: 앱 한눈에 보기 스크린샷 추가 -->
<!-- TODO: 소개용 짧은 동영상(선택) 추가 -->

**필수 조건 (Prerequisites)**
- **Node**: `>= 20` (프로젝트 `package.json`의 `engines` 참조)
- **Yarn 또는 npm**: 선호하는 패키지 매니저 사용
- **Xcode**: iOS 빌드/시뮬레이터용 (macOS)
- **Android Studio / SDK**: Android 빌드/에뮬레이터용
- **CocoaPods**: iOS 종속성 관리 (`pod`)

**빠른 시작 (개발 환경 설정)**
1. 레포 클론

```
git clone <REPO_URL>
cd Yoyangi
```

2. 패키지 설치 (npm 또는 yarn 중 하나)

```
npm install
# 또는
yarn install
```

3. iOS 의존성 설치 (macOS)

```
cd ios
pod install
cd ..
```

4. Metro 번들러 실행 및 앱 실행

```
# Metro 서버 시작
npm run start

# iOS (터미널에서)
npm run ios

# Android (에뮬레이터 / 디바이스 연결 후)
npm run android
```

**프로젝트 스크립트**
- **`npm run start`**: Metro 번들러 시작
- **`npm run ios`**: iOS 시뮬레이터에서 앱 실행 (`react-native run-ios`)
- **`npm run android`**: Android 에뮬레이터/기기에서 앱 실행 (`react-native run-android`)
- **`npm run test`**: Jest 테스트 실행
- **`npm run lint`**: ESLint 검사
- **`npm run reset-cache`**: Metro 캐시 리셋 후 시작

**주요 기술 스택 / 라이브러리**
- **React Native**: `react-native` `0.82.0`
- **React**: `react` `19.1.1`
- **네비게이션**: `@react-navigation/native`, `stack`, `bottom-tabs`
- **네이티브 모듈**: `react-native-image-picker`, `@react-native-async-storage/async-storage` 등
- **지도**: `@mj-studio/react-native-naver-map` (네이버 지도)
- **상태/비동기 관리**: `@tanstack/react-query`, `zod` (밸리데이션)
- **UI**: `react-native-paper`
- **국제화(i18n)**: `i18next`, `react-i18next`
- **실시간 통신**: `socket.io-client`

**폴더 구조 (중요 경로)**
- **`/src`**: 애플리케이션 소스
  - `Index.tsx`: 앱 엔트리(루트 네비게이션 등)
  - `pages/`: 화면 별 페이지들 (`SearchPage`, `MainPage`, `LoginPage` 등)
  - `apis/`: API 구성 및 axios 설정
  - `design/`: 테마 및 스타일 (`theme.ts`)
  - `locales/`: 다국어 리소스 (`en.json`, `ko.json`)
  - `hooks/`: 커스텀 훅
  - `utils/`: 공통 유틸리티 (예: `auth.ts`)

**앱 구조 및 진입점**
- 엔트리 파일: `App.tsx` (앱 테마, `GestureHandlerRootView`, `PaperProvider` 등 설정)
- 실제 앱 루트: `src/Index.tsx` (네비게이션 설정 포함)

**환경 변수 / 설정**
- 현재 레포에 `.env` 템플릿 파일이 없습니다. 서버 URL, API 키 또는 민감한 정보를 환경 변수로 관리할 것을 권장합니다.
- 예시: `.env.example` 파일을 추가하고 `.env`를 `.gitignore`에 추가하세요.

**테스트 및 린트**
- 테스트: `npm run test` (Jest 설정이 포함되어 있습니다)
- 린트: `npm run lint` (ESLint 설정 포함)

**로컬라이제이션**
- 프로젝트는 `i18next`와 `react-i18next`를 사용하여 한국어(`ko.json`)와 영어(`en.json`)를 지원합니다.

**이미지, 스크린샷, 다이어그램 추가 위치 (TODO)**
- 앱 스크린샷: README 상단 '프로젝트 개요' 아래
  <!-- TODO: 여기에 앱 홈화면 스크린샷을 추가하세요. 파일 경로 예: `assets/screenshots/home.png` -->
- 아키텍처 다이어그램: `docs/architecture.png` 또는 `docs/architecture.svg`
  <!-- TODO: 아키텍처 다이어그램 추가 (서비스 흐름, API, 소켓 등) -->
- 릴리즈 노트/릴리즈 아트워크: `docs/releases/` 폴더
  <!-- TODO: 필요 시 릴리즈별 스크린샷/비교 이미지 추가 -->

**자주 발생하는 문제 (Troubleshooting)**
- React Native 네이티브 모듈 빌드 실패 시: `cd ios && pod install --repo-update` 실행 후 다시 빌드하세요.
- Metro 캐시 문제 시: `npm run reset-cache` 또는 `yarn start --reset-cache` 실행하세요.

**기여 가이드 (간단)**
1. 이슈 열기 또는 기존 이슈에 코멘트
2. 브랜치 생성: `git checkout -b feature/your-feature`
3. 커밋 및 PR 생성

**라이선스**
- 이 저장소의 라이선스 정보를 추가하세요. (예: `MIT`)

**연락처 / 지원**
- 프로젝트 관련 질문은 저장소 이슈에 남겨주세요.

---

파일 생성자: 자동 생성된 `README.md` — 필요하면 세부사항(이미지, 환경변수 예시, 아키텍처)을 추가해 드립니다.
This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
