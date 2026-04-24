import { prisma } from '@/lib/prisma';
import { uploadPhoto, deletePhoto } from './actions';
import DeleteButton from '../components/DeleteButton';
import styles from '../admin.module.css';

export default async function AdminGallery() {
  const photos = await prisma.photo.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>Manage Gallery</h1>

      <div className={styles.card} style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Upload New Photo</h2>
        <form action={async (formData) => {
          'use server';
          await uploadPhoto(formData);
        }} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
          <div className={styles.formGroup} style={{ marginBottom: 0, flex: 1 }}>
            <label>Select Image</label>
            <input type="file" name="photo" accept="image/*" multiple required className={styles.input} />
          </div>
          <div className={styles.formGroup} style={{ marginBottom: 0, flex: 2 }}>
            <label>Caption (Optional)</label>
            <input type="text" name="caption" placeholder="A beautiful sunset..." className={styles.input} />
          </div>
          <button type="submit" className={styles.btn}>Upload</button>
        </form>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {photos.map((photo: any) => (
          <div key={photo.id} style={{ border: '1px solid #e5e7eb', borderRadius: '4px', overflow: 'hidden', backgroundColor: 'white', display: 'flex', flexDirection: 'column' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.url} alt={photo.caption || 'Gallery image'} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
            {photo.caption && <p style={{ padding: '0.5rem', fontSize: '0.875rem' }}>{photo.caption}</p>}
            <form action={deletePhoto.bind(null, photo.id, photo.url)} style={{ marginTop: 'auto', padding: '0.5rem', borderTop: '1px solid #e5e7eb' }}>
              <DeleteButton 
                confirmMessage="Delete this photo?"
                style={{ width: '100%', background: '#fee2e2', color: '#ef4444', border: 'none', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer' }}
              >
                Delete Photo
              </DeleteButton>
            </form>
          </div>
        ))}
      </div>
      {photos.length === 0 && <p>No photos uploaded yet.</p>}
    </div>
  );
}
