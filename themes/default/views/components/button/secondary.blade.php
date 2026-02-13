<button 
    {{ $attributes->merge(['class' => 'flex items-center gap-2 justify-center bg-background-secondary text-sm font-semibold border border-neutral hover:bg-background-secondary/80 py-2.5 lg:py-2 px-4.5 rounded-lg w-full transition duration-200 ease-out transform hover:scale-[1.02] shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50']) }}>
    @if (isset($type) && $type === 'submit')
        <div role="status" wire:loading aria-busy="true">
            <x-ri-loader-5-fill aria-hidden="true" class="size-6 me-2 fill-background animate-spin" />
            <span class="sr-only">Loading...</span>
        </div>
        <div wire:loading.remove>
            {{ $slot }}
        </div>
    @else
        {{ $slot }}
    @endif
</button>
