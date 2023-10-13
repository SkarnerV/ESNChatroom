import {
  UserStatus,
  UserStatusIcon,
  UserStatusCircle,
} from "../constants/user-status";

export default class StatusClassifier {
  static classifyStatus(status: string): string[] {
    let htmlElement: string[] = [];
    htmlElement.push(UserStatusCircle.GREEN);
    if (status === UserStatus.RED) {
      htmlElement.push(UserStatusIcon.RED);
    }
    if (status === UserStatus.YELLOW) {
      htmlElement.push(UserStatusIcon.YELLOW);
    }
    if (status === UserStatus.GREEN) {
      htmlElement.push(UserStatusIcon.GREEN);
    }
    if (status === UserStatus.UNDEFINE) {
      htmlElement.push(UserStatusIcon.UNDEFINE);
    }
    return htmlElement;
  }
}
