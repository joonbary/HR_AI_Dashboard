# Known Issues

이 파일은 HR_AI_Dashboard 작업 중 반복해서 겪은 환경/실행 문제와 해결 순서를 정리한 문서입니다.
새 작업을 시작할 때 먼저 확인하세요.

## 1. npm install을 C:\Users\OK에서 실행하면 package.json을 찾지 못함

### 증상

```powershell
npm error enoent Could not read package.json
npm error path C:\Users\OK\package.json
```

### 원인

`npm install`, `npm run dev`, `npm run build`는 현재 폴더의 `package.json`을 기준으로 실행됩니다.
프로젝트 루트가 아닌 `C:\Users\OK`에서 실행하면 실패합니다.

### 해결

항상 프로젝트 루트로 이동한 뒤 실행합니다.

```powershell
cd "D:\99 프로젝트\2026\03_AI_HR\프로젝트 AI HR\HR_AI_Dashboard"
npm.cmd install
```

## 2. PowerShell에서 npm 명령이 npm.ps1 실행 정책으로 막힘

### 증상

```powershell
npm : 이 시스템에서 스크립트를 실행할 수 없으므로 C:\Program Files\nodejs\npm.ps1 파일을 로드할 수 없습니다.
```

### 원인

PowerShell 실행 정책이 `npm.ps1` 실행을 차단합니다.

### 해결

이 프로젝트에서는 `npm` 대신 `npm.cmd`를 사용합니다.

```powershell
npm.cmd install
npm.cmd run dev
npm.cmd run build
```

## 3. npm install 중 node_modules\acorn EPERM 오류

### 증상

```powershell
npm error code EPERM
npm error syscall rmdir
npm error path ...\node_modules\acorn
```

### 원인

이전 설치가 중간에 실패했거나, 개발 서버/에디터/백신 등이 `node_modules` 안의 파일을 잠근 상태일 수 있습니다.
이 상태에서는 `vite`가 끝까지 설치되지 않아 `npm.cmd run dev`가 실패합니다.

### 해결

1. 실행 중인 개발 서버를 종료합니다.

```powershell
Ctrl + C
```

2. 프로젝트 루트에서 불완전한 `node_modules`를 삭제합니다.

```powershell
cd "D:\99 프로젝트\2026\03_AI_HR\프로젝트 AI HR\HR_AI_Dashboard"
Remove-Item -Recurse -Force .\node_modules
```

3. 삭제가 권한 문제로 실패하면 관리자 권한 PowerShell에서 같은 명령을 다시 실행합니다.

4. 다시 설치합니다.

```powershell
npm.cmd install
```

## 4. vite를 찾지 못해 npm.cmd run dev가 실패함

### 증상

```powershell
'vite'은(는) 내부 또는 외부 명령, 실행할 수 있는 프로그램, 또는 배치 파일이 아닙니다.
```

### 원인

`node_modules` 설치가 완료되지 않아 `node_modules\.bin\vite.cmd`가 없는 상태입니다.

### 해결

`node_modules`를 정리한 뒤 다시 설치합니다.

```powershell
Remove-Item -Recurse -Force .\node_modules
npm.cmd install
npm.cmd run dev
```

## 5. 브라우저에서 localhost refused to connect

### 증상

브라우저에 다음 메시지가 표시됩니다.

```text
This site can't be reached
localhost refused to connect
ERR_CONNECTION_REFUSED
```

### 원인

대부분 Vite 개발 서버가 꺼져 있거나, 다른 포트에서 실행 중인 상태입니다.
`npm.cmd run build`는 정적 파일을 빌드할 뿐 개발 서버를 켜지 않습니다.

### 해결

프로젝트 루트에서 개발 서버를 다시 실행합니다.

```powershell
cd "D:\99 프로젝트\2026\03_AI_HR\프로젝트 AI HR\HR_AI_Dashboard"
npm.cmd run dev
```

터미널에 표시되는 URL을 브라우저에서 엽니다. 기본 주소는 보통 다음 중 하나입니다.

```text
http://localhost:5173/HR_AI_Dashboard/
http://localhost:5174/HR_AI_Dashboard/
```

포트가 이미 사용 중이면 Vite가 `5174`, `5175`처럼 다른 포트를 배정할 수 있으므로 터미널 출력 URL을 우선합니다.

## 6. Codex 샌드박스에서 Vite build가 spawn EPERM으로 실패함

### 증상

```text
failed to load config from vite.config.js
Error: spawn EPERM
```

또는 PC 보안 시스템 알림이 함께 표시됩니다.

```text
[알림] 파일 복사 권한이 없습니다. 관리자에게 문의 하여 주시기 바랍니다.
[알림] Codex.exe의 파일 접근 차단 (읽기)
대상 경로: \Device\Mup\...
```

### 원인

Vite/Rolldown이 Windows 경로 확인용 하위 프로세스를 실행하는 과정에서 Codex 샌드박스 권한에 막힐 수 있습니다.
사내/PC 보안 시스템이 `Codex.exe`의 파일 읽기, 복사, 하위 프로세스 실행을 차단하는 경우에도 같은 형태의 `EPERM` 오류가 발생합니다.

### 해결

Codex에서 검증할 때는 `npm.cmd run build`를 권한 상승 실행으로 재시도합니다.
사용자 로컬 PowerShell에서는 일반적으로 아래 명령만으로 충분합니다.

```powershell
npm.cmd run build
```

보안 시스템 알림이 뜨는 경우에는 Codex에서 계속 재시도해도 해결되지 않을 수 있습니다.
이때는 사용자가 직접 일반 PowerShell 또는 관리자 권한 PowerShell에서 실행합니다.

```powershell
cd "D:\99 프로젝트\2026\03_AI_HR\프로젝트 AI HR\HR_AI_Dashboard"
npm.cmd run dev
npm.cmd run build
```

계속 차단되면 보안 관리자에게 아래 항목 허용을 요청합니다.

- `Codex.exe`의 프로젝트 폴더 읽기/쓰기
- `node.exe`, `npm.cmd`, `vite` 실행
- 프로젝트 경로: `D:\99 프로젝트\2026\03_AI_HR\프로젝트 AI HR\HR_AI_Dashboard`
- 임시/네트워크 경로 접근이 필요한 경우: 알림에 표시된 `\Device\Mup\...` 대상 경로

이 이슈가 발생하면 커밋/푸시 문제가 아니라 로컬 보안 정책 문제로 판단합니다.

## 7. 수정 후 화면이 바뀌지 않는 경우

### 확인 순서

1. 개발 서버가 켜져 있는지 확인합니다.
2. 브라우저를 새로고침합니다.
3. 터미널에 에러가 있는지 확인합니다.
4. 그래도 이상하면 개발 서버를 재시작합니다.

```powershell
Ctrl + C
npm.cmd run dev
```

## 기본 작업 명령어

```powershell
cd "D:\99 프로젝트\2026\03_AI_HR\프로젝트 AI HR\HR_AI_Dashboard"
npm.cmd install
npm.cmd run dev
npm.cmd run build
```
