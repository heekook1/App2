# Supabase 마이그레이션 가이드

## 개요

이 가이드는 현재 localStorage 기반 데이터 저장소를 Supabase 백엔드로 마이그레이션하는 방법을 설명합니다.

## 완료된 작업

✅ **데이터베이스 스키마 생성 완료**
- `users` - 사용자 정보
- `permits` - 작업허가서
- `permit_approvers` - 허가서 승인자
- `jsa_documents` - JSA 위험성평가 문서
- `jsa_steps` - JSA 작업 단계
- `user_activities` - 사용자 활동 로그

✅ **RLS 정책 비활성화 완료**

✅ **Realtime 기능 활성화 완료**

✅ **Supabase 스토어 클래스 생성 완료**
- `lib/permit-store-supabase.ts` - 허가서 관리
- `lib/jsa-store-supabase.ts` - JSA 관리  
- `lib/user-store-supabase.ts` - 사용자 관리

## 마이그레이션 단계

### 1. 환경변수 설정

먼저 `VERCEL_SETUP.md` 파일의 가이드에 따라 Vercel에서 환경변수를 설정하세요:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. 스토어 Import 변경

기존 localStorage 스토어를 Supabase 스토어로 교체하세요:

#### 허가서 관련 파일들
```typescript
// 기존
import { permitStore } from '@/lib/permit-store'

// 변경 후  
import { permitStore } from '@/lib/permit-store-supabase'
```

**영향받는 파일들:**
- `app/permits/general/page.tsx`
- `app/permits/fire/page.tsx`
- `app/permits/view/[id]/page.tsx`
- `app/permits/list/page.tsx`

#### JSA 관련 파일들
```typescript
// 기존
import { jsaStore } from '@/lib/jsa-store'

// 변경 후
import { jsaStore } from '@/lib/jsa-store-supabase'
```

**영향받는 파일들:**
- `app/jsa/page.tsx`
- `app/jsa/list/page.tsx`
- `app/jsa/view/[id]/page.tsx`

#### 사용자 관련 파일들
```typescript
// 기존
import { userStore } from '@/lib/user-store'

// 변경 후
import { userStore } from '@/lib/user-store-supabase'
```

**영향받는 파일들:**
- `contexts/auth-context.tsx`
- `app/page.tsx`
- 기타 사용자 관련 기능들

### 3. 비동기 처리 적용

Supabase 스토어는 비동기로 작동하므로 기존 동기 코드를 비동기로 변경해야 합니다.

#### 예시: 허가서 목록 가져오기
```typescript
// 기존 (동기)
const permits = permitStore.getAll()

// 변경 후 (비동기)
const [permits, setPermits] = useState<Permit[]>([])

useEffect(() => {
  const loadPermits = async () => {
    const data = await permitStore.getAll()
    setPermits(data)
  }
  loadPermits()
}, [])
```

#### 예시: JSA 저장하기
```typescript
// 기존 (동기)
const newJSA = jsaStore.save(jsaData)

// 변경 후 (비동기)
const handleSave = async () => {
  const newJSA = await jsaStore.save(jsaData)
  if (newJSA) {
    // 성공 처리
  }
}
```

### 4. 에러 처리 추가

Supabase 스토어는 네트워크 오류나 데이터베이스 오류가 발생할 수 있으므로 적절한 에러 처리를 추가하세요:

```typescript
const loadData = async () => {
  try {
    setLoading(true)
    const data = await permitStore.getAll()
    setPermits(data)
  } catch (error) {
    console.error('데이터 로딩 오류:', error)
    setError('데이터를 불러오는 중 오류가 발생했습니다.')
  } finally {
    setLoading(false)
  }
}
```

### 5. 실시간 기능 추가 (선택사항)

Supabase의 realtime 기능을 활용하여 데이터 실시간 동기화를 구현할 수 있습니다:

```typescript
import { supabaseHelpers } from '@/lib/supabase'

useEffect(() => {
  // 허가서 변경사항 실시간 구독
  const subscription = supabaseHelpers.subscribeToPermits((payload) => {
    console.log('허가서 변경됨:', payload)
    // 데이터 새로고침 또는 상태 업데이트
    loadPermits()
  })

  return () => {
    subscription.unsubscribe()
  }
}, [])
```

## 주요 변경사항 요약

### API 변경사항
- 모든 스토어 메소드가 `async/await` 기반으로 변경
- 에러 처리를 위해 `try/catch` 블록 필요
- 성공/실패 여부 확인을 위한 반환값 체크 필요

### 데이터 구조 변경사항
- 기존 localStorage 기반 데이터와 호환됨
- 추가된 필드: `created_at`, `updated_at`, `created_by` 등
- 관계형 데이터 구조로 정규화 (approvers, steps 등이 별도 테이블)

### 새로운 기능
- 실시간 데이터 동기화
- 복잡한 쿼리 지원 (부서별, 상태별 필터링 등)
- 사용자 활동 로깅
- 관계형 데이터 관리

## 테스트 방법

마이그레이션 후 다음 기능들을 테스트하세요:

### 허가서 관련
- [ ] 일반위험 허가서 작성
- [ ] 화기작업 허가서 작성
- [ ] 보충작업허가서 작성
- [ ] 허가서 목록 조회
- [ ] 허가서 상세보기
- [ ] 허가서 승인/반려
- [ ] 허가서 인쇄

### JSA 관련  
- [ ] JSA 문서 작성
- [ ] JSA 목록 조회
- [ ] JSA 상세보기
- [ ] JSA 수정
- [ ] JSA 삭제

### 사용자 관련
- [ ] 로그인/로그아웃
- [ ] 사용자 프로필 관리
- [ ] 활동 로그 조회

## 롤백 방법

문제가 발생할 경우 기존 localStorage 스토어로 빠르게 롤백할 수 있습니다:

1. import 문을 다시 기존 스토어로 변경
2. async/await 코드를 동기 코드로 되돌림
3. 기존 localStorage 데이터가 그대로 유지됨

## 지원 및 문제해결

문제가 발생할 경우:

1. 브라우저 개발자 도구의 Console과 Network 탭 확인
2. Supabase 대시보드에서 로그 확인
3. 환경변수가 올바르게 설정되었는지 확인
4. 필요시 기존 localStorage 스토어로 롤백