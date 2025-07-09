import { sanityFetch } from '@/lib/sanity/live';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity/client';
import { ItineraryItem } from '@/lib/sanity/sanity.types';

async function fetchPageData() {
  return await sanityFetch({
    query: `*[_type == "homePage"][0]`,
  });
}

export default async function Home() {
  const pageData = await fetchPageData();
  const { hero, itinerary } = pageData.data;

  function organizeItinerary(items: Array<{ date?: string } & ItineraryItem>) {
    // Filter out items without dates and sort by date
    const itemsWithDates = items
      .filter(
        (item): item is { date: string } & ItineraryItem =>
          item.date !== undefined
      )
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Group items by date
    const groupedByDate = itemsWithDates.reduce(
      (acc, item) => {
        const dateKey = new Date(item.date).toDateString(); // Use date string for grouping
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
      groupedByDate[dateKey].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    });

    return {
      groupedByDate,
      sortedDates: Object.keys(groupedByDate).sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
      ),
    };
  }

  const { groupedByDate, sortedDates } = organizeItinerary(itinerary);

  const imageUrl = urlFor(hero.image).url();
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-purple-50'>
      {/* Hero Section */}
      <section className='py-10 px-4 text-center'>
        <div className='container mx-auto max-w-4xl'>
          <div className='relative rounded-2xl overflow-hidden shadow-2xl'>
            <Image
              src={imageUrl}
              alt={hero.title}
              width={1200}
              height={600}
              className='w-full h-auto object-cover'
              priority
            />
            <div className='absolute inset-0 bg-black/50'></div>
            <div className='absolute inset-0 flex flex-col items-center justify-center p-8'>
              <h1 className='text-4xl md:text-9xl font-parisienne text-indigo-300 mb-6 px-6 py-3 rounded-lg inline-block relative'>
                <span className='relative z-10'>{hero.title}</span>
              </h1>
            </div>
          </div>
        </div>
      </section>
      {/* Itinerary Section */}
      <section className='py-16 px-4'>
        <div className='container mx-auto max-w-6xl'>
          {sortedDates.map((date) => (
            <div key={date} className='mb-16'>
              <h2 className='text-3xl font-parisienne text-indigo-600 mb-8'>
                {new Date(date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                {groupedByDate[date].map((item, index) => {
                  return (
                    <div
                      key={`${item.date}-${index}`}
                      className='bg-white rounded-lg shadow-lg overflow-hidden relative'
                    >
                      {item.date && (
                        <div className='absolute top-4 left-4 z-10 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg'>
                          {new Date(item.date).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                          })}
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
                              className='underline hover:text-indigo-600'
                            >
                              Open in Google Maps
                            </a>
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
