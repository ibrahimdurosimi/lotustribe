import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

let resendClient: Resend | null = null;
function getResend() {
  if (!resendClient) {
    if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY environment variable is required to send emails.");
    } else {
        resendClient = new Resend(process.env.RESEND_API_KEY);
    }
  }
  return resendClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/send-email", async (req, res) => {
    try {
      const { to, subject, html } = req.body;
      
      const resend = getResend();
      if (!resend) {
        return res.status(500).json({ error: "Email service not configured. Please add RESEND_API_KEY" });
      }

      const { data, error } = await resend.emails.send({
        from: 'onboarding@resend.dev', // Use default testing domain; change to your verified domain for production
        to: [to],
        subject,
        html,
      });

      if (error) {
        return res.status(400).json({ error });
      }

      res.status(200).json({ data });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to send email" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
