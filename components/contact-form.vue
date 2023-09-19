<template>
  <form class="flex w-full max-w-sm space-x-3">
    <div class="m-auto mt-10 w-full max-w-2xl rounded-lg bg-white px-5 py-10 shadow dark:bg-gray-800">
      <div class="m-auto grid max-w-xl grid-cols-2 gap-4">
        <div class="col-span-2 lg:col-span-1">
          <div class="relative">
            <label for="contact-form-name">
              <input id="contact-form-name"
                class="w-full flex-1 appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-700 shadow-sm placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-accent-600"
                placeholder="Name" type="text" />
            </label>
          </div>
        </div>
        <div class="col-span-2 lg:col-span-1">
          <div class="relative">
            <label for="contact-form-email">
              <input id="contact-form-email"
                class="w-full flex-1 appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-700 shadow-sm placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-accent-600"
                placeholder="email" type="text" />
            </label>
          </div>
        </div>
        <div class="col-span-2">
          <label class="text-gray-700" for="name">
            <textarea id="comment"
              class="w-full flex-1 appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-700 placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-accent-600"
              cols="40" name="comment" placeholder="Enter your comment" rows="5"></textarea>
          </label>
        </div>
        <div class="col-span-2">
          <push-button text="Send" />
        </div>
      </div>
    </div>
  </form>
</template>
