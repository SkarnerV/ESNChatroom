import { ESNSpeedTestTemplate } from "../../templates/ESNSpeedTest/esn-speed-test-template";
import SpeedTest from "../../util/speedTest";

class ESNSpeedTest extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = ESNSpeedTestTemplate;
  }
}

customElements.define("esn-speed-test-area", ESNSpeedTest);
const initiateTestButton = document.getElementById(
  "initiate-test"
) as HTMLInputElement;
const testDurationInput = document.getElementById(
  "test-duration"
) as HTMLInputElement;
const requestIntervalInput = document.getElementById(
  "request-interval"
) as HTMLInputElement;
const stopTestButton = document.getElementById("stop-test") as HTMLInputElement;
const testingStatus = document.getElementById(
  "testing-status"
) as HTMLInputElement;
const testResults = document.getElementById("test-results") as HTMLInputElement;
const postPerformanceElem = testResults.querySelector(
  "#post-performance span"
) as HTMLInputElement;
const getPerformanceElem = testResults.querySelector(
  "#get-performance span"
) as HTMLInputElement;
const closeTestButton = document.getElementById(
  "close-button"
) as HTMLInputElement;
closeTestButton.onclick = () => {
  window.location.href = "/home";
};

const speedTest = new SpeedTest(displayTestResults, showError);

stopTestButton!.onclick = async () => {
  testingStatus.classList.add("hidden");
  testResults.classList.add("hidden");
  speedTest.stopTest();
};

initiateTestButton!.onclick = async () => {
  showError("");
  testResults.classList.add("hidden");

  const duration = parseInt(testDurationInput.value, 10);
  const interval = parseInt(requestIntervalInput.value, 10);

  if (
    isNaN(duration) ||
    isNaN(interval) ||
    duration <= 0 ||
    interval <= 0 ||
    duration > 5
  ) {
    showError(
      "Please enter valid positive numbers for both duration and interval."
    );
    return false;
  } else {
    testingStatus.classList.remove("hidden");
    stopTestButton.classList.remove("hidden");
    initiateTestButton.classList.add("hidden");
    speedTest.startTest(duration, interval);
  }
};

function displayTestResults(numOfPostRequests, numOfGetRequests) {
  postPerformanceElem.textContent = numOfPostRequests;
  getPerformanceElem.textContent = numOfGetRequests;
  testingStatus.classList.add("hidden");
  testResults.classList.remove("hidden");
  stopTestButton.classList.add("hidden");
  initiateTestButton.classList.remove("hidden");
}

function showError(errorMessage: string) {
  // remove all error labels
  const errorLabels = document.querySelectorAll(".error-label");
  errorLabels.forEach((label) => label.remove());

  // append error label
  const requestInput = document.getElementById("request-interval");
  const errorElement = document.createElement("p");
  errorElement.classList.add("error-label");
  errorElement.classList.add("text-red-500");
  errorElement.textContent = errorMessage;
  requestInput!.insertAdjacentElement("afterend", errorElement);
  stopTestButton.classList.add("hidden");
  initiateTestButton.classList.remove("hidden");
}
