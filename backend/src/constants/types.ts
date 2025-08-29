// Auth
export type SessionId = string;
export type Name = string;
export type UserId = number;
export type Email = string; // has "@[some letters > 0].[some letters > 1]"
export type Password = string; // greater than 6 characters & (?=.*\d)(?=.*[a-z])(?=.*[A-Z])
export type AvatarURL = string;

export type Session = {
  _id?: string;
  sessionId: SessionId;
  userId: UserId;
};

export type User = {
  name: Name;
  email: Email;
  password: Password;
  userId: UserId;
  avatar?: AvatarURL;
};

// types for dataStore
export type SessionStore = {
  sessions: Session[];
};

export type DataStore = {
  _id?: string;
  users: User[];
};
