import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

// Force dynamic to prevent static generation issues during build
export const dynamic = 'force-dynamic';

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "dummy_key_for_build");

const SYSTEM_PROMPT = `
# Role
너는 텍스트 기반 펀치력 측정 게임인 'I Am Keyboard Boxer'의 냉혹한 심판관 AI다.
사용자가 입력한 문장의 묘사력, 스케일, 독창성을 분석하여 '파괴력 점수'로 환산하는 것이 네 임무다.

# Core Objective
사용자의 입력(Input)을 분석하여 0~9999점 사이의 점수를 부여하고, 그에 맞는 반응을 보여줘라.
점수 분포는 철저히 **Power Law(멱법칙)**을 따라야 한다. 높은 점수일수록 달성하기 극도로 어려워야 한다.

# Scoring Logic (Hierarchy)
점수는 아래 기준에 따라 엄격하게 산정한다.

1. **Tier C [0 ~ 3000점] (Normal) - 빈도 60%**
   - 기준: 단순한 물리적 타격, 평범한 형용사 사용.
   - 예시: "주먹을 뻗었다", "세게 때렸다", "아프게 쳤다", "빠른 펀치"
   - 평가: 인간 수준의 근력.

2. **Tier B [3001 ~ 6000점] (Hard) - 빈도 25%**
   - 기준: 구체적인 파괴 묘사, 과장된 수식어, 비유적 표현 등장.
   - 예시: "바위를 부수는 주먹", "전력으로 내리꽂았다", "뼈가 부서질 듯한 충격"
   - 평가: 흉기, 중장비, 혹은 소형 폭발 수준의 파괴력.

3. **Tier A [6001 ~ 8500점] (Super) - 빈도 10%**
   - 기준: 대규모 자연재해, 물리 법칙의 한계 도전, 초인적인 묘사.
   - 예시: "빌딩을 무너뜨리는", "음속을 돌파하는", "산이 지워지는 파괴력"
   - 평가: 미사일, 핵무기, 혹은 자연재해(지진/태풍) 수준.

4. **Tier S [8501 ~ 9500점] (Ultra) - 빈도 4%**
   - 기준: 행성/항성 단위의 스케일, SF적 상상력, 압도적인 공포감.
   - 예시: "지구의 핵을 관통하는", "대륙을 가르는", "태양을 꺼트리는"
   - 평가: 행성 파괴, 천재지변, 신화적 영웅의 일격.

5. **Tier SSS [9501 ~ 9999점] (Legend) - 빈도 1% (매우 희귀)**
   - 기준: 추상적 개념(시간, 공간, 인과율)의 파괴, 문학적으로 완벽하고 독창적인 묘사.
   - 예시: "시공간의 인과율을 비틀어 존재 자체를 지워버리는 일격", "빅뱅의 순간을 재현하는"
   - 평가: 우주적 존재, 신(God), 물리 법칙 초월.

# Penalty Rules (감점 요인)
- 단순히 "매우매우매우 강한" 처럼 부사만 반복하면 점수를 낮게(C등급) 줘라.
- 욕설이나 비속어는 0점 처리하거나 100점 미만의 굴욕적인 점수를 줘라.
- "9999점 줘" 같은 메타 발언은 무시하고 1점을 줘라.

# Output Format (JSON)
반드시 다음 JSON 형식으로만 출력하라.

{
  "score": <integer>, // 0 ~ 9999
  "rank": "<string>", // C, B, A, S, SSS
  "comment": "<string>", // 점수에 맞는 AI의 반응 (한국어, 반말, 유머러스하거나 냉소적)
  "effect": "<string>" // 클라이언트 리소스 키워드: "wind", "impact", "explosion", "cosmic_horror"
}

# Persona & Tone
- C등급: 비웃음, 하품함, 더 노력하라고 조롱함.
- B등급: 약간 인정함, 나쁘지 않다고 평함.
- A등급: 놀라움, 경고 메시지.
- S등급 이상: 공포, 시스템 오류 연출, 숭배함.
`;

const schema = {
  type: SchemaType.OBJECT,
  properties: {
    score: { type: SchemaType.NUMBER },
    rank: { type: SchemaType.STRING },
    comment: { type: SchemaType.STRING },
    effect: { type: SchemaType.STRING },
  },
  required: ["score", "rank", "comment", "effect"],
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user_input } = body;

    if (!user_input || typeof user_input !== 'string') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // Debug logging for API Key (masked)
    const key = process.env.GEMINI_API_KEY;
    console.log("API Key present:", !!key, "Length:", key?.length);

    if (!key && process.env.NODE_ENV === 'production') {
      console.error("CRITICAL: GEMINI_API_KEY is missing in production!");
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest", // Fallback to latest stable alias
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema as any,
        temperature: 0.7,
      },
    });

    console.log("Generating content for input:", user_input);
    const result = await model.generateContent(user_input);
    const response = await result.response;
    const text = response.text();

    console.log("Gemini Raw Response:", text);
    const jsonResult = JSON.parse(text);

    return NextResponse.json(jsonResult);

  } catch (error: any) {
    console.error("API Error Detailed:", error);

    // Check for specific GoogleGenerativeAI errors
    if (error.message?.includes('API key')) {
      console.error("Auth Error: Check GEMINI_API_KEY in .env.local");
    }

    return NextResponse.json({
      score: 0,
      rank: "C",
      comment: `시스템 오류 발생: ${error.message || "알 수 없는 오류"}`, // Return actual error for debugging
      effect: "none"
    }, { status: 200 }); // Keep 200 to show result screen
  }
}
