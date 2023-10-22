import { ESNSpeedTestTemplate } from "../../templates/ESNSpeedTest/esn-speed-test-template";
import { socket } from "../../scripts/socket";
const POST_REQUEST_LIMIT = 1000;

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

let testIsRunning = false;

stopTestButton!.onclick = async () => {
  testIsRunning = false;
  stopPerformenceTest();
};

initiateTestButton!.onclick = async () => {
  showError("");
  testIsRunning = true;
  testResults.classList.add("hidden");

  const duration = parseInt(testDurationInput.value, 10);
  const interval = parseInt(requestIntervalInput.value, 10);

  if (isNaN(duration) || isNaN(interval) || duration <= 0 || interval <= 0) {
    showError(
      "Please enter valid positive numbers for both duration and interval."
    );
    return false;
  } else {
    startPerformanceTest(duration, interval);
  }
};

function startPerformanceTest(duration, interval) {
  // Mock POST API request for sending the duration and interval to the server, like:
  const response = fetch("/speedtest/startPerformanceTest", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ duration, interval }),
  });

  // mock data
  const result = {
    numOfPostRequests: 100,
    numOfGetRequests: 20,
  };

  if (true) {
    testingStatus.classList.remove("hidden");

    // When the performance test starts, the server sends a broadcast message over
    // the WebSocket to all connected clients. On receiving the message, other clients
    // display the overlay.

    // naive settimeout to predict the performance
    setTimeout(() => {
      // Other logic, like:
      if (result.numOfPostRequests > POST_REQUEST_LIMIT) {
        // Display a message to inform the user the test was terminated due to exceeding POST limit
        showError("Test terminated: POST request limit exceeded.");
      } else if (testIsRunning) {
        displayTestResults(result.numOfPostRequests, result.numOfGetRequests);
      }
    }, 3000);
  } else {
    // Handle errors, e.g., show an error message
    showError("Error when sending the duration and interval to the server");
  }
}

function stopPerformenceTest() {
  // Mock POST/PUT API calls to stop the performance test
  const response = fetch("/speedtest/stopPerformanceTest", {
    method: "POST",
  });

  if (true) {
    testingStatus.classList.add("hidden");
    testResults.classList.add("hidden");

    // Display a message or notification to inform the user the test has been stopped
    showError("The test has been stopped.");
  } else {
    // Handle errors, e.g., show an error message
    showError("Failed to stop the test. Please try again.");
  }
}

function displayTestResults(numOfPostRequests, numOfGetRequests) {
  postPerformanceElem.textContent = numOfPostRequests;
  getPerformanceElem.textContent = numOfGetRequests;
  testingStatus.classList.add("hidden");
  testResults.classList.remove("hidden");
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
}
