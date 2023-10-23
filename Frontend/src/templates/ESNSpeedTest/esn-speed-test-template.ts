export const ESNSpeedTestTemplate = `
<div class="performance-settings p-6 w-96 mx-auto rounded shadow-md bg-white">
<div class="text-black-500 text-center font-bold text-2xl mb-5">
  ESN Speed Performance Test
</div>

<!-- Close Button -->
<button class="absolute top-2 right-2 cursor-pointer" 
     id="close-button" 
     style="font-size: 20px; background-color: #f5f5f8; color: #555; padding: 5px 8px; border-radius: 50%; transition: background-color 0.3s, color 0.3s;">
     Close
</button>

<!-- Duration Input -->
<div class="mb-4">
    <label for="test-duration" class="block mb-2 text-sm font-medium text-gray-600">Test Duration (seconds):</label>
    <input type="number" id="test-duration" min="1" placeholder="Enter duration in seconds" class="border p-2 rounded w-full">
</div>

<!-- Interval Input -->
<div class="mb-4">
    <label for="request-interval" class="block mb-2 text-sm font-medium text-gray-600">Request Interval (milliseconds):</label>
    <input type="number" id="request-interval" min="1" placeholder="Enter interval in milliseconds" class="border p-2 rounded w-full">
</div>

<!-- Initiate Test and Stop Button -->
<div class="text-center">
    <button id="initiate-test" class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-700">
        Initiate Performance Test
    </button>

    <button id="stop-test" class="hidden bg-red-500 text-white p-2 rounded hover:bg-red-600 focus:outline-none focus:bg-red-700">
        Stop Test
    </button>
</div>

<!-- Initiate Test Report -->
<div id="testing-status" class="hidden mt-6 p-4 bg-yellow-200 rounded text-yellow-900">
    Performance testing in progress...
</div>

<div id="test-results" class="hidden mt-6 p-4 bg-green-200 rounded text-green-900">
    <h3 class="text-lg font-bold">Performance Test Results</h3>
    <p id="post-performance">POST Performance: <span></span> requests/sec</p>
    <p id="get-performance">GET Performance: <span></span> requests/sec</p>
</div>


</div>

`;
