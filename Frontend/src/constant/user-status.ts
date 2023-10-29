import { iconGREEN, iconRED, iconUNDEFINE, iconYELLOW } from "./svg-icon";

export enum UserStatus {
  GREEN = "GREEN",
  YELLOW = "YELLOW",
  RED = "RED",
  UNDEFINE = "UNDEFINE",
}

export const UserStatusIcon = {
  GREEN: iconGREEN,
  YELLOW: iconYELLOW,
  RED: iconRED,
  UNDEFINE: iconUNDEFINE,
};

export enum UserStatusCircle {
  GREEN = "bg-emerald-500",
  YELLOW = "bg-yellow-300",
  RED = "bg-red-700",
  UNDEFINE = "bg-gray-500",
}
