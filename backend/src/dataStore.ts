import { v4 as uuidv4 } from "uuid";
import { DataStore, Session, SessionStore } from "./constants/types";


const sessionStore: SessionStore = { sessions: [] };
let database: DataStore = {
  users: [],
};

// Note: Using in-memory storage. Consider moving to Prisma for production.
////////////////////////////// SESSION UTILS  ////////////////////////////////

export function saveSessions() {
  // In-memory storage - sessions are automatically saved
  // Consider implementing Prisma-based session storage for production
}

export function loadSessions() {
  // In-memory storage - sessions are always loaded
  // Consider implementing Prisma-based session loading for production
}

export function generateSessionId() {
  return uuidv4();
}

export function getSessions(): Session[] {
  return sessionStore.sessions;
}

export function setSessions(sessions: Session[]) {
  sessionStore.sessions = sessions;
  saveSessions();
}

////////////////////////////// DATA UTILS  ///////////////////////////////////

export function saveData() {
  // In-memory storage - data is automatically saved
  // Consider using Prisma user service for production
}

export function loadData() {
  // In-memory storage - data is always loaded
  // Consider using Prisma user service for production
}

export function getData() {
  return database;
}

export function setData(newData: DataStore) {
  database = newData;
  saveData();
}
