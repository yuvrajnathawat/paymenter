@props([
    'target' => null,
])
<div role="status" 
    @if(!$target) wire:loading @else wire:loading wire:target="{{ $target }}" @endif
    aria-busy="true"
>
    <x-ri-loader-5-fill aria-hidden="true" {{ $attributes->merge(['class' => 'size-5 me-2 fill-primary animate-spin']) }} />
    <span class="sr-only">Loading...</span>
</div>