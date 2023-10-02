export const esnDirectoryContainer = `
  <div class="fixed inset-0 flex items-center justify-center z-50 h-25">
    <div class="modal-overlay fixed inset-0 bg-black opacity-30 z-40"></div>
    <div class="modal-container bg-white w-96 mx-auto rounded shadow-lg z-50 divide-y divide-gray-200">
      <div class="justify-between flex items-center justify-center gap-x-4 py-2 px-4 font-semibold leading-6 text-gray-900 ">
        <p class="flex min-w-0 gap-x-3 font-semibold text-gray-900">Directory</p>
        <button id="quit-directory" class="w-[15%] mt-2 bg-black text-white p-1 rounded hover:bg-gray-800">Quit</button>
      </div>
      <ul id="user-status-list" role="list" class="overflow-y-auto max-h-96 min-h-80 divide-y divide-gray-200">
      <li class="flex justify-between gap-x-6 py-5 px-4">
          <div class="flex items-center min-w-0 gap-x-4">
          <img class="h-9 w-9 flex-none rounded-full bg-gray-50" src="https://avatars.dicebear.com/api/adventurer-neutral/mail%40ashallendesign.co.uk.svg" alt="">
              <p class="text-sm font-semibold leading-6 text-gray-900">Test User 1</p>
          </div>
          <div class="shrink-0 sm:flex mt-1 flex items-center gap-x-1.5">
              <div class="h-2 w-2 rounded-full bg-red-700"></div>
              <p class="text-xs leading-5 text-gray-500">🆘</p>
          </div>
        </li>
        <li class="flex justify-between gap-x-6 py-5 px-4">
      
          <div class="flex items-center min-w-0 gap-x-4">
          <img class="h-9 w-9 flex-none rounded-full bg-gray-50" src="https://avatars.dicebear.com/api/adventurer-neutral/mail%40ashallendesign.co.uk.svg" alt="">
              <p class="text-sm font-semibold leading-6 text-gray-900">Test User 2</p>
          </div>
          <div class="shrink-0 sm:flex mt-1 flex items-center gap-x-1.5">
              <div class="h-2 w-2 rounded-full bg-yellow-300"></div>
              <p class="text-xs leading-5 text-gray-500">⚠️</p>
          </div>
        </li>
        <li class="flex justify-between gap-x-6 py-5 px-4">
      
          <div class="flex items-center min-w-0 gap-x-4">
          <img class="h-9 w-9 flex-none rounded-full bg-gray-50" src="https://avatars.dicebear.com/api/adventurer-neutral/mail%40ashallendesign.co.uk.svg" alt="">
              <p class="text-sm font-semibold leading-6 text-gray-900">Test User 3</p>
          </div>
          <div class="shrink-0 sm:flex mt-1 flex items-center gap-x-1.5">
              <div class="h-2 w-2 rounded-full bg-emerald-500"></div>
              <p class="text-xs leading-5 text-gray-500">✅</p>
          </div>
        </li>
       
        <li class="flex justify-between gap-x-6 py-5 px-4">
      
          <div class="flex items-center min-w-0 gap-x-4">
          <img class="h-9 w-9 flex-none rounded-full bg-gray-50" src="https://avatars.dicebear.com/api/adventurer-neutral/mail%40ashallendesign.co.uk.svg" alt="">
              <p class="text-sm font-semibold leading-6 text-gray-900">Test User 4</p>
          </div>
          <div class="shrink-0 sm:flex mt-1 flex items-center gap-x-1.5">
              <div class="h-2 w-2 rounded-full bg-gray-500"></div>
              <p class="text-xs leading-5 text-gray-500">❔</p>
          </div>
        </li>
        </ul>
    </div>
  </div>
`;
