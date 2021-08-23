import Layout from '@/components/Layout';
import { useRouter } from 'next/router';
import { parseCookies } from '@/helpers/index';
import { API_URL } from '@/config/index';
import DashboardEvent from '@/components/DashboardEvent';
import styles from '@/styles/Dashboard.module.css';

export default function DashboardPage({ events, token }) {
  const router = useRouter();

  const deleteEvent = async (id) => {
    if (confirm('Are you sure?')) {
      const res = await fetch(`${API_URL}/events/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
      } else {
        router.reload();
      }
    }
  };

  return (
    <Layout title='User Dashboard'>
      <div className={styles.dash}>
        <h3>My Events</h3>

        {events.map((evt) => {
          return (
            <DashboardEvent key={evt.id} evt={evt} handleDelete={deleteEvent} />
          );
        })}
      </div>
    </Layout>
  );
}

/* This functions purpose is to get all events associated 
  with a user then pass that data to be used in the dashboard.
*/
export async function getServerSideProps({ req }) {
  // Destructer the token out of the request used to hit this page
  // setting it to equal the cookie that is parsed
  const { token } = parseCookies(req);

  // Fetch the user events data by using a custom endpoint made in strapi
  const res = await fetch(`${API_URL}/events/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Set events equal to responce from strapi
  const events = await res.json();

  // Return events to make it usable in the dashboard JSX
  // Also return token in order to be used in buisness logic funcitons like delete
  return {
    props: {
      events,
      token,
    },
  };
}
