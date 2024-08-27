// import { initializeApp } from 'firebase/app';
// import { collection, getDocs, getFirestore } from 'firebase/firestore';

export default async function sitemap() {
    // const firebaseConfig = {
    //     apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    //     authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    //     projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    //     storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    //     messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    //     appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    //     measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
    // };

    // const firebaseApp = initializeApp(firebaseConfig);
    // const firebaseDB = getFirestore(firebaseApp);
    // const db = firebaseDB;

    // const fetchCategories = async () => {
    //     const querySnapshot = await getDocs(collection(db, 'categories'));
    //     return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // };

    // const categoryCards = await fetchCategories();

    // const categoryEntries = categoryCards?.map(({ slug }) => ({
    //     url: `${process.env.NEXT_PUBLIC_BASE_URL}/category/${slug}`,
    //     lastModified: new Date(),
    //     changeFrequency: 'daily',
    //     priority: 0.9
    // })) || [];

    return [
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/about`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.7
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/contact`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.7
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/categories`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/privacy-policy`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.7
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/terms-and-conditions`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.7
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/trending`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/search`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8
        },
        // ...categoryEntries,
    ];
}
