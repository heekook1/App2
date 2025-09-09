import { NextRequest, NextResponse } from "next/server"

const MISO_API_URL = process.env.MISO_API_URL || "https://api.holdings.miso.gs/ext/v1"
const MISO_API_KEY = process.env.MISO_API_KEY

export async function POST(request: NextRequest) {
  try {
    if (!MISO_API_KEY) {
      return NextResponse.json(
        { error: "MISO API key is not configured" },
        { status: 500 }
      )
    }

    const { message, context } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      )
    }

    // MISO API에 요청
    const response = await fetch(`${MISO_API_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${MISO_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `당신은 산업 안전 전문가입니다. ${context || "작업 위험성 평가(JSA) 작성을 도와주세요."} 
            다음과 같은 관점에서 도움을 제공해주세요:
            1. 작업 단계별 잠재적 위험 요소 파악
            2. 위험 요소에 대한 예방 대책 제시
            3. 필요한 보호구 및 안전 장비 추천
            4. 관련 안전 규정 및 절차 안내
            한국어로 명확하고 실용적인 답변을 제공해주세요.`
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("MISO API Error:", errorData)
      throw new Error(`MISO API responded with ${response.status}`)
    }

    const data = await response.json()
    
    // MISO API 응답 형식에 맞게 처리
    const aiResponse = data.choices?.[0]?.message?.content || 
                      data.response || 
                      "응답을 생성할 수 없습니다."

    return NextResponse.json({
      response: aiResponse
    })

  } catch (error) {
    console.error("AI Chat API Error:", error)
    return NextResponse.json(
      { 
        error: "AI 응답 생성 중 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}