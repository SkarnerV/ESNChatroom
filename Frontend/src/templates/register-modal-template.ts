export const registerModalTemplate = `<div class="fixed inset-0 flex items-center justify-center z-50">
<div class="modal-overlay fixed inset-0 bg-black opacity-30 z-40"></div>
<div
  class="modal-container bg-white w-96 mx-auto rounded shadow-lg z-50 overflow-y-auto"
>
  <div class="modal-content p-4">
    <div id="confirm-message" class="mb-4">
      By clicking "Confirm," you will create a user account in Emergency
      Social Network.
    </div>
    <div id="modal-body" class="modal-body hidden">
      <div>
        "Welcome to Emergency Social Network. Please review the status
        categories below:"
      </div>
      <table class="table-auto w-full ">
        <thead>
          <tr>
            <th>Status</th>
            <th>Explanation</th>
            <th>Color Code</th>
            <th>Icon</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>OK</td>
            <td>I am OK; I do not need help.</td>
            <td style="background-color: green"></td>
            <td>✅</td>
          </tr>
          <tr>
            <td>Help</td>
            <td>
              I need help, but this is not a life-threatening emergency.
            </td>
            <td style="background-color: yellow"></td>
            <td>⚠️</td>
          </tr>
          <tr>
            <td>Emergency</td>
            <td>I need help now; this is a life-threatening emergency!</td>
            <td style="background-color: red"></td>
            <td>🆘</td>
          </tr>
          <tr>
            <td>Undefined</td>
            <td>The user has not provided any status info.</td>
            <td style="background-color: gray"></td>
            <td>❓</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="flex flex-col justify-center items-center h-full">
      <button
        id="modal-confirm"
        class="w-[50%] mt-4 bg-black text-white p-2 rounded hover:bg-gray-800"
      >
        Confirm
      </button>
      <button
        id="modal-continue"
        class="w-[50%] mt-4 hidden bg-black text-white p-2 rounded hover:bg-gray-800"
      >
        Confirm
      </button>
      <button
        id="modal-cancel"
        class="w-[50%] mt-4 bg-red-500 text-white p-2 rounded hover:bg-red-600"
      >
        Cancel
      </button>
    </div>
  </div>
</div>
</div>
`;
