<x-button.primary {{ $attributes->merge(['class' => 'bg-red-700 bg-none text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200 ease-out transform hover:scale-[1.02]'])}}>
    {{ $slot }}
</x-button.primary>