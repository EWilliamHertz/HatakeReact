import { auth, db, storage } from './firebase-config.js';
import { 
    onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword,
    GoogleAuthProvider, signInWithPopup, signOut, sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { 
    doc, getDoc, setDoc, updateDoc, collection, getDocs, query, addDoc, serverTimestamp, orderBy, deleteDoc, writeBatch
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { 
    ref as storageRef, uploadBytesResumable, getDownloadURL 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const HatakeApp = {
    setup() {
        const { ref, onMounted, computed } = Vue;

        // --- State Management ---
        const user = ref(null);
        const userProfile = ref({});
        const email = ref('');
        const password = ref('');
        const authError = ref(null);
        const stats = ref({ collectionValue: "0", activeTrades: 0, unreadMessages: 0, reputation: 0, reviewsCount: 0, cardCount: 0 });
        const isLoading = ref(true);
        const dashboardError = ref(null);
        const currentPage = ref('dashboard');
        
        // Settings Page State
        const currentSettingsTab = ref('account');
        const settingsSaved = ref(false);
        const displayName = ref('');
        const handle = ref('');
        const pricePreference = ref('usd');
        const shippingInfo = ref({ domestic: '', europe: '', northAmerica: '', restOfWorld: '' });
        const playerPersonality = ref({ primaryPlaystyle: '', favoriteFormat: '', petCard: '', nemesisCard: '' });
        const payoutInfo = ref({ iban: '', swiftBic: '', bankName: '', accountHolder: '' });

        // Social Feed State
        const newPostContent = ref('');
        const posts = ref([]);
        const socialFeedTab = ref('public');
        const mediaFile = ref(null);
        const mediaPreviewUrl = ref(null);
        const uploadProgress = ref(0);
        const isUploading = ref(false);

        // Collection Page State
        const userCollection = ref([]);
        const wishlist = ref([]);
        const currentCollectionView = ref('collection');
        const displayMode = ref('grid');
        const searchQuery = ref('');
        const filters = ref({ set: 'all', rarity: 'all', color: 'all' });
        const isBulkAddModalVisible = ref(false);
        const bulkAddText = ref('');
        const isAddingCards = ref(false);

        // Profile Page State
        const profileTab = ref('overview');
        
        // --- Data Fetching ---
        const fetchUserCollection = async (uid) => {
            try {
                const collectionPath = collection(db, 'users', uid, 'collection');
                const querySnapshot = await getDocs(collectionPath);
                userCollection.value = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                stats.value.cardCount = userCollection.value.length;
            } catch (error) {
                console.error("Error fetching user collection:", error);
                dashboardError.value = "Could not load collection. Check Firestore rules.";
            }
        };

        const fetchPosts = async () => {
            try {
                const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
                const querySnapshot = await getDocs(q);
                posts.value = querySnapshot.docs.map(d => ({ ...d.data(), id: d.id }));
            } catch (err) {
                console.error("Error fetching posts:", err);
                dashboardError.value = "Could not load posts. Check Firestore rules.";
            }
        };
        
        const fetchUserData = async (uid) => {
            isLoading.value = true;
            dashboardError.value = null;
            try {
                const docSnap = await getDoc(doc(db, "users", uid));
                if (docSnap.exists()) {
                    userProfile.value = docSnap.data();
                    displayName.value = userProfile.value.displayName || '';
                    handle.value = userProfile.value.handle || '';
                    pricePreference.value = userProfile.value.pricePreference || 'usd';
                    shippingInfo.value = userProfile.value.shippingInfo || {};
                    playerPersonality.value = userProfile.value.playerPersonality || {};
                    payoutInfo.value = userProfile.value.payoutInfo || {};
                    
                    stats.value = { ...stats.value, ...userProfile.value };
                }
                await fetchUserCollection(uid);
            } catch (error) {
                console.error("Error fetching user data:", error);
                dashboardError.value = "Failed to load user data.";
            } finally {
                isLoading.value = false;
            }
        };

        // --- Authentication & User Profile ---
        const createNewUserProfile = (cred) => {
             const userDocRef = doc(db, "users", cred.user.uid);
             return setDoc(userDocRef, { 
                email: cred.user.email, 
                createdAt: serverTimestamp(), 
                displayName: cred.user.displayName || cred.user.email.split('@')[0],
                handle: cred.user.email.split('@')[0],
                isAdmin: false,
                photoURL: cred.user.photoURL || `https://ui-avatars.com/api/?name=${cred.user.email.split('@')[0]}&background=random`
            });
        };

        const handleRegister = async () => {
            authError.value = null;
            if (!email.value || !password.value) { authError.value = "Please enter email and password."; return; }
            try {
                const cred = await createUserWithEmailAndPassword(auth, email.value, password.value);
                await createNewUserProfile(cred);
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
                    await createNewUserProfile(result);
                }
            } catch (err) { authError.value = err.message; }
        };

        const handleSignOut = () => signOut(auth);
        
        const handlePasswordReset = () => {
            if (!user.value?.email) { alert("Could not find user email."); return; }
            sendPasswordResetEmail(auth, user.value.email)
                .then(() => { alert("Password reset email sent!"); })
                .catch((error) => { console.error("Password reset error:", error); alert("Failed to send password reset email."); });
        };

        // --- Settings ---
        const saveProfileSettings = async () => {
             if (!user.value) return;
             settingsSaved.value = false;
             const userDocRef = doc(db, "users", user.value.uid);
             try {
                const updatedData = {
                    displayName: displayName.value,
                    handle: handle.value,
                    pricePreference: pricePreference.value,
                    shippingInfo: shippingInfo.value,
                    playerPersonality: playerPersonality.value,
                    payoutInfo: payoutInfo.value
                };
                await updateDoc(userDocRef, updatedData);
                settingsSaved.value = true;
                setTimeout(() => { settingsSaved.value = false; }, 3000);
            } catch (err) { 
                console.error("Error saving settings:", err); 
                alert("Error saving settings: " + err.message);
            }
        };

        // --- Social Feed & Media Uploads ---
        const handleMediaFileChange = (event) => {
            const file = event.target.files[0];
            if (file) {
                mediaFile.value = file;
                mediaPreviewUrl.value = URL.createObjectURL(file);
                uploadProgress.value = 0;
            }
        };

        const createPost = async () => {
            if (!newPostContent.value.trim() && !mediaFile.value) return;
            isUploading.value = true;
            let mediaUrl = null, mediaType = null;
            if (mediaFile.value) {
                const filePath = `posts/${user.value.uid}/${Date.now()}_${mediaFile.value.name}`;
                const fileRef = storageRef(storage, filePath);
                const uploadTask = uploadBytesResumable(fileRef, mediaFile.value);
                await new Promise((resolve, reject) => {
                    uploadTask.on('state_changed', 
                        (snapshot) => { uploadProgress.value = (snapshot.bytesTransferred / snapshot.totalBytes) * 100; }, 
                        (error) => { reject(error); }, 
                        async () => {
                            mediaUrl = await getDownloadURL(uploadTask.snapshot.ref);
                            mediaType = mediaFile.value.type;
                            resolve();
                        }
                    );
                });
            }
            try {
                await addDoc(collection(db, "posts"), {
                    authorId: user.value.uid,
                    authorUsername: handle.value || user.value.email.split('@')[0],
                    authorPhotoURL: userProfile.value.photoURL,
                    content: newPostContent.value,
                    createdAt: serverTimestamp(),
                    mediaUrl: mediaUrl,
                    mediaType: mediaType
                });
                newPostContent.value = ''; mediaFile.value = null; mediaPreviewUrl.value = null; uploadProgress.value = 0;
                fetchPosts();
            } catch (err) { console.error("Error creating post:", err); }
            finally { isUploading.value = false; }
        };
        
        const deletePost = async (postId) => {
            if (!confirm("Are you sure you want to delete this post?")) return;
            try {
                await deleteDoc(doc(db, "posts", postId));
                fetchPosts();
            } catch (err) { console.error("Error deleting post:", err); }
        };

        // --- Collection Page Actions ---
        const importFromCSV = () => alert("CSV Import functionality coming soon!");
        const exportAsText = () => alert("Export as Text functionality coming soon!");
        const quickEdit = () => alert("Quick Edit functionality coming soon!");
        
        const bulkAddFromText = () => {
            isBulkAddModalVisible.value = true;
        };

        const handleBulkAddSave = async () => {
            if (!bulkAddText.value.trim() || !user.value) return;
            isAddingCards.value = true;
            const lines = bulkAddText.value.trim().split('\n');
            const batch = writeBatch(db);

            for (const line of lines) {
                const match = line.match(/^(?:(\d+)\s)?(.*)/);
                if (!match) continue;

                const quantity = parseInt(match[1] || '1', 10);
                const cardName = match[2].trim();

                if (!cardName) continue;

                try {
                    const response = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(cardName)}`);
                    if (!response.ok) {
                        console.warn(`Card not found: ${cardName}`);
                        continue;
                    }
                    const cardData = await response.json();
                    
                    const newCard = {
                        name: cardData.name,
                        set: cardData.set_name,
                        rarity: cardData.rarity,
                        imageUrl: cardData.image_uris?.art_crop || cardData.image_uris?.normal,
                        value: cardData.prices?.usd || 0,
                        addedAt: serverTimestamp()
                    };

                    for (let i = 0; i < quantity; i++) {
                        const newCardRef = doc(collection(db, 'users', user.value.uid, 'collection'));
                        batch.set(newCardRef, newCard);
                    }
                } catch (error) {
                    console.error(`Error fetching data for ${cardName}:`, error);
                }
            }

            try {
                await batch.commit();
                await fetchUserCollection(user.value.uid);
            } catch (error) {
                console.error("Error committing batch:", error);
            } finally {
                isAddingCards.value = false;
                isBulkAddModalVisible.value = false;
                bulkAddText.value = '';
            }
        };

        // --- Computed Properties for Filtering ---
        const filteredCollection = computed(() => {
            let items = currentCollectionView.value === 'collection' ? userCollection.value : wishlist.value;
            if (!items) return [];
            return items.filter(card => {
                const searchMatch = searchQuery.value ? card.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) : true;
                const setMatch = filters.value.set !== 'all' ? card.set === filters.value.set : true;
                const rarityMatch = filters.value.rarity !== 'all' ? card.rarity === filters.value.rarity : true;
                const colorMatch = filters.value.color !== 'all' ? card.color === filters.value.color : true;
                return searchMatch && setMatch && rarityMatch && colorMatch;
            });
        });

        const filteredPosts = computed(() => {
            if (socialFeedTab.value === 'public') {
                return posts.value;
            }
            if (socialFeedTab.value === 'groups') {
                return posts.value; 
            }
            if (socialFeedTab.value === 'friends') {
                return posts.value;
            }
            return posts.value;
        });

        // --- Lifecycle & UI Methods ---
        onMounted(() => {
            onAuthStateChanged(auth, (currentUser) => {
                user.value = currentUser;
                if (currentUser) {
                    fetchUserData(currentUser.uid);
                    fetchPosts();
                } else {
                    currentPage.value = 'dashboard';
                    userProfile.value = {};
                    userCollection.value = [];
                    posts.value = [];
                }
            });
        });
        
        const navigateTo = (page) => { currentPage.value = page; };
        const getNavClass = (page) => currentPage.value === page ? 'nav-link nav-active' : 'nav-link';
        const getSettingsTabClass = (tab, currentTab, isMainTab = false) => {
            const baseClass = isMainTab ? 'main-tab' : 'settings-tab';
            return currentTab === tab ? `${baseClass} ${baseClass}-active` : baseClass;
        };
        const formatDate = (ts) => ts ? new Date(ts.seconds * 1000).toLocaleString() : '';
        
        const statCards = ref([
            { title: 'Collection Value', key: 'collectionValue', prefix: '$', dynamicSubtitle: (s) => `${s.cardCount} cards total` },
            { title: 'Active Trades', key: 'activeTrades', dynamicSubtitle: (s) => `${s.activeTrades} pending offers` },
            { title: 'Messages', key: 'unreadMessages', dynamicSubtitle: (s) => `${s.unreadMessages} unread` },
            { title: 'Reputation', key: 'reputation', dynamicSubtitle: (s) => `Based on ${s.reviewsCount} reviews` }
        ]);
        
        const getSubtitle = (card) => {
            if (card.dynamicSubtitle) { return card.dynamicSubtitle(stats.value); }
            return card.defaultSubtitle || '';
        };

        return { 
            user, userProfile, email, password, authError, stats, isLoading, dashboardError, currentPage,
            currentSettingsTab, settingsSaved, displayName, handle, pricePreference, shippingInfo, playerPersonality, payoutInfo,
            newPostContent, posts, socialFeedTab, filteredPosts, mediaFile, mediaPreviewUrl, uploadProgress, isUploading,
            userCollection, wishlist, currentCollectionView, displayMode, searchQuery, filters, filteredCollection,
            isBulkAddModalVisible, bulkAddText, isAddingCards, profileTab,
            navigateTo, getNavClass, getSettingsTabClass, handleRegister, handleLogin, handleGoogleLogin, handleSignOut, handlePasswordReset,
            saveProfileSettings, createPost, deletePost, handleMediaFileChange,
            importFromCSV, bulkAddFromText, exportAsText, quickEdit, handleBulkAddSave,
            formatDate, statCards, getSubtitle
        };
    }
};

Vue.createApp(HatakeApp).mount('#app');
