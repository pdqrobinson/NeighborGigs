# NeighborGigs AI Integration Plan

## Executive Summary

This document outlines strategic opportunities for integrating AI into NeighborGigs, a hyper-local peer-to-peer task platform. The integration focuses on enhancing user experience, improving matching efficiency, increasing trust/safety, and driving engagement through personalized recommendations.

**Current State:**
- Mobile-first React app with Hono/Bun backend
- Supabase database with PostGIS for location-based queries
- Task templates dataset (DuckDB) for standardized errands
- Gamification system (points, badges, levels)
- Real-time messaging and task state machine

**AI Integration Goals:**
1. Smart task creation and template matching
2. Intelligent helper-task matching
3. Trust and safety AI monitoring
4. Personalized recommendations and insights
5. Conversational AI for task assistance

---

## 1. Smart Task Creation

### 1.1 AI-Powered Task Description Enhancement

**Problem:** Users struggle to write clear, detailed task descriptions, leading to mismatches and confusion.

**Solution:**
- Real-time suggestion engine as users type task descriptions
- Auto-complete with common errand patterns from template database
- Context-aware prompts based on errand type (grocery, pharmacy, general)

**Implementation:**
```
Frontend: React component with debounced input
Backend API: POST /api/ai/enhance-task-description
AI Model: LLM (GPT-4, Claude, or open-source alternative)
Data Source: neighborgigs-task-templates DuckDB database
```

**Features:**
- Suggest missing details (store name, specific items, time constraints)
- Clarify ambiguous requests
- Auto-categorize using template_tags table
- Suggest appropriate pricing based on typical_price_min/max

**Data Flow:**
```
User types → Partial description → API call → LLM analysis → 
Enhanced description suggestions → Display to user → Auto-fill on accept
```

### 1.2 Template-Based Task Suggestions

**Problem:** Users don't know what tasks are common or what to ask for.

**Solution:**
- Intelligent template matching based on user location, history, and neighborhood trends
- "Quick Select" from task templates with AI ranking

**Implementation:**
```
Frontend: Template grid with AI-recommended tags
Backend API: GET /api/ai/recommended-templates
Data Source: templates, template_steps, template_tags tables
```

**Algorithm:**
1. User's location → Filter templates by neighborhood patterns
2. User's task history → Personalize recommendations
3. Time of day → Suggest time-appropriate errands
4. Seasonal factors → Adjust for holidays, weather, etc.

---

## 2. Intelligent Helper-Task Matching

### 2.1 Multi-Factor Matching Score

**Problem:** Basic radius matching doesn't consider helper capability, availability, or reliability.

**Solution:**
- Composite scoring algorithm using multiple AI models
- Real-time matching with confidence scores

**Scoring Factors:**
| Factor | Weight | AI Model |
|--------|--------|----------|
| Location proximity | 30% | Geospatial (PostGIS) |
| Helper reliability | 25% | Predictive ML |
| Historical performance | 20% | Collaborative filtering |
| Task fit / specialization | 15% | NLP classification |
| Availability timing | 10% | Time series forecasting |

**Implementation:**
```typescript
interface MatchScore {
  helper_id: string;
  task_id: string;
  total_score: number; // 0-100
  confidence: number; // 0-1
  factors: {
    location: number;
    reliability: number;
    performance: number;
    task_fit: number;
    availability: number;
  };
  explanation: string; // AI-generated reason
}

// Backend API
app.post('/api/ai/match-helpers', async (c) => {
  const { task_id, max_results } = await c.req.json();
  // Return ranked helper matches
});
```

### 2.2 Availability Prediction

**Problem:** Helpers' stated availability often doesn't match actual availability.

**Solution:**
- Predict actual availability based on historical patterns
- Learn from acceptance rates, cancellation rates, completion times

**Implementation:**
```
Data Sources:
- broadcasts table (time windows, actual activity)
- tasks table (completion times, delays)
- messages table (response times)

Model: Gradient boosting (XGBoost) or neural network
Features: Time of day, day of week, helper ID, location, errand type
```

---

## 3. Trust and Safety AI

### 3.1 Fraud Detection

**Problem:** Fake tasks, payment fraud, and malicious behavior.

**Solution:**
- Real-time anomaly detection on all transactions
- Risk scoring for new users and tasks

**Detection Areas:**
| Area | Signals | Action |
|------|---------|--------|
| Fake tasks | Suspicious descriptions, odd pricing, no location | Flag for review |
| Payment fraud | Unusual amounts, rapid repeat transactions | Hold payment |
| Account abuse | Multiple accounts from same device/IP | Auto-suspend |

