import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type UserRole = "RoleAdmin" | "SuperAdmin" | "Viewer";

export interface FeedbackMessages {
  authorSub: string;
  authorType: string;
  content: string;
  createdAt: Generated<Timestamp>;
  feedbackTicketId: string;
  id: Generated<string>;
  updatedAt: Generated<Timestamp>;
}

export interface FeedbackTickets {
  category: string | null;
  createdAt: Generated<Timestamp>;
  id: Generated<string>;
  institutionId: string;
  status: Generated<string>;
  updatedAt: Generated<Timestamp>;
  url: string | null;
  userSub: string;
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
  feedbackTickets: FeedbackTickets;
  globalAdmins: GlobalAdmins;
  institutions: Institutions;
  institutionUsers: InstitutionUsers;
}
