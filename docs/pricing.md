## Pricing model (15‑minute interview)

### Assumptions
- **Plan**: Creator
- **TTS**: Flash v2 at $0.15 / 1k chars
- **LLM**: Gemini 2.5 Flash Lite at ~$0.0005 / min
- **STT API overage**: $0.48 / hour
- **Conversation AI overage**: ~$0.12 / min
- **Empirical TTS usage**: ~2,319 chars in 5.45 min → ~425 chars/min
- **Payment processing**: Stripe 2.9% + $0.30
- **Payment processing**: Polar 4% + $0.40

### Cost per 15‑min session
- **Conversation AI**: 15 × $0.12 = **$1.80**
- **STT**: 15 × ($0.48/60) ≈ **$0.12**
- **TTS (Flash)**: ~6.4k chars × $0.15/1k ≈ **$0.96**
- **LLM**: 15 × $0.0005 ≈ **$0.01**
- **Variable subtotal**: ≈ **$2.89**
- **Payment fee at price P**: **0.04P + $0.40**

### Recommended price
- **P = $12.99** → fees ≈ **$0.92** → total cost ≈ **$3.81** → gross margin ≈ **70–71%**
- Floor: **$9.99** (~63% margin). Premium anchor: **$14.99** (~74% margin).

### Plan allowances (monthly)
- **ConvAI minutes**: 250 → ~16–17 sessions included (15 min each)
- **TTS credits**: 100k → ~15–16 sessions at ~6.4k chars/session

### Quick formulas
```
convAI = minutes * 0.12
stt = minutes * (0.48/60)
tts = (minutes * charsPerMin / 1000) * 0.15   # Flash v2
llm = minutes * 0.0005
subtotal = convAI + stt + tts + llm
fees(P) = 0.04*P + 0.40
gross_margin = (P - subtotal - fees(P)) / P
```


