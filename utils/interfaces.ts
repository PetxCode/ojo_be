import { Document } from "mongoose";
import { HTTP } from "./enums";

export interface iError {
  name: string;
  message: string;
  status: HTTP;
  success: boolean;
}

interface adminUser {
  name: string;
  email: string;
  password: string;
  role: string;
  entryID: string;
  verifyToken: string;
  verify: boolean;
  avatar: string;
  avatarID: string;
  LGA_Admin: {}[];
}

export interface adminUserData extends adminUser, Document {}

interface LGA_AdminUser {
  name: string;
  canCreate: boolean;
  email: string;
  role: string;
  entryID: string;
  verifyToken: string;
  verify: boolean;
  avatar: string;
  avatarID: string;
  location: string;
  branchLeader: {}[];
  admin: {};
  adminID: string;
}

export interface LGA_AdminUserData extends LGA_AdminUser, Document {}

interface branchLeader {
  name: string;
  canCreate: boolean;
  email: string;
  role: string;
  entryID: string;
  verifyToken: string;
  verify: boolean;
  avatar: string;
  avatarID: string;
  location: string;
  unitLeader: {}[];
  LGA_Admin: {};
  LGA_AdminID: string;
}

export interface branchLeaderData extends branchLeader, Document {}

interface unitLeader {
  name: string;
  canCreate: boolean;
  email: string;
  role: string;
  entryID: string;
  verifyToken: string;
  verify: boolean;
  avatar: string;
  avatarID: string;
  location: string;
  member: {}[];
  branchLeader: {};
  branchLeaderID: string;
}

export interface unitLeaderData extends unitLeader, Document {}

interface member {
  name: string;
  email: string;
  role: string;
  entryID: string;
  verifyToken: string;
  verify: boolean;
  avatar: string;
  avatarID: string;
  plateNumber: string;
  nin_Number: string;
  location: string;
  unitLeaderID: string;

  operation: {}[];
  payment: {}[];

  unitLeader: {};
}

export interface memberData extends member, Document {}
