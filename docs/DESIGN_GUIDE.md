# Design Guide

## 디자인 콘셉트

콘셉트 이름:

> 따뜻한 목양 데스크

이 디자인은 첨부된 디자인 분석 문서의 장점인 정돈된 정보 구조, 부드러운 중립색, 명확한 타이포그래피, 파스텔 상태 표현을 참고한다. 다만 특정 상용 브랜드를 떠올리게 하는 보라색 CTA, 짙은 네이비 히어로, 가격표 중심 마케팅 구성, 제품 목업 중심의 랜딩 패턴은 사용하지 않는다.

이 앱은 마케팅 웹사이트가 아니라 교회 사역자가 반복해서 사용하는 운영 도구다. 따라서 첫 화면은 랜딩 페이지가 아니라 대시보드여야 한다.

## 디자인 원칙

- 사람 중심: 모든 화면은 성도, 구역, 사역팀, 모임 기록을 빠르게 찾도록 설계한다.
- 조용한 밀도: 지나치게 넓은 마케팅형 레이아웃보다 표, 목록, 상세 패널 중심으로 구성한다.
- 따뜻한 신뢰감: 병원 차트처럼 차갑지 않고, 장식적인 주보처럼 산만하지 않게 만든다.
- 빠른 입력: 리더가 모임 후 모바일이나 작은 화면에서도 출석과 메모를 빠르게 기록할 수 있어야 한다.
- 명확한 상태: 참석, 결석, 미보고, 공란 소속, 확인 필요 상태는 색과 배지로 즉시 구분한다.
- 절제된 장식: 장식은 보조적이어야 하며, 정보 가독성을 해치지 않는다.

## 브랜드 톤

### 권장 표현

- 차분한
- 따뜻한
- 정돈된
- 믿을 수 있는
- 목양적인
- 사역 친화적인
- 빠르게 입력 가능한

### 피해야 할 표현

- 과하게 화려한 SaaS 마케팅 톤
- 보라색 중심의 강한 브랜드 복제
- 깊은 네이비 히어로 밴드 중심 구성
- 가격제/플랜 비교 중심 레이아웃
- 제품 홍보용 목업 중심 히어로
- 장식적인 일러스트 과다 사용

## 색상 토큰

원본 문서의 파스텔 카드 감각과 중립 표면 체계는 유지하되, 앱의 주 색상은 교회 운영 도구에 맞게 청록/딥그린 계열로 변경한다.

```yaml
colors:
  primary: "#2F7D6D"
  primary-pressed: "#256657"
  primary-deep: "#1D4F45"
  on-primary: "#FFFFFF"

  canvas: "#FFFFFF"
  page: "#FAFAF7"
  surface: "#F6F5F1"
  surface-soft: "#FBFAF7"

  hairline: "#E6E1D8"
  hairline-soft: "#EFEAE2"
  hairline-strong: "#CFC7BA"

  ink-deep: "#171717"
  ink: "#24211D"
  charcoal: "#37352F"
  slate: "#5F5B53"
  steel: "#79746B"
  stone: "#A19B91"
  muted: "#BDB8AE"

  link: "#276FBF"
  link-pressed: "#1F5A99"

  accent-gold: "#D9A441"
  accent-sage: "#8BAE8B"
  accent-coral: "#C75C5C"
  accent-sky: "#6D9DC5"

  tint-peach: "#FFE8D4"
  tint-rose: "#FDE0EC"
  tint-mint: "#DDF2E5"
  tint-sage: "#E5EEDF"
  tint-sky: "#DCECF8"
  tint-yellow: "#FEF4CC"
  tint-cream: "#F8F3E8"
  tint-gray: "#F0EEEC"

  success: "#2F8F5B"
  warning: "#C47A22"
  error: "#C75C5C"
  info: "#276FBF"
```

## 색상 사용 규칙

