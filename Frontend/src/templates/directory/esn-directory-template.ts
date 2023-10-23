import {
  dropDownIcon,
  iconRED,
  iconGREEN,
  iconUNDEFINE,
  iconYELLOW,
} from "../../constants/svg-icon";

export const esnDirectoryContainer = `
<div class="modal-container flex flex-col w-96 mx-auto rounded shadow-2xl z-50 divide-y-2 divide-rose-500 w-screen bg-rose-500" style="height: 100dvh">
  <div class="flex justify-between items-center py-2 px-4 bg-black text-white">
      <p id="home-page-header" class="font-semibold">Directory</p>
      <div class="flex space-x-2 justify-between items-center">
      <button id="speedtest-directory" class="w-16 items-center flex-row text-sm font-semibold bg-gray-500 text-white p-1 rounded hover:bg-gray-700">Test</button>
          <div class="relative">
              <button id="change-status" class="inline-flex w-16 items-center text-sm font-semibold bg-rose-500 rounded-t rounded-b text-white p-1 hover:bg-rose-700">
                  Status ${dropDownIcon}
              </button>
              <ul id="status-dropdown" class="items-center justify-between absolute left-0 w-16 bg-white rounded-b shadow-lg hidden">
                  <li>
                      <label class="space-x-2 flex items-center p-2 hover:bg-gray-300">
                          <input id="status-GREEN" type="radio" value="GREEN" name="status" class="w-8 h-8 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                          <label for="status-GREEN" class="w-full ml-2">${iconGREEN}</label>
                      </label>
                  </li>
                  <li>
                      <label class="space-x-2 flex items-center p-2 hover:bg-gray-300">
                          <input id="status-YELLOW" type="radio" value="YELLOW" name="status" class="w-8 h-8 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                          <label for="status-YELLOW" class="w-full ml-2">${iconYELLOW}</label>
                      </label>
                  </li>
                  <li>
                      <label class="space-x-2 flex items-center p-2 hover:bg-gray-300">
                          <input id="status-RED" type="radio" value="RED" name="status" class="w-8 h-8 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                          <label for="status-RED" class="w-full ml-2">${iconRED}</label>
                      </label>
                  </li>
                  <li>
                      <label class="space-x-2 flex items-center p-2 hover:bg-gray-300">
                          <input id="status-UNDEFINE" type="radio" value="UNDEFINE" name="status" class="w-8 h-8 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                          <label for="status-UNDEFINE" class="w-full ml-2">${iconUNDEFINE}</label>
                      </label>
                  </li>
              </ul>
          </div>
          <button id="quit-directory" class="w-16 items-center flex-row text-sm font-semibold bg-rose-500 text-white p-1 rounded hover:bg-rose-700">Logout</button>
      </div>
  </div>
  <ul id="user-status-list" role="list" class="flex-grow flex flex-col overflow-y-auto divide-y divide-rose-500 pb-14"></ul>
</div>
`;