**Implementation:**
```typescript
interface RiskScore {
  user_id: string;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  score: number; // 0-100
  reasons: string[];
  recommended_action: 'allow' | 'flag' | 'block' | 'suspend';
}
```

### 3.2 Content Moderation

**Problem:** Inappropriate messages, spam, harassment.

**Solution:**
- Real-time message filtering using NLP
- Automated flagging and escalation

**Implementation:**
```
Models:
- Text classification (harassment, spam, inappropriate content)
- Sentiment analysis (angry, frustrated, threatening)
- Pattern detection (repetitive messages, phishing attempts)

API: POST /api/ai/moderate-message
Returns: { is_appropriate: boolean, categories: string[], action: string }
```

### 3.3 Trust Score Calculation

**Problem:** Simple ratings don't capture complex trust dynamics.

**Solution:**
- Multi-dimensional trust score updated in real-time
- Explainable trust metrics shown to users

**Trust Dimensions:**
1. **Reliability:** % of tasks completed on time
2. **Responsiveness:** Average message response time
3. **Quality:** Review sentiment analysis
4. **Consistency:** Performance over time (variance)
5. **Community:** Reciprocity (helping others vs. asking)

**Display to users:**
```
Trust Score: 94/100
├── Reliability: 96% ★★★★★
├── Responsiveness: <5min ★★★★★
├── Quality: 4.8/5 ★★★★★
├── Consistency: Stable ★★★★☆
└── Community: Reciprocal ★★★★★
```

---

## 4. Personalized Recommendations

### 4.1 Task Recommendations for Helpers

**Problem:** Helpers don't know what tasks to look for or when to broadcast.

**Solution:**
- Personalized task feed based on helper profile and history
- Smart broadcast timing suggestions

**Recommendation Factors:**
1. Preferred errand types (from history)
2. Usual trip patterns (time, location, store preferences)
3. Earnings goals and trends
4. Neighborhood demand patterns
5. Badge progress (suggest tasks to complete challenges)

**Implementation:**
```typescript
interface TaskRecommendation {
  task_id: string;
  task_summary: string;
  match_score: number;
  reason: string; // AI-generated explanation
  earnings_estimate: number;
  estimated_duration: string;
  urgency: 'low' | 'medium' | 'high';
}

app.get('/api/ai/recommended-tasks', async (c) => {
  const user_id = c.get('user_id');
  // Return personalized task recommendations
});
```

### 4.2 Dynamic Pricing Suggestions

**Problem:** Users don't know what to offer/pay for tasks.

**Solution:**
- AI pricing engine based on market rates and factors

**Pricing Model Inputs:**
- Task type and category (from templates)
- Distance and travel time
- Time of day / urgency
- Local market rates (neighborhood-specific)
- Supply/demand balance
- Helper availability

**Implementation:**
```
Model: Regression model with ensemble methods
Training Data: Historical task completions with prices
Output: Suggested price range with confidence interval

API: POST /api/ai/suggest-price
Input: { task_description, location, deadline, category }
Output: { suggested_min: 10, suggested_max: 15, confidence: 0.85, factors: {...} }
```

### 4.3 Neighborhood Insights Dashboard

**Problem:** Users lack visibility into neighborhood activity patterns.

**Solution:**
- AI-powered analytics dashboard showing trends, opportunities, and patterns

**Dashboard Features:**
- Peak times for different errand types
- Most requested tasks this week/month
- Price trends by category
- Helper availability heat map
- Seasonal patterns
- Competitive analysis (for ambassadors)

**Implementation:**
```typescript
interface NeighborhoodInsights {
  peak_times: { errand_type: string, hours: number[], demand_level: number }[];
  top_tasks: { task_name: string, count: number, trend: 'up' | 'down' | 'stable' }[];
  price_trends: { category: string, avg_price: number, change_pct: number }[];
  availability: { time_range: string, available_helpers: number }[];
  opportunities: { description: string, potential: string }[];
}
```

---

## 5. Conversational AI Assistant

### 5.1 AI Task Assistant

**Problem:** Users have questions during task creation, execution, or resolution.

**Solution:**
- In-app AI assistant for task guidance
- Proactive suggestions and help

**Assistant Capabilities:**
1. **Task Creation:** "Help me write a good task description"
2. **Pricing:** "What should I pay for this?"
3. **Matching:** "Why wasn't my task matched?"
4. **Disputes:** "How do I handle this issue?"
5. **Safety:** "Is this request suspicious?"

