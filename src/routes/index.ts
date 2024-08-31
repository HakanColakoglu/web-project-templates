import { Router } from "express";
import { checkRole } from "../middlewares/rolecheck";

const router = Router();

// Simple public route
router.get("/", (req, res) => {
  res.send("Hello, world!");
});

// Protected route that requires authentication
router.get("/protected", (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`User: ${req.user.username}! Your session is active.`);
  } else {
    res.status(401).send("Unauthorized. Please log in.");
  }
});

// Protected route that requires authentication and specific roles
router.get("/admin", checkRole(["admin"]), (req, res) => {
  if (req.isAuthenticated()) {
    res.send(
      `Welcome Admin, ${req.user.username}! You have administrative access.`
    );
  } else {
    res.status(401).send("Unauthorized. Please log in.");
  }
});

router.get("/user", checkRole(["user", "admin"]), (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`Welcome User, ${req.user.username}! You have user access.`);
  } else {
    res.status(401).send("Unauthorized. Please log in.");
  }
});

export default router;
