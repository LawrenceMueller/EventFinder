import Layout from '@/components/Layout';
import { parseCookies } from '@/helpers/index';
import { API_URL } from '@/config/index';
import DashboardEvent from '@/components/DashboardEvent';
import styles from '@/styles/Dashboard.module.css';

export default function DashboardPage({ events }) {
  const deleteEvent = (id) => {
    console.log(id);
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

  // Set events equal to user events in json format
  const events = await res.json();

  // Return events to make it usable in the dashboard JSX
  return {
    props: { events },
  };
}
