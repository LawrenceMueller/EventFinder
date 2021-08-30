import qs from 'qs';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { API_URL } from '@/config/index';
import EventItem from '@/components/EventItem';

export default function SearchPage({ events }) {
  const router = useRouter();

  return (
    <Layout title='Search Results'>
      <Link href='/events'>Back</Link>
      <h1>Search Results for {router.query.term}</h1>
      {events.length === 0 && <h3>No Events to show</h3>}

      {events.map((evt) => (
        <EventItem key={evt.id} evt={evt} />
      ))}
    </Layout>
  );
}

{
  /* This function is where the actual searching happens. The events found are then returned from here to the component above. */
}
export async function getServerSideProps({ query: { term } }) {
  {
    /* This query string package was needed to format what the user is looking for correctly. That way strapi does the rest */
  }
  const query = qs.stringify({
    _where: {
      _or: [
        { name_contains: term },
        { performers_contains: term },
        { description_contains: term },
        { address_contains: term },
      ],
    },
  });

  const res = await fetch(`${API_URL}/events?${query}`);
  const events = await res.json();

  return {
    props: { events },
  };
}
