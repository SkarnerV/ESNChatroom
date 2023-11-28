import jwt from "jsonwebtoken";
import { ScheduleModalTemplate } from "../../templates/schedule/schedule-modal-template";
import { IllegalUserActionHandler } from "../../util/illegalUserHandler";
import { FoodSharingSchedule } from "../../types";
import { getAllSchedules, postSharingSchedule } from "../../api/schedule";
import { generateSchedule } from "../../util/render";

class ScheduleModal extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = ScheduleModalTemplate;
  }
}
customElements.define("schedule-modal", ScheduleModal);

IllegalUserActionHandler.redirectToLogin();
const currentUser = jwt.decode(localStorage.getItem("token"), "esn");
const url = new URL(window.location.href);
const closeButton = document.getElementById("schedule-close-button");
const warningMessage = document.getElementById("warning-message");
const dateInput = document.getElementById("date-input") as HTMLInputElement;
const timeInput = document.getElementById("time-input") as HTMLInputElement;
const scheduleButton = document.getElementById("schedule-button");
const latestScheduleArea = document.getElementById(
  "latest-schedule-area"
) as HTMLElement;
const contactName = url.searchParams.get("contact");
const scheduleModal = document.getElementById("schedule-modal");
const scroll = latestScheduleArea || new HTMLDivElement();
scroll.scrollTop = scroll.scrollHeight || 0;

closeButton!.onclick = () => {
  if (scheduleModal) {
    if (dateInput) dateInput.value = "";
    if (timeInput) timeInput.value = "";
    if (warningMessage) warningMessage.innerText = "";
    if (latestScheduleArea) latestScheduleArea!.innerHTML = "";
    scheduleModal!.style.display = "none";
  }
};

if (contactName) {
  scheduleButton!.onclick = async () => {
    warningMessage!.innerText = "";
    if (dateInput.value === "" || timeInput.value === "") {
      warningMessage!.innerText =
        "Please select a date and time you would like to schedule";
    } else {
      if (latestScheduleArea.innerHTML === "No schedule found") {
        latestScheduleArea.innerHTML = "";
      }

      getAllSchedules(currentUser.username, contactName).then((response) => {
        let scheduleDuplicate = false;
        let existingSchedules = response;
        for (const schedule of existingSchedules) {
          if (dateInput.value + "_" + timeInput.value === schedule.time) {
            warningMessage!.innerText =
              "Same date and time has already been scheduled";
            scheduleDuplicate = true;
          }
        }

        if (scheduleDuplicate === false) {
          const scheduler = currentUser.username;
          const schedulee = contactName;
          const selectedDate = dateInput.value;
          const selectedTime = timeInput.value;
          const status = "Pending";
          const scheduleid = scheduler + schedulee + "_" + Date.now();
          // Perform data recording to DB
          const newschedule: FoodSharingSchedule = {
            scheduleid: scheduleid,
            scheduler: scheduler,
            schedulee: schedulee,
            time: selectedDate + "_" + selectedTime,
            status: status,
          };
          if (
            new Date(selectedDate + "T" + selectedTime).getTime() <
            new Date().getTime()
          ) {
            warningMessage!.innerHTML =
              "only date and time in the future are available";
          } else {
            warningMessage!.innerHTML = "";
            recordSchedule(newschedule);
          }
        }
      });
    }
  };
}

function formatDate(date) {
  const d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();
  return [year, month.padStart(2, "0"), day.padStart(2, "0")].join("-");
}

const today = new Date();
dateInput.min = formatDate(today);

const recordSchedule = (schedule: FoodSharingSchedule) => {
  postSharingSchedule(schedule).then((response) => {
    if (response) {
      if (dateInput) dateInput.value = "";
      if (timeInput) timeInput.value = "";
      renderScheduleEntry(response);
    }
  });
};

const renderScheduleEntry = (schedule: FoodSharingSchedule): void => {
  const scheduleEntry = generateSchedule(schedule);

  if (latestScheduleArea && latestScheduleArea.hasChildNodes()) {
    const existingDividline = document.getElementById("dividerline");
    if (existingDividline) {
      latestScheduleArea.removeChild(existingDividline);
    }

    const dividerline = document.createElement("div");
    dividerline.id = "dividerline";
    dividerline.textContent = "--- Previous Schedules ---";
    latestScheduleArea.insertBefore(dividerline, latestScheduleArea.firstChild);
  }

  latestScheduleArea?.insertBefore(
    scheduleEntry,
    latestScheduleArea.firstChild
  );
};