- `primary`는 주요 저장, 생성, 확정 액션에 사용한다.
- 링크는 `link`를 사용하고, 주요 버튼 색과 섞지 않는다.
- 결석, 삭제, 오류는 `error`를 사용하되 과도한 면적에 쓰지 않는다.
- 참석, 완료, 보고 완료는 `success`를 사용한다.
- 미보고, 확인 필요, 공란 소속은 `warning` 또는 `tint-yellow`를 사용한다.
- 파스텔 배경은 카드나 상태 요약 영역에만 사용한다.
- 전체 화면을 단일 색상 계열로 지배하지 않는다.

## 타이포그래피

원본의 Inter 기반 산세리프 방향은 유지한다. 특정 브랜드 서체명은 사용하지 않는다.

```yaml
typography:
  font-family: "Inter, Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif"

  page-title:
    size: 32px
    weight: 650
    line-height: 1.25

  section-title:
    size: 24px
    weight: 650
    line-height: 1.3

  panel-title:
    size: 18px
    weight: 650
    line-height: 1.4

  body:
    size: 15px
    weight: 400
    line-height: 1.55

  body-medium:
    size: 15px
    weight: 550
    line-height: 1.55

  small:
    size: 13px
    weight: 400
    line-height: 1.45

  caption:
    size: 12px
    weight: 500
    line-height: 1.4

  button:
    size: 14px
    weight: 550
    line-height: 1.3
```

## 타이포그래피 규칙

- 운영 화면에서 48px 이상의 큰 제목은 사용하지 않는다.
- 대시보드와 관리 화면은 32px 이하의 제목 체계를 사용한다.
- 버튼, 표, 배지의 글자는 작아도 명확해야 한다.
- 음수 자간은 사용하지 않는다.
- 한글 가독성을 위해 본문 줄 높이는 1.5 이상을 유지한다.

## 형태와 간격

```yaml
radius:
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 20px
  xl: 24px
  xxl: 32px
  section: 48px
```

규칙:

- 버튼, 입력창, 필터는 8px radius를 기본으로 한다.
- 카드와 패널은 8px 또는 12px radius를 사용한다.
- 배지는 `full` radius를 사용할 수 있다.
- 카드 안에 카드를 중첩하지 않는다.
- 관리 화면의 정보 밀도를 유지하기 위해 섹션 간격은 과하게 넓히지 않는다.

## 레이아웃

### 관리자 레이아웃

- 좌측 사이드바
- 상단 현재 화면 제목과 주요 액션
- 중앙 메인 콘텐츠
- 필요 시 우측 보조 패널

### 리더 레이아웃

- 메뉴 수를 줄인다.
- 내 구역 또는 내 사역팀을 첫 화면에 둔다.
- 모임 기록과 출석 체크 액션을 가장 가깝게 배치한다.

### 성도 레이아웃

- 내 정보, 내 소속, 내 모임 중심의 단순한 구조를 사용한다.
- 관리 기능보다 확인과 수정 요청에 집중한다.

## 컴포넌트

### Button Primary

- 배경: `primary`
- 텍스트: `on-primary`
- 높이: 40-44px
- radius: 8px
- 용도: 저장, 생성, 확정

### Button Secondary

- 배경: 투명 또는 흰색
- 테두리: `hairline-strong`
- 텍스트: `ink`
- 용도: 취소, 보조 이동, 필터 초기화

### Button Ghost

- 배경: 투명
- 텍스트: `slate`
- 용도: 덜 중요한 액션, 행 단위 액션

### Text Input

- 높이: 44px
- 배경: `canvas`
- 테두리: `hairline-strong`
- 포커스 테두리: `primary`
- radius: 8px

### Search Field

- 높이: 44px
- 배경: `surface`
- 테두리: `hairline`
- 용도: 성도, 구역, 사역팀 목록 검색

### Data Table

- 배경: `canvas`
- 행 구분선: `hairline-soft`
- 헤더 텍스트: `slate`
- 본문 텍스트: `ink`
- 행 높이: 48-56px
- 용도: 성도 목록, 구역원 목록, 사역팀원 목록

