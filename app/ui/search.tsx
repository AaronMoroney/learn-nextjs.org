'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useDebouncedCallback } from 'use-debounce';

//https://nextjs.org/learn/dashboard-app/adding-search-and-pagination
export default function Search({ placeholder }: { placeholder: string }) {
 
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace }= useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    // this log illustrates the on every key stroke, querying DB on every keystroke
    console.log(`Searching... ${term}`);

    // we'll use a debouncing to limit this 
    // how it works 
    // ---------------
    // 1. Trigger-event: starts the debounce timer
    // 2. Wait: if a new event occurs before the timer expires, a new timer is set
    // 3. Execution: if the timer reaches the end, the debounced function is executed
    
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    term ? params.set('query', term) : params.delete('query');
    // pathname is the current path, in our case -/dashboard/invoices
    // params.toString() translates the term into URL friendly format
    // ^ e.g /dashboard/invoices?query=lee if the term is 'lee'
    // URL is updated without reloading the page -> next.js client side navigation
    replace(`${pathname}?${params.toString()}`)
  }, 300);

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get('query')?.toString()}
        // this is an uncontrolled approach, as we are not using state, the input manages it's own state
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
