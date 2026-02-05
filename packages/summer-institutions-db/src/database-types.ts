import type { ColumnType } from "kysely";

export type FeedbackAuthorType = "admin" | "system" | "user";

export type FeedbackCategory = "bug" | "feature-request" | "question";

export type FeedbackStatus = "closed" | "in-progress" | "new" | "resolved";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type UserRole = "RoleAdmin" | "SuperAdmin" | "Viewer";

export interface FeedbackMessages {
  authorEmail: string | null;
  authorName: string | null;
  authorSub: string | null;
  authorType: FeedbackAuthorType;
  category: FeedbackCategory | null;
  content: string;
  createdAt: Generated<Timestamp>;
  id: Generated<number>;
  institutionId: number;
  parentId: number | null;
  status: Generated<FeedbackStatus>;
  threadId: number;
  updatedAt: Generated<Timestamp>;
  url: string | null;
}

export interface GlobalAdmins {
  createdAt: Generated<Timestamp>;
  id: Generated<number>;
  userSub: string;
}

export interface Institutions {
  createdAt: Generated<Timestamp>;
  displayName: string;
  id: Generated<number>;
  logoFile: Buffer | null;
  logoUrl: Generated<string>;
  name: string;
}

export interface InstitutionUsers {
  createdAt: Generated<Timestamp>;
  id: Generated<number>;
  institutionId: number;
  role: UserRole | null;
  userSub: string;
}

export interface Database {
  feedbackMessages: FeedbackMessages;
  globalAdmins: GlobalAdmins;
  institutions: Institutions;
  institutionUsers: InstitutionUsers;
}
