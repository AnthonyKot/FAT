import {
  AIRecommendationRequest,
  AIRecommendationResponse
} from './aiService';

interface AIRankingService {
  getMetricRecommendations(request: AIRecommendationRequest): Promise<AIRecommendationResponse>;
}

export default AIRankingService;
