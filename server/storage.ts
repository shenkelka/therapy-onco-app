import { 
  users, 
  therapyEntries, 
  helpRequests, 
  helpResponses,
  type User, 
  type InsertUser,
  type TherapyEntry,
  type InsertTherapyEntry,
  type HelpRequest,
  type InsertHelpRequest,
  type HelpResponse,
  type InsertHelpResponse
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Therapy entry operations
  getTherapyEntries(userId: number): Promise<TherapyEntry[]>;
  getTherapyEntry(id: number): Promise<TherapyEntry | undefined>;
  createTherapyEntry(entry: InsertTherapyEntry): Promise<TherapyEntry>;
  updateTherapyEntry(id: number, entry: InsertTherapyEntry): Promise<TherapyEntry | undefined>;
  
  // Help request operations
  getHelpRequests(): Promise<HelpRequest[]>;
  getHelpRequestsByUser(userId: number): Promise<HelpRequest[]>;
  getHelpRequest(id: number): Promise<HelpRequest | undefined>;
  createHelpRequest(request: InsertHelpRequest): Promise<HelpRequest>;
  updateHelpRequestStatus(id: number, status: string): Promise<HelpRequest | undefined>;
  
  // Help response operations
  getHelpResponsesForRequest(helpRequestId: number): Promise<HelpResponse[]>;
  createHelpResponse(response: InsertHelpResponse): Promise<HelpResponse>;
  updateHelpResponseStatus(id: number, status: string): Promise<HelpResponse | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private therapyEntries: Map<number, TherapyEntry>;
  private helpRequests: Map<number, HelpRequest>;
  private helpResponses: Map<number, HelpResponse>;
  private currentUserId: number;
  private currentTherapyEntryId: number;
  private currentHelpRequestId: number;
  private currentHelpResponseId: number;

  constructor() {
    this.users = new Map();
    this.therapyEntries = new Map();
    this.helpRequests = new Map();
    this.helpResponses = new Map();
    this.currentUserId = 1;
    this.currentTherapyEntryId = 1;
    this.currentHelpRequestId = 1;
    this.currentHelpResponseId = 1;
    
    // Add demo user
    this.createUser({
      username: "maria",
      password: "password",
      name: "Мария",
      age: 35,
      location: "Москва"
    });

    // Add demo therapy entries
    setTimeout(() => {
      this.createTherapyEntry({
        userId: 1,
        date: "2025-01-20",
        cycle: 3,
        cycleDay: 2,
        treatmentType: "targeted",
        medications: "Трастузумаб",
        wellbeingSeverity: 6,
        sideEffects: [],
        physicalActivity: "high",
        physicalActivityType: "gym",
        comments: "Прекрасное самочувствие! Полно энергии, хожу в спортзал",
        mood: "😍"
      });

      this.createTherapyEntry({
        userId: 1,
        date: "2025-01-19",
        cycle: 2,
        cycleDay: 5,
        treatmentType: "chemotherapy",
        medications: "Доксорубицин, Циклофосфамид",
        wellbeingSeverity: 3,
        sideEffects: ["Тошнота", "Усталость"],
        physicalActivity: "moderate",
        physicalActivityType: "walking",
        comments: "Чувствую себя неплохо, принимаю противорвотные",
        mood: "😌"
      });

      this.createTherapyEntry({
        userId: 1,
        date: "2025-01-18",
        cycle: 2,
        cycleDay: 4,
        treatmentType: "hormonal",
        medications: "Тамоксифен",
        wellbeingSeverity: 2,
        sideEffects: ["Приливы", "Слабость"],
        physicalActivity: "none",
        comments: "Приливы мешают спать, но в целом нормально",
        reminder: "Принять таблетку завтра в 20:00",
        mood: "😊"
      });

      this.createTherapyEntry({
        userId: 1,
        date: "2025-01-17",
        cycle: 1,
        cycleDay: 12,
        treatmentType: "targeted",
        medications: "Герцептин",
        wellbeingSeverity: 1,
        sideEffects: [],
        physicalActivity: "high",
        physicalActivityType: "yoga",
        comments: "Отличное самочувствие, хорошая переносимость",
        mood: "😄"
      });

      this.createTherapyEntry({
        userId: 1,
        date: "2025-01-16",
        cycle: 1,
        cycleDay: 8,
        treatmentType: "immunotherapy",
        medications: "Пембролизумаб",
        wellbeingSeverity: 4,
        sideEffects: ["Усталость", "Боль"],
        physicalActivity: "light",
        physicalActivityType: "walking",
        comments: "Чувствую сильную усталость после процедуры",
        mood: "😔"
      });

      this.createTherapyEntry({
        userId: 1,
        date: "2025-01-15",
        cycle: 3,
        cycleDay: 1,
        treatmentType: "radiation",
        medications: "Поддерживающая терапия",
        wellbeingSeverity: 3,
        sideEffects: ["Покраснение кожи"],
        physicalActivity: "moderate",
        physicalActivityType: "swimming",
        comments: "Кожа немного покраснела в области облучения",
        mood: "😐"
      });

      // Add demo help requests
      this.createHelpRequest({
        userId: 1,
        title: "Помочь дойти до аптеки",
        description: "Нужна помощь чтобы добраться до аптеки за лекарствами",
        helpType: "transport",
        location: "район Арбат"
      });

      this.createHelpRequest({
        userId: 1,
        title: "Погулять в парке",
        description: "Ищу компанию для легкой прогулки в парке",
        helpType: "walk",
        location: "Сокольники"
      });
    }, 100);
    
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      location: insertUser.location || null,
      age: insertUser.age || null,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async getTherapyEntries(userId: number): Promise<TherapyEntry[]> {
    return Array.from(this.therapyEntries.values())
      .filter(entry => entry.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getTherapyEntry(id: number): Promise<TherapyEntry | undefined> {
    return this.therapyEntries.get(id);
  }

  async createTherapyEntry(insertEntry: InsertTherapyEntry): Promise<TherapyEntry> {
    const id = this.currentTherapyEntryId++;
    const entry: TherapyEntry = { 
      ...insertEntry,
      id,
      cycle: insertEntry.cycle || null,
      cycleDay: insertEntry.cycleDay || null,
      sideEffects: insertEntry.sideEffects || null,
      physicalActivityType: insertEntry.physicalActivityType || null,
      comments: insertEntry.comments || null,
      reminder: insertEntry.reminder || null,
      mood: insertEntry.mood || null,
      createdAt: new Date()
    };
    this.therapyEntries.set(id, entry);
    return entry;
  }

  async updateTherapyEntry(id: number, insertEntry: InsertTherapyEntry): Promise<TherapyEntry | undefined> {
    const existingEntry = this.therapyEntries.get(id);
    if (!existingEntry) {
      return undefined;
    }

    const updatedEntry: TherapyEntry = { 
      ...insertEntry,
      id,
      cycle: insertEntry.cycle || null,
      cycleDay: insertEntry.cycleDay || null,
      sideEffects: insertEntry.sideEffects || null,
      physicalActivityType: insertEntry.physicalActivityType || null,
      comments: insertEntry.comments || null,
      reminder: insertEntry.reminder || null,
      mood: insertEntry.mood || null,
      createdAt: existingEntry.createdAt // Keep original creation date
    };
    this.therapyEntries.set(id, updatedEntry);
    return updatedEntry;
  }

  async getHelpRequests(): Promise<HelpRequest[]> {
    return Array.from(this.helpRequests.values())
      .filter(request => request.status === "active")
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getHelpRequestsByUser(userId: number): Promise<HelpRequest[]> {
    return Array.from(this.helpRequests.values())
      .filter(request => request.userId === userId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getHelpRequest(id: number): Promise<HelpRequest | undefined> {
    return this.helpRequests.get(id);
  }

  async createHelpRequest(insertRequest: InsertHelpRequest): Promise<HelpRequest> {
    const id = this.currentHelpRequestId++;
    const request: HelpRequest = { 
      ...insertRequest, 
      id,
      location: insertRequest.location || null,
      status: "active",
      createdAt: new Date()
    };
    this.helpRequests.set(id, request);
    return request;
  }

  async updateHelpRequestStatus(id: number, status: string): Promise<HelpRequest | undefined> {
    const request = this.helpRequests.get(id);
    if (request) {
      const updatedRequest = { ...request, status };
      this.helpRequests.set(id, updatedRequest);
      return updatedRequest;
    }
    return undefined;
  }

  async getHelpResponsesForRequest(helpRequestId: number): Promise<HelpResponse[]> {
    return Array.from(this.helpResponses.values())
      .filter(response => response.helpRequestId === helpRequestId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async createHelpResponse(insertResponse: InsertHelpResponse): Promise<HelpResponse> {
    const id = this.currentHelpResponseId++;
    const response: HelpResponse = { 
      ...insertResponse, 
      id,
      message: insertResponse.message || null,
      status: "pending",
      createdAt: new Date()
    };
    this.helpResponses.set(id, response);
    return response;
  }

  async updateHelpResponseStatus(id: number, status: string): Promise<HelpResponse | undefined> {
    const response = this.helpResponses.get(id);
    if (response) {
      const updatedResponse = { ...response, status };
      this.helpResponses.set(id, updatedResponse);
      return updatedResponse;
    }
    return undefined;
  }
}

export const storage = new MemStorage();
