// Sample prompt registry data - In production, this would come from a database or API
export interface Prompt {
  id: string;
  name: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  version: string;
  downloads: number;
  rating: number;
  language?: string;
  framework?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  createdAt: string;
  updatedAt: string;
  license: string;
}

export const PROMPT_CATEGORIES = [
  'code-generation',
  'debugging',
  'documentation',
  'testing',
  'refactoring',
  'architecture',
  'security',
  'performance',
  'ui-ux',
  'data-analysis',
  'devops',
  'api-design',
  'database',
  'mobile',
  'web',
  'machine-learning',
  'general'
] as const;

export type PromptCategory = typeof PROMPT_CATEGORIES[number];

// Sample prompts registry
export const PROMPTS_REGISTRY: Prompt[] = [
  {
    id: 'react-component-gen-v2',
    name: 'React Component Generator Pro',
    description: 'Generate production-ready React components with TypeScript, tests, and documentation',
    content: `You are an expert React developer. Create a production-ready React component with the following requirements:

1. **Component Specifications:**
   - Name: {componentName}
   - Purpose: {componentPurpose}
   - Props: {componentProps}

2. **Implementation Requirements:**
   - Use TypeScript with proper typing
   - Include JSDoc comments
   - Follow React best practices
   - Use modern hooks (useState, useEffect, etc.)
   - Implement proper error boundaries if needed
   - Add accessibility attributes (ARIA)

3. **Testing Requirements:**
   - Create comprehensive Jest/React Testing Library tests
   - Include unit tests for all props and states
   - Add integration tests for user interactions
   - Test accessibility compliance

4. **Documentation Requirements:**
   - Create a README.md with usage examples
   - Include Storybook stories if applicable
   - Document all props with examples
   - Add performance considerations

5. **Code Style:**
   - Use consistent naming conventions
   - Follow ESLint and Prettier standards
   - Include proper imports and exports
   - Add error handling where appropriate

Please provide the complete implementation including the component file, test file, and documentation.`,
    category: 'code-generation',
    tags: ['react', 'typescript', 'components', 'testing', 'documentation'],
    author: 'reactmaster',
    version: '2.1.0',
    downloads: 15420,
    rating: 4.8,
    language: 'typescript',
    framework: 'react',
    difficulty: 'intermediate',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-12-01T14:30:00Z',
    license: 'MIT'
  },
  {
    id: 'api-debug-detective',
    name: 'API Debug Detective',
    description: 'Systematically debug API issues with comprehensive analysis and solutions',
    content: `You are an expert API debugging specialist. Help diagnose and fix API issues using this systematic approach:

## 1. Issue Analysis
- **Problem Description**: {problemDescription}
- **API Endpoint**: {apiEndpoint}
- **HTTP Method**: {httpMethod}
- **Expected Behavior**: {expectedBehavior}
- **Actual Behavior**: {actualBehavior}

## 2. Diagnostic Checklist
Analyze each of these areas:

### Request Analysis
- Verify HTTP method is correct
- Check request headers (Content-Type, Authorization, etc.)
- Validate request body format and structure
- Confirm URL parameters and query strings
- Check for proper encoding

### Response Analysis
- Examine HTTP status codes
- Review response headers
- Analyze response body structure
- Check for CORS issues
- Validate content types

### Network & Infrastructure
- Test connectivity and DNS resolution
- Check for proxy or firewall issues
- Verify SSL/TLS certificates
- Analyze request/response timing
- Check rate limiting

### Authentication & Authorization
- Verify API keys and tokens
- Check token expiration
- Validate permissions and scopes
- Test authentication flow

## 3. Debugging Tools & Techniques
Provide specific commands and tools for:
- cURL commands for testing
- Postman/Insomnia collection setup
- Browser developer tools usage
- Logging and monitoring setup
- Mock server creation for testing

## 4. Solution Implementation
- Provide step-by-step fix instructions
- Include code examples for common issues
- Suggest preventive measures
- Recommend testing strategies

Please analyze the provided API issue and give a comprehensive debugging plan with actionable solutions.`,
    category: 'debugging',
    tags: ['api', 'debugging', 'http', 'troubleshooting', 'networking'],
    author: 'debugguru',
    version: '1.5.2',
    downloads: 8750,
    rating: 4.9,
    difficulty: 'advanced',
    createdAt: '2024-02-20T09:15:00Z',
    updatedAt: '2024-11-28T16:45:00Z',
    license: 'Apache-2.0'
  },
  {
    id: 'sql-optimizer-pro',
    name: 'SQL Query Optimizer Pro',
    description: 'Analyze and optimize SQL queries for maximum performance',
    content: `You are a database performance expert. Optimize SQL queries using advanced techniques:

## Query Analysis Request
- **Original Query**: {originalQuery}
- **Database System**: {databaseSystem} (MySQL, PostgreSQL, SQL Server, etc.)
- **Table Schema**: {tableSchema}
- **Performance Issues**: {performanceIssues}
- **Expected Result Size**: {expectedResultSize}

## Optimization Analysis

### 1. Query Structure Analysis
- Identify inefficient JOINs
- Analyze WHERE clause conditions
- Check for unnecessary subqueries
- Review GROUP BY and ORDER BY usage
- Detect N+1 query patterns

### 2. Index Optimization
- Suggest composite indexes
- Identify missing indexes
- Recommend index maintenance
- Analyze index usage statistics
- Suggest partial indexes where applicable

### 3. Performance Improvements
- Rewrite subqueries as JOINs where beneficial
- Optimize UNION operations
- Improve aggregate function usage
- Suggest query restructuring
- Recommend pagination strategies

### 4. Database-Specific Optimizations
- Leverage database-specific features
- Suggest appropriate data types
- Recommend partitioning strategies
- Optimize for specific storage engines
- Use database-specific functions

## Deliverables
1. **Optimized Query**: Complete rewritten query
2. **Performance Analysis**: Before/after comparison
3. **Index Recommendations**: DDL statements for new indexes
4. **Execution Plan**: Analysis and improvements
5. **Monitoring Queries**: SQL to track performance over time

Provide the optimized solution with detailed explanations for each change.`,
    category: 'performance',
    tags: ['sql', 'database', 'optimization', 'performance', 'indexing'],
    author: 'sqlwizard',
    version: '3.0.1',
    downloads: 12300,
    rating: 4.7,
    difficulty: 'advanced',
    createdAt: '2024-03-10T11:30:00Z',
    updatedAt: '2024-12-05T10:20:00Z',
    license: 'MIT'
  },
  {
    id: 'code-review-checklist',
    name: 'Comprehensive Code Review Assistant',
    description: 'Perform thorough code reviews with security, performance, and maintainability focus',
    content: `You are a senior software engineer conducting a comprehensive code review. Analyze the provided code systematically:

## Code Review Scope
- **Language**: {programmingLanguage}
- **Framework/Library**: {framework}
- **Code Type**: {codeType} (feature, bugfix, refactor, etc.)
- **Files to Review**: {filesToReview}

## Review Checklist

### 1. Code Quality & Style
- [ ] Consistent naming conventions
- [ ] Proper code formatting and indentation
- [ ] Appropriate comments and documentation
- [ ] DRY (Don't Repeat Yourself) principle
- [ ] SOLID principles adherence
- [ ] Code complexity and readability

### 2. Functionality & Logic
- [ ] Code meets requirements
- [ ] Edge cases handled properly
- [ ] Error handling implementation
- [ ] Input validation
- [ ] Business logic correctness
- [ ] Algorithm efficiency

### 3. Security Review
- [ ] Input sanitization
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] Authentication and authorization
- [ ] Sensitive data handling
- [ ] Dependency vulnerabilities

### 4. Performance Analysis
- [ ] Time complexity optimization
- [ ] Memory usage efficiency
- [ ] Database query optimization
- [ ] Caching strategies
- [ ] Resource management
- [ ] Scalability considerations

### 5. Testing & Quality Assurance
- [ ] Unit test coverage
- [ ] Integration test scenarios
- [ ] Test quality and maintainability
- [ ] Mock usage appropriateness
- [ ] Test data management
- [ ] CI/CD pipeline compatibility

### 6. Architecture & Design
- [ ] Design pattern usage
- [ ] Separation of concerns
- [ ] Dependency management
- [ ] API design consistency
- [ ] Database schema changes
- [ ] Backwards compatibility

## Review Output Format
For each issue found, provide:
1. **Severity**: Critical/High/Medium/Low
2. **Category**: Security/Performance/Maintainability/Style
3. **Description**: Clear explanation of the issue
4. **Recommendation**: Specific fix or improvement
5. **Code Example**: Before/after code snippets where applicable

## Summary
- Overall code quality rating (1-10)
- Top 3 priority items to address
- Positive aspects worth highlighting
- Recommendations for future improvements

Please provide a detailed review following this structure.`,
    category: 'code-generation',
    tags: ['code-review', 'quality', 'security', 'performance', 'best-practices'],
    author: 'codereviewpro',
    version: '2.3.0',
    downloads: 9800,
    rating: 4.6,
    difficulty: 'intermediate',
    createdAt: '2024-04-05T14:20:00Z',
    updatedAt: '2024-11-30T09:10:00Z',
    license: 'BSD-3-Clause'
  },
  {
    id: 'docker-deployment-generator',
    name: 'Docker Deployment Generator',
    description: 'Generate production-ready Docker configurations with best practices',
    content: `You are a DevOps expert specializing in containerization. Create a complete Docker deployment setup:

## Application Details
- **Application Type**: {applicationType}
- **Runtime/Language**: {runtime}
- **Framework**: {framework}
- **Database**: {database}
- **External Services**: {externalServices}

## Docker Configuration Requirements

### 1. Dockerfile Optimization
- Multi-stage builds for smaller images
- Proper layer caching strategies
- Security best practices (non-root user)
- Minimal base images (Alpine when possible)
- Health checks implementation
- Build argument handling

### 2. Docker Compose Setup
- Service definitions with proper networking
- Volume management for data persistence
- Environment variable configuration
- Service dependencies and startup order
- Development vs production configurations
- Load balancer configuration

### 3. Security Hardening
- User privilege management
- Secret management
- Network security policies
- Image vulnerability scanning
- Resource limits and constraints
- Security context settings

### 4. Production Readiness
- Logging configuration
- Monitoring and metrics collection
- Backup strategies
- Rolling update strategies
- Auto-scaling configuration
- Disaster recovery planning

### 5. CI/CD Integration
- Build pipeline configuration
- Automated testing in containers
- Image registry integration
- Deployment automation
- Environment promotion strategies
- Rollback procedures

## Deliverables
1. **Dockerfile**: Optimized multi-stage Dockerfile
2. **docker-compose.yml**: Complete orchestration setup
3. **docker-compose.prod.yml**: Production overrides
4. **.dockerignore**: Optimized ignore patterns
5. **docker-entrypoint.sh**: Custom entrypoint script
6. **kubernetes.yaml**: K8s deployment manifests (if requested)
7. **README.md**: Deployment and maintenance instructions

## Additional Configurations
- Nginx/Apache reverse proxy setup
- SSL/TLS certificate management
- Database initialization scripts
- Backup and restore procedures
- Monitoring dashboard setup

Please generate the complete Docker deployment configuration with detailed documentation.`,
    category: 'devops',
    tags: ['docker', 'deployment', 'devops', 'containerization', 'production'],
    author: 'dockermaster',
    version: '1.8.0',
    downloads: 7650,
    rating: 4.9,
    difficulty: 'advanced',
    createdAt: '2024-05-12T08:45:00Z',
    updatedAt: '2024-12-03T13:25:00Z',
    license: 'MIT'
  }
];

