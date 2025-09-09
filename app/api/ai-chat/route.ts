import { NextRequest, NextResponse } from "next/server"

const MISO_API_URL = process.env.MISO_API_URL || "https://api.holdings.miso.gs/ext/v1"
const MISO_API_KEY = process.env.MISO_API_KEY

export async function POST(request: NextRequest) {
  console.log("=== AI Chat API Called ===")
  console.log("MISO_API_URL:", MISO_API_URL)
  console.log("MISO_API_KEY exists:", !!MISO_API_KEY)
  console.log("MISO_API_KEY (first 10 chars):", MISO_API_KEY?.substring(0, 10))
  
  try {
    if (!MISO_API_KEY) {
      console.error("❌ MISO API key is not configured")
      return NextResponse.json(
        { error: "MISO API key is not configured" },
        { status: 500 }
      )
    }

    const { message, context } = await request.json()
    console.log("📥 Received message:", message)

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      )
    }

    // MISO 에이전트/챗플로우 형식에 맞게 요청 구성
    const requestBody = {
      inputs: {}, // 앱에서 정의된 변수들 (비어있어도 됨)
      query: `${message}

[안전 전문가로서 답변해주세요]
- 작업 단계별 잠재적 위험 요소 파악
- 위험 요소에 대한 예방 대책 제시  
- 필요한 보호구 및 안전 장비 추천
- 관련 안전 규정 및 절차 안내
- 한국어로 명확하고 실용적인 답변 제공
- **중요**: 답변 시 마크다운 형식(#, ##, **, - 등)을 사용하지 말고 일반 텍스트로만 작성해주세요.`,
      mode: "blocking", // blocking 모드로 테스트
      user: "jsa-user-" + Date.now(), // 고유 사용자 식별자
      conversation_id: "" // 새 대화
    }

    const apiUrl = `${MISO_API_URL}/chat`
    console.log("🚀 Sending request to MISO API...")
    console.log("URL:", apiUrl)
    console.log("Request Body:", JSON.stringify(requestBody, null, 2))
    
    // MISO 워크플로우 API에 요청
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${MISO_API_KEY}`,
        "Accept": "application/json",
      },
      body: JSON.stringify(requestBody)
    })

    console.log("📡 Response status:", response.status)
    console.log("Response headers:", Object.fromEntries(response.headers.entries()))

    const responseText = await response.text()
    console.log("📄 Raw response (first 500 chars):", responseText.substring(0, 500))

    if (!response.ok) {
      console.error("❌ MISO API Error - Status:", response.status)
      console.error("❌ MISO API Error - Response:", responseText)
      
      let errorMessage = `MISO API responded with ${response.status}`
      try {
        const errorData = JSON.parse(responseText)
        errorMessage = errorData.error?.message || errorData.message || errorMessage
      } catch (e) {
        errorMessage = responseText || errorMessage
      }
      
      return NextResponse.json(
        { 
          error: "AI 응답 생성 실패",
          details: errorMessage,
          status: response.status
        },
        { status: 500 }
      )
    }

    let data
    try {
      data = JSON.parse(responseText)
      console.log("✅ Parsed response data:", JSON.stringify(data, null, 2))
    } catch (e) {
      console.error("❌ Failed to parse response as JSON:", e)
      return NextResponse.json(
        { 
          error: "응답 파싱 오류",
          details: "서버 응답을 처리할 수 없습니다."
        },
        { status: 500 }
      )
    }
    
    // MISO 채팅 API 응답 형식에 맞게 처리
    let aiResponse = "응답을 생성할 수 없습니다."
    
    // blocking 모드 응답에서 answer 필드를 찾음
    if (data.answer) {
      aiResponse = data.answer
    } else if (data.message) {
      aiResponse = data.message
    } else if (data.response) {
      aiResponse = data.response
    } else if (data.content) {
      aiResponse = data.content
    } else if (data.text) {
      aiResponse = data.text
    } else {
      // 응답 구조를 로그로 확인
      console.log("⚠️ Unknown response structure, checking all fields:", Object.keys(data))
    }

    console.log("🎯 Final AI Response:", aiResponse)

    return NextResponse.json({
      response: aiResponse
    })

  } catch (error) {
    console.error("❌ AI Chat API Error:", error)
    console.error("Error details:", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined
    })
    
    return NextResponse.json(
      { 
        error: "AI 응답 생성 중 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}