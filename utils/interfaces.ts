import { Document } from "mongoose";
import { HTTP } from "./enums";

export interface iError {
  name: string;
  message: string;
  status: HTTP;
  success: boolean;
}

interface adminUser {
  best_performing: [];
  name: string;
  email: string;
  password: string;
  role: string;
  phone: string;
  bio: string;
  entryID: string;
  verifyToken: string;
  verify: boolean;
  avatar: string;

  avatarID: string;
  LGA_Admin: {}[];
}

export interface adminUserData extends adminUser, Document {}

interface LGA_AdminUser {
  best_performing: [];
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

  lga_branches: number;
  lga_units: number;
  lga_members: number;

  operation: [];
  daily_operation: [];

  phone: string;
  bio: string;
}

export interface LGA_AdminUserData extends LGA_AdminUser, Document {}

interface branchLeader {
  best_performing: [];
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

  phone: string;
  bio: string;

  operation: {}[];

  branch_units: number;
  branch_members: number;

  branch_operation: [];
  daily_operation: [];
}

export interface branchLeaderData extends branchLeader, Document {}

interface unitLeader {
  best_performing: [];
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

  phone: string;
  bio: string;

  operation: {}[];
  LGALeaderID: string;
  branchLeaderID: string;

  unit_members: number;

  unit_operation: [];
  daily_operation: [];
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

  phone: string;
  bio: string;

  LGALeaderID: string;
  branchLeaderID: string;
  unitLeaderID: string;

  operation: {}[];
  payment: {}[];

  unitLeader: {};
}

export interface memberData extends member, Document {}
