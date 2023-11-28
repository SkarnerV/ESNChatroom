export default class Formatter {
  static formatDate(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    let hours = date.getHours();
    let minutes = String(date.getMinutes());
    const meridiem = hours >= 12 ? "PM" : "AM";

    hours %= 12;
    hours = hours || 12;

    minutes = minutes.padStart(2, "0");

    const formattedDate = `${month}.${day}.${year} ${hours}:${minutes}${meridiem}`;

    return formattedDate;
  }

  static formatLongUsername(username: string): string {
    return username.length > 16 ? username.slice(0, 12) + "..." : username;
  }

  static calculateTimeAgo(timestamp): string {
    const now = new Date().getTime();
    const difference = now - timestamp;

    // Calculate time differences
    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
      return seconds + " seconds ago";
    } else if (minutes < 60) {
      return minutes + " minutes ago";
    } else if (hours < 24) {
      return hours + " hours ago";
    } else {
      return days + " days ago";
    }
  }
}
