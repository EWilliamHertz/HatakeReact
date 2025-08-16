/* ======================================================= */
/* FILE: public/app.js (Complete and Corrected Version)    */
/* ======================================================= */

import { auth, db } from './firebase-config.js';
import { 
    onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword,
    GoogleAuthProvider, signInWithPopup, signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { 
    doc, getDoc, setDoc, updateDoc, arrayUnion, collection, getDocs, query, where, addDoc, serverTimestamp, orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const HatakeApp = {
    setup() {
        const { ref, onMounted, computed } = Vue;

        // --- State Management ---
        const user = ref(null);
        const userProfile = ref(null);
        const email = ref('');
        const password = ref('');
        const authError = ref(null);
        const stats = ref({ collectionValue: "0", activeTrades: 0, unreadMessages: 0, reputation: 0, reviewsCount: 0 });
        const isLoading = ref(true);
        const dashboardError = ref(null);
        const currentPage = ref('dashboard');
        const referredUsers = ref([]);
        const copyButtonText = ref('Copy');
        const newPostContent = ref('');
        const posts = ref([]);
        const scryfallQuery = ref('');
        const scryfallResults = ref([]);
        const scryfallError = ref(null);
        const pricePreference = ref('usd');
        const settingsSaved = ref(false);

        // --- Computed Properties ---
        const referralLink = computed(() => user.value ? `${window.location.origin}/?ref=${user.value.uid}` : '');

        // --- Authentication & Registration ---
        const handleRegister = async () => {
            authError.value = null;
            if (!email.value || !password.value) { authError.value = "Please enter email and password."; return; }
            try {
                const cred = await createUserWithEmailAndPassword(auth, email.value, password.value);
                const userDocRef = doc(db, "users", cred.user.uid);
                const urlParams = new URLSearchParams(window.location.search);
                const referrerId = urlParams.get('ref');
                await setDoc(userDocRef, {
                    email: cred.user.email, createdAt: new Date(), collectionValue: "0", activeTrades: 0, unreadMessages: 0,
                    reputation: { score: 0, count: 0 }, referrals: [], referredBy: referrerId || null,
                });
                if (referrerId) {
                    await updateDoc(doc(db, "users", referrerId), { referrals: arrayUnion(cred.user.uid) });
                }
            } catch (err) { authError.value = err.message; }
        };

        const handleLogin = async () => {
            authError.value = null;
            if (!email.value || !password.value) { authError.value = "Please enter email and password."; return; }
            try {
                await signInWithEmailAndPassword(auth, email.value, password.value);
            } catch (err) { authError.value = err.message; }
        };
        
        const handleGoogleLogin = async () => {
            authError.value = null;
            try {
                const result = await signInWithPopup(auth, new GoogleAuthProvider());
                const userDocRef = doc(db, "users", result.user.uid);
                const docSnap = await getDoc(userDocRef);
                if (!docSnap.exists()) {
                    const urlParams = new URLSearchParams(window.location.search);
                    const referrerId = urlParams.get('ref');
                    await setDoc(userDocRef, {
                        email: result.user.email, displayName: result.user.displayName, createdAt: new Date(),
                        collectionValue: "0", activeTrades: 0, unreadMessages: 0,
                        reputation: { score: 0, count: 0 }, referrals: [], referredBy: referrerId || null,
                    });
                     if (referrerId) {
                        await updateDoc(doc(db, "users", referrerId), { referrals: arrayUnion(result.user.uid) });
                    }
                }
            } catch (err) { authError.value = err.message; }
        };

        const handleSignOut = () => signOut(auth);

        // --- Data Fetching ---
        const fetchUserData = async (uid) => {
            isLoading.value = true;
            dashboardError.value = null;
            try {
                const docSnap = await getDoc(doc(db, "users", uid));
                if (docSnap.exists()) {
                    userProfile.value = docSnap.data();
                    pricePreference.value = userProfile.value.pricePreference || 'usd';
                    stats.value = { 
                        collectionValue: userProfile.value.collectionValue || "0", activeTrades: userProfile.value.activeTrades || 0, 
                        unreadMessages: userProfile.value.unreadMessages || 0, reputation: userProfile.value.reputation?.score || 0, 
                        reviewsCount: userProfile.value.reputation?.count || 0 
                    };
                    if (userProfile.value.referrals && userProfile.value.referrals.length > 0) {
                        const q = query(collection(db, "users"), where('__name__', 'in', userProfile.value.referrals));
                        const querySnapshot = await getDocs(q);
                        referredUsers.value = querySnapshot.docs.map(d => ({...d.data(), id: d.id, createdAt: d.data().createdAt.toDate() }));
                    } else {
                        referredUsers.value = [];
                    }
                } else { dashboardError.value = "Welcome! Your user data is ready."; }
            } catch (err) { dashboardError.value = "Failed to fetch user data."; console.error(err); } 
            finally { isLoading.value = false; }
        };

        // --- Scryfall API ---
        const searchScryfall = async () => {
            if (!scryfallQuery.value) return;
            scryfallError.value = null;
            scryfallResults.value = [];
            try {
                const response = await fetch(`https://api.scryfall.com/cards/search?q=${encodeURIComponent(scryfallQuery.value)}`);
                if (!response.ok) throw new Error('Card not found or API error.');
                const data = await response.json();
                scryfallResults.value = data.data.map(card => {
                    const priceKey = pricePreference.value === 'eur' ? 'eur' : 'usd';
                    const currencySymbol = pricePreference.value === 'eur' ? '€' : '$';
                    const price = card.prices[priceKey] ? `${currencySymbol}${card.prices[priceKey]}` : 'N/A';
                    return { id: card.id, name: card.name, set_name: card.set_name, price: price };
                });
            } catch (err) { scryfallError.value = err.message; }
        };

        // --- Settings ---
        const savePricePreference = async () => {
            if (!user.value) return;
            settingsSaved.value = false;
            try {
                await updateDoc(doc(db, "users", user.value.uid), { pricePreference: pricePreference.value });
                settingsSaved.value = true;
                setTimeout(() => { settingsSaved.value = false; }, 3000);
            } catch (err) { console.error("Error saving settings:", err); }
        };

        // --- Social Feed ---
        const createPost = async () => {
            if (!newPostContent.value.trim()) return;
            try {
                await addDoc(collection(db, "posts"), {
                    authorId: user.value.uid, authorName: user.value.displayName || user.value.email,
                    content: newPostContent.value, createdAt: serverTimestamp(),
                });
                newPostContent.value = '';
                fetchPosts();
            } catch (err) { console.error("Error creating post:", err); }
        };

        const fetchPosts = async () => {
            try {
                const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
                const querySnapshot = await getDocs(q);
                posts.value = querySnapshot.docs.map(d => ({ ...d.data(), id: d.id }));
            } catch (err) { console.error("Error fetching posts:", err); }
        };

        // --- Lifecycle & UI Methods ---
        onMounted(() => {
            onAuthStateChanged(auth, (currentUser) => {
                user.value = currentUser;
                if (currentUser) {
                    fetchUserData(currentUser.uid);
                    fetchPosts();
                } else {
                    currentPage.value = 'dashboard';
                    isLoading.value = true;
                }
            });
        });
        
        const navigateTo = (page) => { currentPage.value = page; };
        const getNavClass = (page) => currentPage.value === page ? 'nav-link nav-active' : 'nav-link';
        const copyReferralLink = () => {
            navigator.clipboard.writeText(referralLink.value).then(() => {
                copyButtonText.value = 'Copied!';
                setTimeout(() => { copyButtonText.value = 'Copy'; }, 2000);
            });
        };
        const formatDate = (ts) => ts ? new Date(ts.seconds * 1000).toLocaleDateString() : '';
        const statCards = ref([
            { title: 'Collection Value', key: 'collectionValue', prefix: '$', defaultSubtitle: '+12.5% from last month' },
            { title: 'Active Trades', key: 'activeTrades', defaultSubtitle: '3 pending offers' },
            { title: 'Messages', key: 'unreadMessages', dynamicSubtitle: (s) => `${s.unreadMessages} unread` },
            { title: 'Reputation', key: 'reputation', dynamicSubtitle: (s) => `Based on ${s.reviewsCount} reviews` }
        ]);
        const getSubtitle = (card) => card.dynamicSubtitle ? card.dynamicSubtitle(stats.value) : card.defaultSubtitle;

        return { 
            user, email, password, authError, stats, isLoading, dashboardError, currentPage,
            referredUsers, copyButtonText, newPostContent, posts, scryfallQuery, scryfallResults, scryfallError,
            pricePreference, settingsSaved, referralLink,
            navigateTo, getNavClass, handleRegister, handleLogin, handleGoogleLogin, handleSignOut, 
            fetchUserData, createPost, searchScryfall, savePricePreference,
            copyReferralLink, formatDate, statCards, getSubtitle
        };
    }
};

Vue.createApp(HatakeApp).mount('#app');
