import api from './api';
import type {
  User,
  Application,
  Exam,
  ExamSubmission,
  Content,
  Batch,
  Game,
  GameResult,
  ApplicationFormData,
  ApplicationStatusResponse,
  BadgeDefinition,
  StudentBadge,
  BadgeRule,
  Certificate,
} from '@app-types/index';

// User Services
export const userService = {
  async getProfile(): Promise<User> {
    const { data } = await api.get<{ data: User }>('/user/profile');
    return data.data;
  },

  async updateProfile(updates: Partial<User>): Promise<User> {
    const { data } = await api.patch<{ data: User }>('/user/profile', updates);
    return data.data;
  },

  async getUserStats() {
    const { data } = await api.get('/user/stats');
    return data.data;
  },
};

// Application Services
export const applicationService = {
  async submitApplication(formData: ApplicationFormData) {
    try {
      const { data } = await api.post<{ data: any }>('/application', formData);
      return data.data;
    } catch (error: any) {
      const backendMessage = error?.response?.data?.message;
      if (backendMessage) {
        throw new Error(backendMessage);
      }
      throw error;
    }
  },

  async getApplications(): Promise<Application[]> {
    const { data } = await api.get<{ data: Application[] }>('/application');
    return data.data;
  },

  async getApplicationStatus(): Promise<ApplicationStatusResponse> {
    const { data } = await api.get<{ data: ApplicationStatusResponse }>('/application/status');
    return data.data;
  },
};

// Exam Services
export const examService = {
  async getExams(category?: string): Promise<Exam[]> {
    const { data } = await api.get<{ data: { data: any[] } }>('/exams/debug-exams', {
      params: { category },
    });
    // Map _id to id
    return data.data.data.map(exam => ({
      ...exam,
      id: exam._id,
    })) as Exam[];
  },

  async getExam(examId: string): Promise<Exam> {
    const { data } = await api.get<{ data: any }>(`/exams/${examId}`);
    return {
      ...data.data,
      id: data.data._id,
    } as Exam;
  },

  async submitExam(examId: string, submission: ExamSubmission): Promise<ExamSubmission> {
    const { data } = await api.post<{ data: ExamSubmission }>(
      `/exams/${examId}/submit`,
      submission
    );
    return data.data;
  },

  async getExamSubmissions(examId: string): Promise<any[]> {
    const { data } = await api.get<{ data: any[] }>(`/exams/${examId}/submissions`);
    return data.data;
  },
};

// Content Services
export const contentService = {
  async getContent(courseId?: string): Promise<Content[]> {
    const { data } = await api.get<{ data: { data: any[] } }>('/content', {
      params: { courseId },
    });
    return data.data.data.map(item => ({
      ...item,
      id: item._id,
    })) as Content[];
  },

  async getContentItem(contentId: string): Promise<Content> {
    const { data } = await api.get<{ data: any }>(`/content/${contentId}`);
    return {
      ...data.data,
      id: data.data._id,
    } as Content;
  },

  async createContent(content: Partial<Content> | FormData): Promise<Content> {
    const isFormData = content instanceof FormData;
    // Log payload for debugging
    try {
      if (isFormData) {
        // eslint-disable-next-line no-console
        console.debug('[CreateContent] FormData entries:');
        for (const pair of (content as FormData).entries()) {
          // eslint-disable-next-line no-console
          console.debug(pair[0], pair[1]);
        }
      } else {
        // eslint-disable-next-line no-console
        console.debug('[CreateContent] JSON payload:', content);
      }
    } catch (e) {
      // ignore logging errors
    }

    const { data } = await api.post<{ data: Content }>(
      '/content',
      content,
      isFormData
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : { headers: { 'Content-Type': 'application/json' } }
    );
    return data.data;
  },

  async updateContent(contentId: string, content: Partial<Content> | FormData): Promise<Content> {
    const isFormData = content instanceof FormData;
    try {
      if (isFormData) {
        // eslint-disable-next-line no-console
        console.debug('[UpdateContent] FormData entries:');
        for (const pair of (content as FormData).entries()) {
          // eslint-disable-next-line no-console
          console.debug(pair[0], pair[1]);
        }
      } else {
        // eslint-disable-next-line no-console
        console.debug('[UpdateContent] JSON payload:', content);
      }
    } catch (e) {}

    const { data } = await api.patch<{ data: Content }>(
      `/content/${contentId}`,
      content,
      isFormData
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : { headers: { 'Content-Type': 'application/json' } }
    );
    return data.data;
  },

  async deleteContent(contentId: string): Promise<void> {
    await api.delete(`/content/${contentId}`);
  },

  async getMyContent(page?: number, limit?: number): Promise<any> {
    const { data } = await api.get<{ data: any }>('/content/my', {
      params: { page, limit },
    });
    return data.data;
  },

  async markContentAsViewed(contentId: string): Promise<void> {
    await api.patch(`/content/${contentId}/viewed`);
  },
};

