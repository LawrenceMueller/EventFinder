import { parseCookies } from '@/helpers/index';
import moment from 'moment';
import { FaImage } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { API_URL } from '@/config/index.js';
import ImageUpload from '@/components/ImageUpload';
import Layout from '@/components/Layout';
import Modal from '@/components/Modal';
import styles from '@/styles/Form.module.css';

export default function EditEventPage({ evt, token }) {
  const [values, setValues] = useState({
    name: evt.name,
    performers: evt.performers,
    venue: evt.value,
    address: evt.address,
    date: evt.date,
    time: evt.time,
    description: evt.description,
  });

  // The following state is used to know whether or not an event has an image preview
  const [imagePreview, setImagePreview] = useState(
    evt.image ? evt.image.formats.thumbnail.url : null
  );
  const [showModal, setShowModal] = useState(false);

  const router = useRouter();

  {
    /* This function handles posting the new event information to the backend */
  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    //Validation check for empty fields
    const hasEmptyFields = Object.values(values).some(
      (element) => element === ''
    );

    if (hasEmptyFields) {
      toast.error('Make sure no fields are empty');
      return;
    }

    const res = await fetch(`${API_URL}/events/${evt.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      if (res.status === 403 || res.status === 401) {
        toast.error('No Token Included');
        return;
      }
      toast.error('Something Went Wrong');
      console.log(res);
    } else {
      // If everything went well we need to grab the event that the user just updated in case the user changed the title, which would change the slug
      const evt = await res.json();
      router.push(`/events/${evt.slug}`);
    }
  };

  {
    /* A dynamic function which sets values of changed event information by destructering the 
    name and value and passing that into the set function for the values state */
  }
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  {
    /* This function fetches the image that the user uploaded and sets the image preview state to that picture */
  }
  const imageUploaded = async (e) => {
    const res = await fetch(`${API_URL}/events/${evt.id}`);
    const data = await res.json();

    setImagePreview(data.image.formats.thumbnail.url);
    setShowModal(false);
  };

  return (
    <Layout title='Add New Event'>
      <Link href='/events'>Back</Link>
      <h1>Edit Event</h1>
      <ToastContainer />
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.grid}>
          <div>
            <lable htmlFor='name'>Event name</lable>
            <input
              type='text'
              id='name'
              name='name'
              value={values.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor='performers'>Performers</label>
            <input
              type='text'
              name='performers'
              id='performers'
              value={values.performers}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor='venue'>Venue</label>
            <input
              type='text'
              name='venue'
              id='venue'
              value={values.venue}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor='address'>Address</label>
            <input
              type='text'
              name='address'
              id='address'
              value={values.address}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor='date'>Date</label>
            <input
              type='date'
              name='date'
              id='date'
              value={moment(values.date).format('yyyy-MM-DD')}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor='time'>Time</label>
            <input
              type='text'
              name='time'
              id='time'
              value={values.time}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div>
          <label htmlFor='description'>Event Description</label>
          <textarea
            type='text'
            name='description'
            id='description'
            value={values.description}
            onChange={handleInputChange}
          ></textarea>
        </div>

        <input type='submit' value='Update Event' className='btn' />
      </form>

      <h2>Evetn Image</h2>
      {/* Conditional render that shows an image preview if one has been provided */}
      {imagePreview ? (
        <Image
          src={imagePreview}
          height={100}
          width={170}
          alt='dynamic content'
        />
      ) : (
        <div>
          <p>No image uploaded</p>
        </div>
      )}

      {/* When the following button is pressed the modal below it is displayed */}
      <div>
        <button className='btn-secondary' onClick={() => setShowModal(true)}>
          <FaImage /> Set Image
        </button>
      </div>

      {/* This modal shows the image upload component where the user uploades an image for the event */}
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <ImageUpload
          evtId={evt.id}
          imageUploaded={imageUploaded}
          token={token}
        />
      </Modal>
    </Layout>
  );
}

/* This function grabs and returns to the main compopnent above the token from the cookie and 
   all imforation for the event that needs to be edited. That way we can show the current information
   of the event
*/
export async function getServerSideProps({ params: { id }, req }) {
  const { token } = parseCookies(req);

  const res = await fetch(`${API_URL}/events/${id}`);
  const evt = await res.json();

  return {
    props: {
      evt,
      token,
    },
  };
}
