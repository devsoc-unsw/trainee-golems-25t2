// Auth
export type SessionId = string;
export type Name = string;
export type UserId = number;
export type Email = string; // has "@[some letters > 0].[some letters > 1]"
export type Password = string; // greater than 6 characters & (?=.*\d)(?=.*[a-z])(?=.*[A-Z])

export type Session = {
  sessionId: SessionId;
  userId: UserId;
};

export type User = {
  name: Name;
  email: Email;
  password: Password;
  userId: UserId;
};

// types for dataStore
export type SessionStore = {
  sessions: Session[];
};

export type DataStore = {
  users: User[];
};