### Status Badge

권장 상태:

- 참석: success
- 결석: error
- 미정: stone
- 보고 완료: success
- 미보고: warning
- 공란 소속: warning
- 비활성: muted

### Summary Panel

대시보드의 수치 요약에 사용한다.

- 배경: `canvas` 또는 연한 tint
- 테두리: `hairline`
- radius: 8px
- 제목, 숫자, 보조 설명의 3단 구조

### Record Panel

모임 기록 입력에 사용한다.

- 날짜/장소
- 참석자 체크리스트
- 결석자 메모
- 기도제목
- 다음 모임 예정일

## 화면별 디자인 기준

### 대시보드

- 첫 화면은 관리자가 오늘 확인해야 할 일을 보여준다.
- 상단에는 주요 수치를 3-5개만 둔다.
- 중앙에는 구역별 모임 보고 현황을 둔다.
- 우측 또는 하단에는 확인 필요 항목을 둔다.

### 성도 목록

- 표 중심 화면이다.
- 이름, 연락처, 구역, 사역팀, 상태를 한 줄에서 확인할 수 있어야 한다.
- 필터는 상단에 한 줄로 배치한다.

### 성도 상세

- 좌측은 기본 정보, 우측은 소속과 최근 기록을 둔다.
- 민감한 메모는 권한에 따라 표시 범위를 제한한다.

### 구역 상세

- 구역원 목록과 최근 모임 기록을 중심에 둔다.
- 출석률은 보조 지표로 사용하되, 사람을 평가하는 느낌이 들지 않게 표현한다.

### 소그룹 모임 기록

- 빠른 입력이 최우선이다.
- 참석 체크는 모바일에서도 한 손으로 처리할 수 있어야 한다.
- 메모는 길게 쓸 수 있지만 필수 입력으로 강제하지 않는다.

## 반응형 기준

```yaml
breakpoints:
  mobile: "< 768px"
  tablet: "768px - 1023px"
  desktop: ">= 1024px"
  wide: ">= 1280px"
```

- 모바일에서는 사이드바를 접고 하단 또는 상단 내비게이션으로 전환한다.
- 표는 모바일에서 카드형 행 또는 핵심 컬럼만 표시한다.
- 출석 체크는 모바일 최적화를 우선한다.
- 버튼과 입력창의 터치 영역은 최소 40px 이상 유지한다.

## Do

- 대시보드와 목록 중심의 운영 도구로 설계한다.
- 파스텔 색상은 상태와 그룹 구분에 절제해서 사용한다.
- 주요 버튼은 청록/딥그린 계열로 통일한다.
- 표, 검색, 필터, 상세 패널의 사용성을 우선한다.
- 한글 가독성을 기준으로 타이포그래피를 조정한다.

## Don't

- 특정 상용 브랜드의 보라색 CTA를 그대로 사용하지 않는다.
- 짙은 네이비 히어로와 제품 목업 중심 랜딩을 만들지 않는다.
- 가격표, 플랜 비교, 고객 로고 벽 같은 마케팅 패턴을 넣지 않는다.
- 카드 안에 카드를 반복 중첩하지 않는다.
- 장식용 일러스트가 데이터보다 먼저 보이게 하지 않는다.
- 모든 화면을 한 가지 색 계열로만 구성하지 않는다.

## 원본 디자인 문서에서 전환한 항목

- 브랜드 전용 산세리프 -> Inter/Pretendard 기반 시스템 서체
- Purple CTA -> 초대교회 앱용 청록/딥그린 Primary
- Deep Navy Hero -> 운영 대시보드 중심 레이아웃
- 가격 카드 -> 요약 패널과 데이터 테이블
- Workspace Mockup Card -> 실제 앱의 대시보드/기록 패널
- Marketing Navigation -> 관리자/리더/성도 역할별 내비게이션
- Feature Pastel Cards -> 상태 요약, 구역/사역팀 구분, 확인 필요 카드
