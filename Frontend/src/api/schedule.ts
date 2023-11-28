import { FoodSharingSchedule } from "../types";
import { generateSchedule } from "../util/render";
import { scheduleApi } from "./routes";
import { fetchRequest } from "./util";

export const postSharingSchedule = async (schedule: FoodSharingSchedule) => {
  return await fetchRequest(scheduleApi, "POST", {
    scheduleid: schedule.scheduleid,
    scheduler: schedule.scheduler,
    schedulee: schedule.schedulee,
    time: schedule.time,
    status: schedule.status,
  }).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("HTTP error: " + response.status);
    }
  });
};

export const getAllSchedules = async (scheduler: string, schedulee: string) => {
  return await fetchRequest(
    scheduleApi + scheduler + "/" + schedulee,
    "GET"
  ).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("HTTP error: " + response.status);
    }
  });
};

export const deleteSchedule = async (scheduleid: string) => {
  return await fetchRequest(
    scheduleApi + "deletion" + "/" + scheduleid,
    "DELETE"
  )
    .then((response) => response.json())
    .then((json) => {
      removeScheduleEntry(json.data);
    })
    .catch((error) => {
      throw new Error("HTTP error: " + error);
    });
};

export const updateSchedule = async (scheduleid: string, newStatus: string) => {
  return await fetchRequest(scheduleApi + scheduleid, "PUT", {
    status: newStatus,
  }).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("HTTP error: " + response.status);
    }
  });
};

export const sortScheduleList = (scheduleList: FoodSharingSchedule[]) => {
  const now = new Date().getTime();

  const futureScheduleList = scheduleList
    .filter((schedule) => {
      const dateTime = new Date(schedule.time.split("_").join("T")).getTime();
      return dateTime >= now;
    })
    .sort((a, b) => {
      const dateTimeA = new Date(a.time.split("_").join("T")).getTime();
      const dateTimeB = new Date(b.time.split("_").join("T")).getTime();
      return dateTimeA - dateTimeB;
    });

  const previousScheduleList = scheduleList
    .filter((schedule) => {
      const dateTime = new Date(schedule.time.split("_").join("T")).getTime();
      return dateTime < now;
    })
    .sort((a, b) => {
      const dateTimeA = new Date(a.time.split("_").join("T")).getTime();
      const dateTimeB = new Date(b.time.split("_").join("T")).getTime();
      return dateTimeB - dateTimeA;
    });

  return [futureScheduleList, previousScheduleList];
};

export const removeScheduleEntry = (scheduleId: string) => {
  const latestScheduleArea = document.getElementById("latest-schedule-area");
  const scheduleEntryToDelete = latestScheduleArea!.querySelector(
    `#${scheduleId}`
  );

  // If the element exists, remove it
  if (scheduleEntryToDelete) {
    latestScheduleArea!.removeChild(scheduleEntryToDelete);
    const existingDividerline = document.getElementById("dividerline");
    if (existingDividerline && latestScheduleArea!.children.length === 1) {
      latestScheduleArea!.innerHTML = "No schedule found";
    } else if (latestScheduleArea!.children.length === 0) {
      latestScheduleArea!.innerHTML = "No schedule found";
    }
  } else {
    console.error("Schedule entry not found:", scheduleId);
  }
};

export const displaySchedules = (response) => {
  const latestScheduleArea = document.getElementById("latest-schedule-area");
  if (response.length === 0) {
    latestScheduleArea!.innerHTML = "No schedule found";
  } else {
    const sortedScheduleList = sortScheduleList(response);

    for (const schedule of sortedScheduleList[0]) {
      const scheduleEntry = generateSchedule(schedule);
      latestScheduleArea?.appendChild(scheduleEntry);
    }
    if (sortedScheduleList[1].length > 0) {
      const dividerline = document.createElement("div");
      dividerline.id = "PastDividerLine";
      dividerline.textContent = "--- Past Schedules---";
      latestScheduleArea?.appendChild(dividerline);
      for (const schedule of sortedScheduleList[1]) {
        const scheduleEntry = generateSchedule(schedule);
        latestScheduleArea?.appendChild(scheduleEntry);
      }
    }

    const scroll = latestScheduleArea || new HTMLDivElement();
    scroll.scrollTop = scroll.scrollHeight || 0;
  }
};
