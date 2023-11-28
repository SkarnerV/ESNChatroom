export const ScheduleModalTemplate = `
<div class="fixed inset-0 flex items-center justify-center z-50">
  <div class="modal-container bg-white w-11/12 md:w-2/3 lg:w-1/2 xl:w-1/3 mx-auto rounded shadow-lg z-50">
    <div class="modal-content p-1 relative flex flex-col">
      
      <!-- Close Button on Top Right -->
      <button id="schedule-close-button" class="cursor-pointer absolute top-3 right-4" style="font-size: 20px; background-color: #f5f5f8; color: #555; width: 30px; height: 30px; border-radius: 20%; transition: background-color 0.3s, color 0.3s;">
        X
      </button>

      <!-- Modal Title -->
      <div class="text-2xl text-center font-semibold text-gray-600 mt-2 mb-4">Schedule</div>
      
      <!-- Display scheduling slot -->
      <div class="w-full px-2 text-center text-gray-700 h-[190px] mx-auto overflow-y-auto">
        <div id="latest-schedule-area">
          <!-- schedules -->
        </div>
      </div>
            
      <!-- Schedule input -->
      <div>
          <div class="flex px-3 py-1 mt-2 mb-1">
            <!-- Date input -->
            <input id="date-input" type="date" class="flex-1 rounded p-2 outline-none text-black border border-gray-300 mr-2"/>
            <!-- Time input -->
            <input id="time-input" type="time" class="flex-1 rounded p-2 outline-none text-black border border-gray-300"/>
          </div>
          <div class="px-3 py-1 text-center text-sm text-red-600">
              <span id="warning-message"></span>
          </div>
          <div class="px-3 py-2 flex justify-center items-center">
              <button id="schedule-button" class="bg-rose-600 text-white px-4 py-2 rounded-md text-sm ">Schedule</button>
          </div>
      </div>
    </div>
  </div>
</div>
`;