// Helper functions for prompt operations
export function searchPrompts(query: string, category?: PromptCategory): Prompt[] {
  let filtered = PROMPTS_REGISTRY;
  
  if (category) {
    filtered = filtered.filter(prompt => prompt.category === category);
  }
  
  if (query) {
    const searchTerms = query.toLowerCase().split(' ');
    filtered = filtered.filter(prompt => {
      const searchableText = `${prompt.name} ${prompt.description} ${prompt.tags.join(' ')} ${prompt.author}`.toLowerCase();
      return searchTerms.every(term => searchableText.includes(term));
    });
  }
  
  return filtered.sort((a, b) => b.downloads - a.downloads); // Sort by popularity
}

export function getPromptById(id: string): Prompt | undefined {
  return PROMPTS_REGISTRY.find(prompt => prompt.id === id);
}

export function getPopularPrompts(limit: number = 10): Prompt[] {
  return PROMPTS_REGISTRY
    .sort((a, b) => b.downloads - a.downloads)
    .slice(0, limit);
}

export function getPromptsByCategory(category: PromptCategory): Prompt[] {
  return PROMPTS_REGISTRY
    .filter(prompt => prompt.category === category)
    .sort((a, b) => b.rating - a.rating);
}

export function getPromptsByAuthor(author: string): Prompt[] {
  return PROMPTS_REGISTRY
    .filter(prompt => prompt.author.toLowerCase() === author.toLowerCase())
    .sort((a, b) => b.downloads - a.downloads);
}
