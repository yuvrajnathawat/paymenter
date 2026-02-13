<div x-data>
    <template x-for="(notification, index) in $store.notifications.notifications" :key="notification.id">
        <div x-show="notification.show"
            x-transition:enter="transition ease-out duration-300"
            x-transition:enter-start="opacity-0 translate-y-2 scale-95"
            x-transition:enter-end="opacity-100 translate-y-0 scale-100"
            x-transition:leave="transition ease-in duration-300"
            x-transition:leave-start="opacity-100 translate-y-0 scale-100"
            x-transition:leave-end="opacity-0 translate-y-2 scale-95"
            @click="$store.notifications.removeNotification(notification.id)"
            :class="{
                'bg-secondary': notification.type === 'success',
                'bg-red-500': notification.type === 'error',
                'bg-amber-500': notification.type === 'warning',
                'bg-blue-500': notification.type === 'info'
            }"
            class="fixed text-white px-4 py-3 rounded-lg shadow-lg mb-4 z-50 max-w-sm w-full flex items-start gap-3 cursor-pointer"
            :style="'top: ' + (20 + index * 72) + 'px; right: 20px;'">
            <div class="mt-0.5">
                <x-ri-check-line x-show="notification.type === 'success'" class="size-5" />
                <x-ri-error-warning-line x-show="notification.type === 'error' || notification.type === 'warning'" class="size-5" />
                <x-ri-information-line x-show="notification.type === 'info'" class="size-5" />
            </div>
            <p class="text-sm leading-snug" x-text="notification.message"></p>
        </div>
    </template>
</div>
