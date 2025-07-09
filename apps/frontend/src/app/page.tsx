import { sanityFetch } from '@/lib/sanity/live';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity/client';
import ItinerarySection from '@/components/itinerary-section';

async function fetchPageData() {
  return await sanityFetch({
    query: `*[_type == "homePage"][0]`,
  });
}

export default async function Home() {
  const pageData = await fetchPageData();
  const { hero, itinerary } = pageData.data;

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
      <ItinerarySection itinerary={itinerary} />
    </div>
  );
}
