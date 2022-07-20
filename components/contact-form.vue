<template>
  <form class="flex w-full max-w-sm space-x-3">
    <div class="dark:bg-gray-800 w-full max-w-2xl px-5 py-10 m-auto mt-10 bg-white rounded-lg shadow">
      <div class="grid max-w-xl grid-cols-2 gap-4 m-auto">
        <div class="lg:col-span-1 col-span-2">
          <div class=" relative">
            <input id="contact-form-name" type="text"
                   class=" focus:outline-none focus:ring-2 focus:ring-accent-600 focus:border-transparent flex-1 w-full px-4 py-2 text-base text-gray-700 placeholder-gray-400 bg-white border border-transparent border-gray-300 rounded-lg shadow-sm appearance-none"
                   placeholder="Name" />
          </div>
        </div>
        <div class="lg:col-span-1 col-span-2">
          <div class=" relative">
            <input id="contact-form-email" type="text"
                   class=" focus:outline-none focus:ring-2 focus:ring-accent-600 focus:border-transparent flex-1 w-full px-4 py-2 text-base text-gray-700 placeholder-gray-400 bg-white border border-transparent border-gray-300 rounded-lg shadow-sm appearance-none"
                   placeholder="email" />
          </div>
        </div>
        <div class="col-span-2">
          <label class="text-gray-700" for="name">
            <textarea id="comment"
                      class="focus:outline-none focus:ring-2 focus:ring-accent-600 focus:border-transparent flex-1 w-full px-4 py-2 text-base text-gray-700 placeholder-gray-400 bg-white border border-gray-300 rounded-lg appearance-none"
                      placeholder="Enter your comment" name="comment" rows="5" cols="40"></textarea>
          </label>
        </div>
        <div class="col-span-2">
          <push-button text="Send" />
        </div>
      </div>
    </div>
  </form>
</template>
