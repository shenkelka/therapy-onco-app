import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTherapyEntrySchema, insertHelpRequestSchema, insertHelpResponseSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get current user (demo user for MVP)
  app.get("/api/user", async (req, res) => {
    try {
      const user = await storage.getUser(1); // Demo user
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Therapy entries endpoints
  app.get("/api/therapy-entries", async (req, res) => {
    try {
      const userId = 1; // Demo user
      const entries = await storage.getTherapyEntries(userId);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to get therapy entries" });
    }
  });

  app.post("/api/therapy-entries", async (req, res) => {
    try {
      const validatedData = insertTherapyEntrySchema.parse({
        ...req.body,
        userId: 1, // Demo user
      });
      const entry = await storage.createTherapyEntry(validatedData);
      res.status(201).json(entry);
    } catch (error) {
      res.status(400).json({ message: "Invalid therapy entry data", error });
    }
  });

  app.get("/api/therapy-entries/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const entry = await storage.getTherapyEntry(id);
      if (!entry) {
        return res.status(404).json({ message: "Therapy entry not found" });
      }
      res.json(entry);
    } catch (error) {
      res.status(500).json({ message: "Failed to get therapy entry" });
    }
  });

  app.put("/api/therapy-entries/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertTherapyEntrySchema.parse({
        ...req.body,
        userId: 1, // Demo user
      });
      const updatedEntry = await storage.updateTherapyEntry(id, validatedData);
      if (!updatedEntry) {
        return res.status(404).json({ message: "Therapy entry not found" });
      }
      res.json(updatedEntry);
    } catch (error) {
      res.status(400).json({ message: "Invalid therapy entry data", error });
    }
  });

  // Help requests endpoints
  app.get("/api/help-requests", async (req, res) => {
    try {
      const requests = await storage.getHelpRequests();
      // Add user names to requests
      const requestsWithUsers = await Promise.all(
        requests.map(async (request) => {
          const user = await storage.getUser(request.userId);
          return {
            ...request,
            user: user ? { name: user.name, age: user.age, location: user.location } : null
          };
        })
      );
      res.json(requestsWithUsers);
    } catch (error) {
      res.status(500).json({ message: "Failed to get help requests" });
    }
  });

  app.post("/api/help-requests", async (req, res) => {
    try {
      const validatedData = insertHelpRequestSchema.parse({
        ...req.body,
        userId: 1, // Demo user
      });
      const request = await storage.createHelpRequest(validatedData);
      res.status(201).json(request);
    } catch (error) {
      res.status(400).json({ message: "Invalid help request data", error });
    }
  });

  app.get("/api/help-requests/my", async (req, res) => {
    try {
      const userId = 1; // Demo user
      const requests = await storage.getHelpRequestsByUser(userId);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user's help requests" });
    }
  });

  // Help responses endpoints
  app.post("/api/help-responses", async (req, res) => {
    try {
      const validatedData = insertHelpResponseSchema.parse({
        ...req.body,
        userId: 1, // Demo user
      });
      const response = await storage.createHelpResponse(validatedData);
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ message: "Invalid help response data", error });
    }
  });

  app.get("/api/help-requests/:id/responses", async (req, res) => {
    try {
      const helpRequestId = parseInt(req.params.id);
      const responses = await storage.getHelpResponsesForRequest(helpRequestId);
      res.json(responses);
    } catch (error) {
      res.status(500).json({ message: "Failed to get help responses" });
    }
  });

  // Recommendations endpoint (basic implementation)
  app.get("/api/recommendations", async (req, res) => {
    try {
      const { treatmentType, sideEffects, wellbeing } = req.query;
      
      const recommendations = {
        nutrition: [] as string[],
        activity: [] as string[],
        articles: [] as { title: string; url: string }[],
        supportMessage: ""
      };

      const sideEffectsArray = typeof sideEffects === 'string' ? sideEffects.split(',') : [];

      // Basic nutrition recommendations
      if (sideEffectsArray.includes("nausea")) {
        recommendations.nutrition.push("Попробуйте имбирный чай для уменьшения тошноты");
        recommendations.nutrition.push("Ешьте небольшими порциями каждые 2-3 часа");
      }
      
      if (sideEffectsArray.includes("fatigue")) {
        recommendations.nutrition.push("Включите в рацион продукты с железом");
        recommendations.activity.push("Легкая йога или дыхательные упражнения");
      }

      // Activity recommendations based on wellbeing
      const wellbeingScore = parseInt((wellbeing as string) || "3");
      if (wellbeingScore <= 2) {
        recommendations.activity.push("Короткие прогулки на свежем воздухе");
      } else if (wellbeingScore >= 4) {
        recommendations.activity.push("Отдых и медитация");
      }

      // Supportive message
      recommendations.supportMessage = "Помните: каждый день лечения - это шаг к выздоровлению. Вы справляетесь!";

      // Basic articles
      recommendations.articles.push({
        title: "Как справиться с побочными эффектами химиотерапии",
        url: "#"
      });
      recommendations.articles.push({
        title: "Питание во время лечения онкологии",
        url: "#"
      });

      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: "Failed to get recommendations" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