// Batch Services
export const batchService = {
  async getBatches(): Promise<Batch[]> {
    const { data } = await api.get<{ data: Batch[] }>('/admin/batches');
    return data.data;
  },

  async getBatch(batchId: string): Promise<Batch> {
    const { data } = await api.get<{ data: Batch }>(`/admin/batches/${batchId}`);
    return data.data;
  },

  async createBatch(batch: Partial<Batch>): Promise<Batch> {
    const { data } = await api.post<{ data: Batch }>('/admin/batches', batch);
    return data.data;
  },

  async updateBatch(batchId: string, updates: Partial<Batch>): Promise<Batch> {
    const { data } = await api.patch<{ data: Batch }>(`/admin/batches/${batchId}`, updates);
    return data.data;
  },
};

export const adminService = {
  async getApplications() {
    const { data } = await api.get<{ data: any[] }>('/admin/applications');
    return data.data;
  },

  async updateApplicationStatus(applicationId: string, status: string) {
    const { data } = await api.patch<{ data: any }>(`/admin/application-status/${applicationId}`, { status });
    return data.data;
  },

  async addteacher(teacherData: any) {
    const { data } = await api.post<{ data: any }>('/admin/add-teacher', teacherData);
    return data.data;
  },

  async getAnalytics() {
    const { data } = await api.get<{ data: any }>('/admin/analytics');
    return data.data;
  },

  async getAllUsers(params?: { role?: string; search?: string; page?: number; limit?: number }) {
    const { data } = await api.get<{ data: { data: any[]; pagination: any } }>('/admin/users', { params });
    return data.data;
  },
};

// Teacher Services
export const teacherService = {
  async getStudents(params?: { search?: string; role?: string }) {
    const { data } = await api.get<{ data: any[] }>('/teacher/students', { params });
    return data.data;
  },

  async getStats(): Promise<{ totalStudents: number }> {
    const { data } = await api.get<{ data: { totalStudents: number } }>('/teacher/stats');
    return data.data;
  },
};

// Badge Services
export const badgeService = {
  async listBadges(): Promise<BadgeDefinition[]> {
    const { data } = await api.get<{ data: BadgeDefinition[] }>('/badges');
    return data.data;
  },

  async createBadge(payload: Partial<BadgeDefinition>): Promise<BadgeDefinition> {
    const { data } = await api.post<{ data: BadgeDefinition }>('/badges', payload);
    return data.data;
  },

  async getStudentBadges(studentId: string): Promise<StudentBadge[]> {
    const { data } = await api.get<{ data: StudentBadge[] }>(`/badges/${studentId}`);
    return data.data;
  },

  async awardBadge(studentId: string, payload: { badgeKey: string; meta?: any }): Promise<StudentBadge> {
    const { data } = await api.post<{ data: StudentBadge }>(`/badges/${studentId}/award`, payload);
    return data.data;
  },

  async evaluateEvent(event: any): Promise<void> {
    await api.post('/badges/evaluate', event);
  },

  async createBadgeRule(payload: { key: string; badgeKey: string; description?: string; conditions: Record<string, any>; active?: boolean }): Promise<BadgeRule> {
    const { data } = await api.post<{ data: BadgeRule }>('/badges/rules', payload);
    return data.data;
  },

  async listBadgeRules(badgeKey?: string): Promise<BadgeRule[]> {
    const { data } = await api.get<{ data: BadgeRule[] }>('/badges/rules', { params: { badgeKey } });
    return data.data;
  },

  async updateBadgeRule(ruleId: string, payload: Partial<BadgeRule>): Promise<BadgeRule> {
    const { data } = await api.patch<{ data: BadgeRule }>(`/badges/rules/${ruleId}`, payload);
    return data.data;
  },

  async deleteBadgeRule(ruleId: string): Promise<void> {
    await api.delete(`/badges/rules/${ruleId}`);
  },
};

// Certification Services
export const certificationService = {
  async createCertificate(payload: {
    studentId: string;
    title: string;
    description?: string;
    category?: string;
    skillLevel?: string;
  }): Promise<Certificate> {
    const { data } = await api.post<{ data: Certificate }>('/certifications', payload);
    return data.data;
  },

  async verifyCertificate(certificateId: string): Promise<Certificate> {
    // public endpoint; cookies not required but harmless
    const { data } = await api.get<{ data: Certificate }>(`/certifications/verify/${certificateId}`);
    return data.data;
  },
};

// Game Services
export const gameService = {
  async getGames(): Promise<Game[]> {
    const { data } = await api.get<{ data: Game[] }>('/user/games');
    return data.data;
  },

  async playGame(gameId: string): Promise<Game> {
    const { data } = await api.post<{ data: Game }>(`/user/games/${gameId}/play`, {});
    return data.data;
  },

  async submitGameResult(gameId: string, result: Omit<GameResult, 'gameId'>): Promise<GameResult> {
    const { data } = await api.post<{ data: GameResult }>(
      `/user/games/${gameId}/result`,
      result
    );
    return data.data;
  },

  async getGameStats(): Promise<any> {
    const { data } = await api.get('/user/games/stats');
    return data.data;
  },
};
