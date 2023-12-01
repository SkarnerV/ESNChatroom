import { dropDownIcon } from "../../constant/svg-icon";
export const ProfileModalTemplate = `
<div class="fixed inset-0 flex items-center justify-center z-50">
  <div class="admin-modal-container bg-white w-11/12 md:w-2/3 lg:w-1/2 xl:w-1/3 mx-auto rounded shadow-lg z-50 overflow-auto">
    <div class="modal-content p-4 relative flex flex-col">

      <!-- Close Button on Top Right -->
      <button id="profile-close-button" class="cursor-pointer absolute top-3 right-4" style="font-size: 20px; background-color: #f5f5f8; color: #555; width: 30px; height: 30px; border-radius: 20%; transition: background-color 0.3s, color 0.3s;">
        X
      </button>

      <!-- Modal Title -->
      <div class="text-2xl text-center font-semibold text-gray-600 mt-2 mb-4">Edit User Profile</div>

      <!-- Account Status -->
      <div class="px-3 py-2">
        <label class="block text-gray-700 text-sm font-bold mb-2">Account Status:</label>
        <button
            id="account-button"
            class="flex items-center w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-3 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
            <span id="account-status" class="flex-grow text-left"></span>
            <span class="ml-auto mr-2 text-gray-700">${dropDownIcon}</span>
        </button>
            
        <ul id="account-dropdown" class="justify-between absolute left-0 w-full bg-white rounded-b shadow-lg hidden">
        </ul>
      </div>

      <!-- Privilege Level -->
      <div class="dropdown px-3 py-2">
        <label class="block text-gray-700 text-sm font-bold mb-2">Privilege Level:</label>
        <button
            id="privilege-button"
          class="flex items-center w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-3 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
            <span id="privilege-level" class="flex-grow text-left"></span>
            <span class="ml-auto mr-2 text-gray-700">${dropDownIcon}</span>
        </button>
            
        <ul id="privilege-dropdown" class="justify-between absolute left-0 w-full bg-white rounded-b shadow-lg hidden">
        </ul>
      </div>
      

      <!-- Username -->
      <div class="px-3 py-2">
        <label class="block text-gray-700 text-sm font-bold mb-2">Username:</label>
        <input id="username-input" type="text" class="block w-full bg-white text-black border border-gray-300 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"/>
      </div>

      <!-- Password -->
      <div class="px-3 py-2">
        <div class="flex items-center mb-2">
          <label class="block text-gray-700 text-sm font-bold mr-2">Password:</label>
          <button id="toggle-password-btn" class="text-blue-500 hover:text-blue-700 text-sm font-bold py-1 px-2">Edit</button>
         </div>
          <input id="password-input" type="password" class="block w-full bg-white text-black border border-gray-300 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 hidden" placeholder="***********"/>
      </div>

      <!-- Submit Changes Button -->
      <div class="px-3 py-2 flex justify-center items-center">
        <button id="save-changes-button" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm">
          Save Changes
        </button>
      </div>

    </div>
  </div>
</div>

`;
