<div class="flex justify-center">
    @if ($paginator->hasPages())
        <nav role="navigation" aria-label="Pagination Navigation" class="flex gap-2 items-center text-sm">
            <span>
                @if ($paginator->onFirstPage())
                    <span class="bg-background-secondary text-base/60 px-3 py-1.5 rounded-full cursor-not-allowed">Previous</span>
                @else
                    <button wire:click="previousPage" wire:loading.attr="disabled" rel="prev" class="bg-background-secondary text-base px-3 py-1.5 rounded-full hover:bg-background-secondary/80 transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background">Previous</button>
                @endif
            </span>

            @foreach ($elements as $element)
                @if (is_array($element))
                    @foreach ($element as $page => $url)
                        @if (
                            $page == $paginator->currentPage() ||
                                $page <= 2 ||
                                $page > $paginator->lastPage() - 2 ||
                                abs($paginator->currentPage() - $page) <= 1)
                            <span>
                                <button wire:click="gotoPage({{ $page }})" wire:loading.attr="disabled"
                                    class="{{ $page === $paginator->currentPage() ? 'bg-primary text-white' : 'bg-background-secondary text-base' }} px-3 py-1.5 rounded-full cursor-pointer hover:bg-background-secondary/80 transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background">{{ $page }}</button>
                            </span>
                        @elseif($page == 3 || $page == $paginator->lastPage() - 3)
                            <span class="bg-background-secondary text-base px-3 py-1.5 rounded-full">
                                <span>...</span>
                            </span>
                        @endif
                    @endforeach
                @else
                    <span class="bg-background-secondary text-base px-3 py-1.5 rounded-full">
                        <span>...</span>
                    </span>
                @endif
            @endforeach


            <span>
                @if ($paginator->onLastPage())
                    <span class="bg-background-secondary text-base/60 px-3 py-1.5 rounded-full cursor-not-allowed">Next</span>
                @else
                    <button wire:click="nextPage" wire:loading.attr="disabled" rel="next"
                        class="bg-background-secondary text-base px-3 py-1.5 rounded-full hover:bg-background-secondary/80 transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background">Next</button>
                @endif
            </span>
        </nav>
    @endif
</div>
