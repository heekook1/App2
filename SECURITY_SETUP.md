# Supabase 보안 설정 가이드 (선택사항)

## 현재 상태
- ✅ RLS (Row Level Security) 비활성화됨
- ✅ 모든 테이블에 대한 공개 접근 허용
- ⚠️ 개발 편의성을 위해 보안이 완전히 열려있음

## 나중에 보안을 강화하려면

### 1. RLS 다시 활성화
```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE permits ENABLE ROW LEVEL SECURITY;
ALTER TABLE permit_approvers ENABLE ROW LEVEL SECURITY;
ALTER TABLE jsa_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE jsa_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;
```

### 2. 기본 정책 생성 예시
```sql
-- 사용자는 자신의 데이터만 볼 수 있음
CREATE POLICY "Users can view own data" ON users
FOR SELECT USING (auth.uid()::text = id);

-- 허가서는 요청자나 승인자만 볼 수 있음
CREATE POLICY "Users can view relevant permits" ON permits
FOR SELECT USING (
  requester_email = auth.jwt() ->> 'email' OR
  id IN (
    SELECT permit_id FROM permit_approvers 
    WHERE email = auth.jwt() ->> 'email'
  )
);
```

### 3. Authentication 활성화
현재는 익명 접근을 허용하지만, 실제 운영환경에서는:
- Email/Password 인증
- Google/GitHub OAuth
- 또는 기업 SSO 연동

## 권장사항
개발 단계에서는 현재 설정을 유지하고, 운영 배포 전에 보안을 점진적으로 강화하세요.