**Implementation:**
```
Frontend: Floating chat widget with AI assistant
Backend: RAG (Retrieval-Augmented Generation) using:
- App documentation
- Help center articles
- FAQs
- User reviews and feedback patterns

Model: LLM with fine-tuning for NeighborGigs context
```

### 5.2 Broadcast Assistant

**Problem:** Helpers don't optimize their broadcasts for maximum matches.

**Solution:**
- AI coach for creating effective broadcasts
- Suggestions on timing, radius, and messaging

**Features:**
- Suggest optimal broadcast times based on neighborhood patterns
- Recommend radius based on errand type and demand
- Help write engaging broadcast notes
- Real-time feedback on broadcast quality

**Implementation:**
```
UI: Broadcast form with AI suggestions sidebar
API: POST /api/ai/optimize-broadcast
Input: { errand_type, leaving_at, radius, note }
Output: { optimized_radius: 2.5, optimal_time: '3:45 PM', suggestions: [] }
```

### 5.3 Post-Task Review Assistant

**Problem:** Reviews are often vague or emotional, not helpful.

**Solution:**
- Guided review prompts with AI suggestions
- Auto-generate review summary from task messages

**Features:**
- Ask specific questions based on task type
- Suggest constructive feedback
- Summarize key points from messages
- Detect inappropriate review content

**Implementation:**
```
UI: Review form with AI-generated prompts
API: POST /api/ai/generate-review-prompts
Input: { task_id, messages[], task_type }
Output: { prompts: ['How was communication?', 'Was the helper punctual?', ...] }
```

---

## 6. Technical Architecture

