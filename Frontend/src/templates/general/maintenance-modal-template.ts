export const maintenanceModalTemplate = `<div class="fixed inset-0 flex items-center justify-center z-50">
<div class="modal-overlay fixed inset-0 bg-black opacity-30 z-40"></div>
<div
  class="modal-container bg-white w-96 mx-auto rounded shadow-lg z-50 overflow-y-auto"
>
  <div class="modal-content p-4">
    <div id="modal-body" class="modal-body">
      <h3 class="text-2xl font-semibold">⚠️Website Under Maintenance</h3>
      <div>
        This website is currently undergoing maintenance. We would be back shortly.
      </div>
    </div>
    <div class="flex flex-col justify-center items-center h-full">
      <button
        id="modal-refresh"
        class="w-[50%] mt-4 bg-black text-white p-2 rounded hover:bg-gray-800"
        onclick="window.location.reload()"
      >
        Refresh
      </button>
    </div>
  </div>
</div>
</div>
`;
