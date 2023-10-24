import { ESNMessage } from "../types";
import jwt from "jsonwebtoken";
import Formatter from "./formatter";
import {
  speedTestStart,
  speedTestEnd,
  speedTestGet,
  speedTestPost,
} from "../api/speedtest";

const POST_REQUEST_LIMIT = 1000;
const currentUser = jwt.decode(localStorage.getItem("token"), "esn");

export default class SpeedTest {
  private postNum: number;
  private getNum: number;
  private startTime: number;
  private duration: number;
  private interval: number;
  private isTestRunning: boolean = false;
  private postGetRatio: number = 0.5;
  private showResult: (postPerformance: number, getPerformance: number) => void;
  private showError: (errorMsg: string) => void;

  constructor(showResult, showError) {
    this.showResult = showResult;
    this.showError = showError;
  }

  /* 
    Request Interval Rule: 
    The Administrator specifies the interval between two successive requests 
    in milliseconds. The Administrator’s device then makes sure that the 
    requests issued are separated by this interval. 

    Test Duration Tolerance Rule: 
    The actual duration of the performance test should be within 5 seconds of 
    the duration specified by the Administrator. 
  */

  startTest = async (duration: number, interval: number) => {
    await speedTestStart(currentUser.username);
    this.startTime = performance.now();
    this.duration = duration;
    this.interval = interval;
    this.postNum = 0;
    this.getNum = 0;
    this.isTestRunning = true;
    setTimeout(this.stopTest, duration * 1000);
    await this.test();
  };

  /*
    When the test is over, the system responds by reporting the following performance values:
    POST Performance: Number of POST requests completed per second
    GET Performance: Number of GET requests completed per second
   */
  stopTest = () => {
    if (!this.isTestRunning) {
      return;
    }
    speedTestEnd(currentUser.username);
    this.isTestRunning = false;
    // end test early
    if (this.getNum === 0) {
      this.showResult(
        (this.postNum / (performance.now() - this.startTime)) * 1000,
        0
      );
    } else {
      this.showResult(
        this.postNum / (this.duration * this.postGetRatio),
        this.getNum / (this.duration * (1 - this.postGetRatio))
      );
    }
  };

  /*
    Test Elements Rule: 
    Performance test should be done by issuing two kinds of requests: 
    (1) successive messages posted by the Administrator to an empty public wall (POST) and 
    (2) successive requests by the Administrator to read the contents of a populated public wall (GET). 

    Test Throughput Rule: 
    All POST requests must be completed before the GET requests are issued. 
    Throughput for GET and POST requests are measured separately.  

    A2. If the total number of POST requests sent to the system exceeds a limit defined under 
    the POST Request Limit rule, then the system prematurely terminates the test, deletes the 
    performance test messages stored in the test database, and informs the Administrator about the 
    situation. The use case ends.

    POST Request Limit Rule: 
    The total number of POST requests sent to the system should not exceed a limit of 1000. 
    If the duration of the test is too long, the memory can become full or dangerously low.
  */
  test = async () => {
    if (!this.isTestRunning) {
      return;
    }
    const testDuration = performance.now() - this.startTime;
    if (testDuration > this.duration * 1000) {
      this.stopTest();
      return;
    }
    if (this.postNum >= POST_REQUEST_LIMIT) {
      this.stopTest();
      this.showError("POST request limit exceeded");
      return;
    }
    try {
      const isHalfDuration =
        this.duration * 1000 * this.postGetRatio <
        performance.now() - this.startTime;
      if (isHalfDuration) {
        await this.testGet();
        this.getNum++;
      } else {
        await this.testPost();
        this.postNum++;
      }
      if (this.isTestRunning) {
        setTimeout(this.test, this.interval);
      }
    } catch (err) {
      if (this.isTestRunning) {
        this.showError("Error occurred during test: " + err);
        this.stopTest();
      }
    }
  };

  /*
    Test Payload Rule: Each message POST should be 20 characters long.
 */
  testPost = async () => {
    const message: ESNMessage = {
      sender: currentUser.username,
      sendee: "",
      content: this.generateRandomString(),
      time: Formatter.formatDate(new Date()),
      senderStatus: "GREEN",
    };
    await speedTestPost(message);
  };

  testGet = async () => {
    await speedTestGet(currentUser.username);
  };

  generateRandomString() {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomString = "";

    for (let i = 0; i < 20; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }

    return randomString;
  }
}
