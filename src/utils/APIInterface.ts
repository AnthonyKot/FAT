interface APIClient {
  get(endpoint: string, params?: Record<string, string>): Promise<any>;
  // Add other necessary methods here
}

export default APIClient;
