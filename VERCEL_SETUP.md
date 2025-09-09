# Vercel 환경변수 설정 가이드

## 필수 환경변수

Vercel에서 다음 환경변수를 설정해야 합니다:

### 1. Supabase 환경변수

**NEXT_PUBLIC_SUPABASE_URL**
```
https://pwhujcrrhwiafwyzwllt.supabase.co
```

**NEXT_PUBLIC_SUPABASE_ANON_KEY**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3aHVqY3JyaHdpYWZ3eXp3bGx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczOTE4NTAsImV4cCI6MjA3Mjk2Nzg1MH0.wG2gL_YKezPzrvlhks1UrhcDWnhiZy5L8O6XsIh95NA
```

## Vercel에서 환경변수 설정하는 방법

### 방법 1: Vercel 대시보드에서 설정

1. [Vercel 대시보드](https://vercel.com/dashboard)에 로그인
2. 프로젝트 선택
3. **Settings** 탭 클릭
4. **Environment Variables** 섹션으로 이동
5. **Add** 버튼 클릭하여 각 환경변수 추가:

   - **Name**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: `https://pwhujcrrhwiafwyzwllt.supabase.co`
   - **Environment**: `Production`, `Preview`, `Development` 모두 선택

   - **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
   - **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3aHVqY3JyaHdpYWZ3eXp3bGx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczOTE4NTAsImV4cCI6MjA3Mjk2Nzg1MH0.wG2gL_YKezPzrvlhks1UrhcDWnhiZy5L8O6XsIh95NA`
   - **Environment**: `Production`, `Preview`, `Development` 모두 선택

6. **Save** 버튼 클릭

### 방법 2: Vercel CLI 사용

```bash
# Vercel CLI가 설치되어 있지 않다면 설치
npm i -g vercel

# 프로젝트 디렉토리에서 환경변수 추가
vercel env add NEXT_PUBLIC_SUPABASE_URL
# 값 입력: https://pwhujcrrhwiafwyzwllt.supabase.co
# Environment 선택: Production, Preview, Development

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY  
# 값 입력: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3aHVqY3JyaHdpYWZ3eXp3bGx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczOTE4NTAsImV4cCI6MjA3Mjk2Nzg1MH0.wG2gL_YKezPzrvlhks1UrhcDWnhiZy5L8O6XsIh95NA
# Environment 선택: Production, Preview, Development
```

## 환경변수 확인

환경변수가 올바르게 설정되었는지 확인하려면:

1. 새로 배포를 트리거하거나
2. Vercel 대시보드의 **Environment Variables** 섹션에서 변수들이 표시되는지 확인

## 로컬 개발 환경

로컬에서 개발할 때는 `.env.local` 파일을 생성하여 같은 환경변수를 설정하세요:

```bash
# .env.local 파일 내용
NEXT_PUBLIC_SUPABASE_URL=https://pwhujcrrhwiafwyzwllt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3aHVqY3JyaHdpYWZ3eXp3bGx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczOTE4NTAsImV4cCI6MjA3Mjk2Nzg1MH0.wG2gL_YKezPzrvlhks1UrhcDWnhiZy5L8O6XsIh95NA
```

⚠️ **주의**: `.env.local` 파일은 `.gitignore`에 포함되어 있어야 하며, GitHub에 커밋하지 마세요.

## 배포 후 확인사항

환경변수 설정 후 새로운 배포가 완료되면:

1. 애플리케이션이 정상적으로 작동하는지 확인
2. Supabase 데이터베이스 연결이 정상적으로 이루어지는지 확인
3. 허가서 작성, JSA 작성 등 주요 기능들이 정상 작동하는지 테스트

## 문제 해결

### 환경변수가 인식되지 않는 경우:
1. Vercel에서 새로 배포 트리거
2. 환경변수 이름에 오타가 없는지 확인 (특히 `NEXT_PUBLIC_` 접두사)
3. 모든 환경(Production, Preview, Development)에 설정되었는지 확인

### Supabase 연결 오류가 발생하는 경우:
1. URL과 anon key가 정확한지 확인
2. Supabase 프로젝트가 활성 상태인지 확인
3. 브라우저 개발자 도구의 Network 탭에서 API 호출 상태 확인

## 보안 고려사항

- `NEXT_PUBLIC_` 접두사가 붙은 환경변수는 클라이언트 사이드에 노출됩니다
- Supabase anon key는 RLS(Row Level Security)가 비활성화되어 있으므로 주의가 필요합니다
- 운영 환경에서는 적절한 보안 정책을 적용하는 것을 권장합니다