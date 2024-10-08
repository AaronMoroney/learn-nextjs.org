import { Suspense } from 'react';

import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/invoices/table';
import { CreateInvoice } from '@/app/ui/invoices/buttons';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { fetchInvoicesPages } from '@/app/lib/data';


// https://nextjs.org/learn/dashboard-app/adding-search-and-pagination
interface InvoicePageProps {
  searchParams?: {
    query?: string
    page?: string 
  }
}

// if we search in the field, the URL will update - the data will be fetched, and our queried term will be returned
export default async function Page({ searchParams }: InvoicePageProps) {
  const query = searchParams?.query || '';
  const currentPage =  Number(searchParams?.page) || 1;

  const totalPages = await fetchInvoicesPages(query);
   
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        {/* search is a client component -> useSearchParams, as a general rule: read params from client, useSearchParams() */}
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>
       <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        {/* server component */}
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}