### 6.1 System Components

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Task Creation│  │ Match Feed   │  │ AI Assistant │       │
│  │ with AI UI  │  │ with Ranking │  │ Chat Widget  │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Backend (Hono/Bun)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ AI Endpoints │  │ Business     │  │ Database     │       │
│  │ /api/ai/*   │  │ Logic Layer  │  │ Access       │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AI Services Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ LLM Service  │  │ ML Models    │  │ Vector DB    │       │
│  │ (OpenAI/Anthropic│ (XGBoost/NN)  │ (Pinecone)    │       │
│  │ / Open Source)│  │              │  │              │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Data Layer                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Supabase     │  │ Task         │  │ User Event   │       │
│  │ (PostgreSQL) │  │ Templates    │  │ Analytics    │       │
│  │              │  │ (DuckDB)     │  │              │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 AI API Endpoints

**Task Enhancement:**
```
POST /api/ai/enhance-task-description
POST /api/ai/categorize-task
GET  /api/ai/recommended-templates
POST /api/ai/suggest-price
```

**Matching:**
```
POST /api/ai/match-helpers
POST /api/ai/predict-availability
GET  /api/ai/match-scores
```

**Trust & Safety:**
```
POST /api/ai/assess-risk
POST /api/ai/moderate-message
GET  /api/ai/trust-score/:user_id
GET  /api/ai/trust-explanation/:user_id
```

**Recommendations:**
```
GET  /api/ai/recommended-tasks
GET  /api/ai/recommended-broadcasts
GET  /api/ai/neighborhood-insights
POST /api/ai/optimize-broadcast
```

**Assistant:**
```
POST /api/ai/assistant/chat
POST /api/ai/generate-review-prompts
POST /api/ai/summarize-task
```

### 6.3 Model Selection

| Use Case | Model Type | Recommendations |
|----------|-----------|-----------------|
| Text enhancement | LLM | GPT-4o, Claude 3.5 Sonnet |
| Task classification | NLP | Fine-tuned BERT/Roberta |
| Matching scoring | ML | XGBoost, LightGBM |
| Fraud detection | Anomaly | Isolation Forest, Autoencoder |
| Availability prediction | Time series | Prophet, LSTM |
| Trust scoring | Ensemble | XGBoost + Neural Network |
| Content moderation | NLP | OpenAI Moderation API, Perspective API |

### 6.4 Data Requirements

**Existing Data:**
- `users` table - profile, location, ratings
- `tasks` table - task details, status, pricing
- `broadcasts` table - helper trips, locations
- `messages` table - chat history
- `reviews` table - user feedback
- `neighborgigs-task-templates` DuckDB - task patterns

**New Data to Collect:**
```
-- AI feature flags
ALTER TABLE users ADD COLUMN ai_enabled BOOLEAN DEFAULT true;
ALTER TABLE tasks ADD COLUMN ai_match_score INTEGER;
ALTER TABLE tasks ADD COLUMN ai_risk_score INTEGER;
ALTER TABLE tasks ADD COLUMN ai_suggested_price INTEGER;

-- Event tracking
CREATE TABLE ai_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  event_type TEXT NOT NULL,
  model_version TEXT,
  input_data JSONB,
  output_data JSONB,
  confidence_score NUMERIC,
  feedback_received BOOLEAN DEFAULT false,
  feedback_rating INTEGER CHECK (feedback_rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Model training data
CREATE TABLE ml_training_samples (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  model_name TEXT NOT NULL,
  features JSONB NOT NULL,
  label TEXT NOT NULL,
  weight NUMERIC DEFAULT 1.0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 6.5 Deployment Strategy

**Phase 1: Quick Wins (1-2 weeks)**
- Task description enhancement (LLM)
- Template-based suggestions (simple rules)
- Basic price suggestions (regression from templates)
- Content moderation (API integration)

**Phase 2: Core Matching (3-4 weeks)**
- Multi-factor matching score
- Helper availability prediction
- Trust score calculation
- Risk assessment system

**Phase 3: Personalization (2-3 weeks)**
- Personalized task recommendations
- Neighborhood insights dashboard
- AI assistant chat widget

**Phase 4: Optimization (ongoing)**
- Model retraining pipeline
- A/B testing framework
- Feedback collection and improvement

---

## 7. Privacy and Ethics Considerations

### 7.1 Data Privacy

**Principles:**
- Minimize personal data collection
- Use anonymized data for model training where possible
- Provide transparency about AI decisions
- Allow users to opt-out of AI features

**Implementation:**
```
-- Add user preferences
ALTER TABLE users ADD COLUMN ai_consent_level TEXT 
  CHECK (ai_consent_level IN ('full', 'basic', 'minimal', 'none'));

ALTER TABLE users ADD COLUMN explainable_ai BOOLEAN DEFAULT true;
```

### 7.2 Explainable AI

**Requirement:** Users must understand why AI makes certain decisions.

**Implementation:**
- Show match score breakdown
- Provide reasons for recommendations
- Highlight risk factors for flagged content
- Explain pricing suggestions

**Example UI:**
```
Match Score: 87/100
Why this match?
├── Location: Perfect (0.3 miles away)
├── Reliability: Excellent (98% completion)
├── Experience: Similar tasks completed (15x)
└── Availability: Likely free (based on patterns)
```

### 7.3 Bias Mitigation

**Concerns:**
- Location bias (neighborhood redlining)
- Demographic bias (age, gender, race)
- Reputation bias (new users have no history)

**Mitigation Strategies:**
- Fairness-aware model training
- Regular bias audits
- Diversity requirements in matching
- Boost for new users in early stages

---

## 8. Success Metrics

### 8.1 User Engagement
- Task creation completion rate ↑
- Time to first task match ↓
- User session duration ↑
- Messages per task ↑

### 8.2 Matching Quality
- Acceptance rate (helper accepts offered task) ↑
- Task completion rate ↑
- Cancellation rate ↓
- Dispute rate ↓

### 8.3 Trust & Safety
- Fraud incidents ↓
- Inappropriate content flagged ↑ (caught by AI)
- Trust score correlation with actual outcomes ↑
- Safety incident rate ↓

### 8.4 Business Impact
- Task volume ↑
- Revenue per task (better pricing) ↑
- User retention ↑
- Net Promoter Score (NPS) ↑

### 8.5 AI Performance
- AI suggestion acceptance rate ↑
- Average confidence score ↑
- Model accuracy (precision/recall) ↑
- Feedback positive rating ↑

---

## 9. Next Steps

### Immediate (Planning Complete)
1. Review and approve this plan
2. Choose AI/ML vendor or open-source stack
3. Set up development environment
4. Define success metrics and KPIs

### Phase 1 (Week 1-2)
1. Implement basic AI service layer
2. Connect to LLM API (OpenAI, Anthropic, or local)
3. Build task description enhancement
4. Deploy content moderation

### Phase 2 (Week 3-4)
1. Implement matching scoring algorithm
2. Train availability prediction model
3. Build trust score calculation
4. Create risk assessment system

### Phase 3 (Week 5-6)
1. Deploy personalized recommendations
2. Build neighborhood insights dashboard
3. Create AI assistant chat widget
4. A/B testing framework

### Ongoing
1. Model monitoring and retraining
2. Feature performance analysis
3. User feedback collection
4. Bias and fairness audits

---

## Appendix A: Example Integration Code

### A.1 Task Enhancement Endpoint

```typescript
// server.ts - Add AI endpoint
import { enhanceTaskDescription } from './ai/services/task-enhancer';

app.post('/api/ai/enhance-task-description', async (c) => {
  try {
    const { description, category } = await c.req.json();
    
    const enhancement = await enhanceTaskDescription(description, {
      category,
      useTemplates: true
    });
    
    return c.json({
      enhanced_description: enhancement.text,
      suggested_category: enhancement.category,
      suggested_price: enhancement.price,
      missing_details: enhancement.missing_details,
      confidence: enhancement.confidence
    });
  } catch (error) {
    return c.json({ error: 'Enhancement failed' }, 500);
  }
});
```

### A.2 Matching Endpoint

```typescript
// server.ts - Add matching endpoint
import { matchHelpersForTask } from './ai/services/matcher';

app.post('/api/ai/match-helpers', async (c) => {
  try {
    const { task_id, max_results = 10 } = await c.req.json();
    
    const matches = await matchHelpersForTask(task_id, {
      maxResults: max_results,
      includeExplanation: true,
      minConfidence: 0.6
    });
    
    return c.json({
      matches: matches.map(m => ({
        helper_id: m.helper_id,
        score: m.total_score,
        confidence: m.confidence,
        explanation: m.explanation,
        factors: m.factors
      }))
    });
  } catch (error) {
    return c.json({ error: 'Matching failed' }, 500);
  }
});
```

### A.3 AI Service Layer

```typescript
// backend-lib/ai/services/task-enhancer.ts
import { Database } from 'bun:sqlite';

export async function enhanceTaskDescription(
  description: string,
  options: { category?: string, useTemplates?: boolean }
): Promise<Enhancement> {
  const templatesDB = new Database('../neighborgigs-task-templates/data.duckdb');
  
  // 1. Analyze with LLM
  const llmAnalysis = await analyzeWithLLM(description);
  
  // 2. Find similar templates if requested
  let similarTemplates = [];
  if (options.useTemplates) {
    similarTemplates = templatesDB.query(`
      SELECT name, description, typical_price_min, typical_price_max
      FROM templates
      WHERE similarity(description, ?) > 0.3
      ORDER BY similarity(description, ?) DESC
      LIMIT 5
    `).all(description, description);
  }
  
  // 3. Generate enhancement
  return {
    text: generateEnhancedText(description, llmAnalysis, similarTemplates),
    category: llmAnalysis.category || options.category,
    price: estimatePrice(llmAnalysis, similarTemplates),
    missing_details: identifyMissingDetails(llmAnalysis),
    confidence: llmAnalysis.confidence
  };
}
```

---

## Appendix B: Cost Estimates

### AI/ML Service Costs

| Service | Usage | Monthly Cost |
|---------|-------|--------------|
| LLM API (GPT-4o) | ~100K tokens/day | $500-1,000 |
| Embedding API | ~50K tasks/day | $100-200 |
| Content Moderation API | ~10K messages/day | $50-100 |
| Vector Database (Pinecone) | 1M embeddings | $70-150 |
| Hosting for ML models | 2-4 GPU instances | $200-400 |
| **Total** | | **$920-1,850** |

*Note: Costs can be reduced by using open-source models (Llama, Mistral) with self-hosting.*

### Development Effort

| Phase | Timeline | Resources |
|-------|----------|-----------|
| Phase 1: Quick Wins | 2 weeks | 1 backend dev, 1 frontend dev |
| Phase 2: Core Matching | 4 weeks | 1 ML engineer, 1 backend dev |
| Phase 3: Personalization | 3 weeks | 1 ML engineer, 1 frontend dev |
| **Total** | **9 weeks** | **2-3 engineers** |

---

## Appendix C: References

- Task Templates Database: `file 'neighborgigs-task-templates/'`
- Supabase Schema: `file 'NeighborGigs/backend/supabase/schema.sql'`
- Backend Server: `file 'NeighborGigs/neighborgigs-web/server.ts'`
- Frontend Pages: `file 'NeighborGigs/neighborgigs-web/src/pages/'`

---

**Document Version:** 1.0  
**Last Updated:** 2026-01-18  
**Author:** Planning Phase - No Actions Taken
