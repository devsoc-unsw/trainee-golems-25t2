import { v4 as uuidv4 } from "uuid";
import { DataStore, Session, SessionStore } from "./constants/types";
import { MongoClient, ObjectId } from "mongodb";
import * as dotenv from "dotenv";

let sessionStore: SessionStore = { sessions: [] };
let database: DataStore = {
  users: [],
};

let sessionCollection: any;
let dataCollection: any;

export async function connectToDatabase() {
  try {
    dotenv.config();
    const atlasUri = process.env.ATLAS_URI;
    if (!atlasUri) {
      throw new Error("ATLAS_URI environment variable is undefined");
    }

    const client: MongoClient = new MongoClient(atlasUri);

    await client.connect();
    const db = client.db();
    console.log(`Successfully connected to database: ${db.databaseName}`);
    sessionCollection = db.collection("sessions");
    dataCollection = db.collection("data");
    console.log(`Collection: ${sessionCollection.collectionName} found`);
    console.log(`Collection: ${dataCollection.collectionName} found`);
  } catch (error) {
    console.error("Error found when connecting to MongoDB: ", error);
  }
}
////////////////////////////// SESSION UTILS  ////////////////////////////////

export async function saveSessions() {
  try {
    if (sessionStore.sessions.length === 0) {
      await sessionCollection.deleteMany({});
      return;
    }

    for (const session of sessionStore.sessions) {
      await sessionCollection.replaceOne({ _id: session._id }, session, {
        upsert: true,
      });
    }
  } catch (error) {
    console.error("Error saving sessions:", error);
  }
}

export async function loadSessions() {
  try {
    const sessions = await sessionCollection.find({}).toArray();
    sessionStore.sessions = sessions;
  } catch (error) {
    console.error("Error loading sessions:", error);
  }
}

export function generateSessionId() {
  return uuidv4();
}

export function getSessions(): Session[] {
  return sessionStore.sessions;
}

export async function setSessions(sessions: Session[]) {
  sessionStore.sessions = sessions;
  await saveSessions();
}

////////////////////////////// DATA UTILS  ///////////////////////////////////

export async function saveData() {
  try {
    if (database.users.length === 0) {
      await dataCollection.deleteMany({});
      return;
    }

    await dataCollection.replaceOne({ _id: database._id }, database, {
      upsert: true,
    });
  } catch (error) {
    console.error("Error saving data:", error);
  }
}

export async function loadData() {
  try {
    const data = await dataCollection.findOne({});
    if (data) {
      database = data;
    }
  } catch (error) {
    console.error("Error loading data:", error);
  }
}

export function getData() {
  return database;
}

export async function setData(newData: DataStore) {
  database = newData;
  await saveData();
}
