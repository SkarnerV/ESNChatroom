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
}
