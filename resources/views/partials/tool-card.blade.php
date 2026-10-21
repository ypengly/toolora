<a href="{{ route('tools.show', $tool->slug) }}" class="card group flex flex-col gap-3 transition hover:border-indigo-400 hover:shadow-md dark:hover:border-indigo-500">
    <div class="flex items-center justify-between">
        <span class="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300"><i data-lucide="{{ $tool->icon }}" class="h-5 w-5"></i></span>
        <span class="badge {{ $tool->access_level === 'free' ? 'badge-free' : '' }}">{{ ucfirst($tool->access_level) }}</span>
    </div>
    <div>
        <h3 class="font-semibold">{{ $tool->name }}</h3>
        <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">{{ $tool->description }}</p>
    </div>
    <div class="mt-auto flex items-center justify-between text-xs text-slate-500">
        <span>{{ $tool->category->name }}</span>
        <span class="inline-flex items-center gap-1 font-medium text-indigo-600 dark:text-indigo-400">Open tool <i data-lucide="arrow-right" class="h-3.5 w-3.5"></i></span>
    </div>
</a>
