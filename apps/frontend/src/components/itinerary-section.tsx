'use client';

import Image from 'next/image';
import { urlFor } from '@/lib/sanity/client';
import { ItineraryItem } from '@/lib/sanity/sanity.types';
import {
  parseSanityDate,
  formatSanityDate,
  formatSanityDateTime,
} from '@/lib/utils';
import { compareAsc } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { useEffect, useState, useRef } from 'react';

interface ItinerarySectionProps {
  itinerary: Array<{ date?: string } & ItineraryItem>;
}

export default function ItinerarySection({ itinerary }: ItinerarySectionProps) {
  const [currentStickyDate, setCurrentStickyDate] = useState<string>('');
  const [showSticky, setShowSticky] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyHeaderRef = useRef<HTMLDivElement>(null);

  function organizeItinerary(items: Array<{ date?: string } & ItineraryItem>) {
    // Filter out items without dates and sort by date
    const itemsWithDates = items
      .filter(
        (item): item is { date: string } & ItineraryItem =>
          item.date !== undefined
      )
      .sort((a, b) => {
        const dateA = parseSanityDate(a.date);
        const dateB = parseSanityDate(b.date);
        if (!dateA || !dateB) return 0;
        return compareAsc(dateA, dateB);
      });

    // Group items by date in LA timezone (only convert once here)
    const groupedByDate = itemsWithDates.reduce(
      (acc, item) => {
        const date = parseSanityDate(item.date);
        if (!date) return acc;

        // Convert to LA timezone for proper grouping
        const localDate = toZonedTime(date, 'America/Los_Angeles');
        const dateKey = localDate.toDateString();

        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(item);
        return acc;
      },
      {} as Record<string, Array<{ date: string } & ItineraryItem>>
    );

    // Sort items within each date by time
    Object.keys(groupedByDate).forEach((dateKey) => {
      groupedByDate[dateKey].sort((a, b) => {
        const dateA = parseSanityDate(a.date);
        const dateB = parseSanityDate(b.date);
        if (!dateA || !dateB) return 0;
        return compareAsc(dateA, dateB);
      });
    });

    return {
      groupedByDate,
      sortedDates: Object.keys(groupedByDate).sort((a, b) =>
        compareAsc(new Date(a), new Date(b))
      ),
    };
  }

  const { groupedByDate, sortedDates } = organizeItinerary(itinerary);

  useEffect(() => {
    if (!containerRef.current || sortedDates.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find all date headers
        const headers = entries.filter((entry) =>
          entry.target.classList.contains('date-header')
        );

        if (headers.length === 0) return;

        // Sort headers by their position in the document
        const sortedHeaders = headers.sort((a, b) => {
          const aRect = a.boundingClientRect;
          const bRect = b.boundingClientRect;
          return aRect.top - bRect.top;
        });

        // Find the current section based on scroll position
        let currentDate = '';
        let shouldShowSticky = false;

        // Always find the most recent header that has scrolled past the top
        for (const entry of sortedHeaders) {
          const rect = entry.boundingClientRect;
          const dateKey = entry.target.getAttribute('data-date');

          if (!dateKey) continue;

          // If header has passed the top, this should be our sticky date
          if (rect.top <= 0) {
            currentDate = dateKey;
            shouldShowSticky = true;
          }
        }

        // Only hide sticky if the current section's header is very close to the top
        const currentSectionHeader = sortedHeaders.find(
          (entry) => entry.target.getAttribute('data-date') === currentDate
        );

        if (
          currentSectionHeader &&
          currentSectionHeader.isIntersecting &&
          currentSectionHeader.boundingClientRect.top >= -10 &&
          currentSectionHeader.boundingClientRect.top <= 50
        ) {
          shouldShowSticky = false;
          currentDate = '';
        }

        setShowSticky(shouldShowSticky);

        setCurrentStickyDate(currentDate);
      },
      {
        root: null,
        rootMargin: '0px 0px 0px 0px',
        threshold: [0, 0.1, 0.5, 1],
      }
    );

    // Observe all date headers
    const dateHeaders = containerRef.current.querySelectorAll('.date-header');
    dateHeaders.forEach((header) => observer.observe(header));

    // Also observe the container to handle show/hide logic
    const containerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            setShowSticky(false);
          }
        });
      },
      {
        root: null,
        rootMargin: '-400px 0px 0px 0px', // Adjust based on your hero height
        threshold: 0,
      }
    );

    containerObserver.observe(containerRef.current);

    return () => {
      observer.disconnect();
      containerObserver.disconnect();
    };
  }, [sortedDates]);

  return (
    <>
      {/* Sticky Date Header */}
      <div
        ref={stickyHeaderRef}
        className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-indigo-200 shadow-lg transition-all duration-300 ease-in-out ${
          showSticky && currentStickyDate
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
      >
        <div className='container mx-auto max-w-6xl px-4 py-4'>
          <h2 className='text-lg font-sans font-bold text-indigo-600'>
            {currentStickyDate ? formatSanityDate(currentStickyDate) : ''}
          </h2>
        </div>
      </div>

      {/* Itinerary Section */}
      <section ref={containerRef} className='py-16 px-4'>
        <div className='container mx-auto max-w-6xl'>
          {sortedDates.map((date) => (
            <div key={date} className='mb-16'>
              <h2
                className='date-header text-xl font-sans font-bold text-indigo-600 mb-8'
                data-date={date}
              >
                {formatSanityDate(date)}
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                {groupedByDate[date].map((item, index) => (
                  <div
                    key={`${item.date}-${index}`}
                    className='bg-white rounded-lg shadow-lg overflow-hidden relative transition-transform duration-200 hover:scale-105'
                  >
                    {item.date && (
                      <div className='absolute top-4 left-4 z-10 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg'>
                        {formatSanityDateTime(item.date)}
                      </div>
                    )}
                    {item.image && item.image.asset && (
                      <div className='relative h-48'>
                        <Image
                          src={urlFor(item.image.asset).url()}
                          alt={item.title || 'Itinerary item'}
                          fill
                          className='object-cover'
                        />
                      </div>
                    )}
                    <div className='p-6'>
                      <h3 className='text-xl font-semibold mb-2 text-indigo-950'>
                        {item.title}
                      </h3>
                      <p className='text-gray-600 mb-2'>{item.description}</p>
                      {item.map && (
                        <p className='text-sm text-gray-500'>
                          📍{' '}
                          <a
                            href={`https://maps.google.com/maps?q=${item.map.lat},${item.map.lng}`}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='underline hover:text-indigo-600 transition-colors'
                          >
                            Open in Google Maps
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
