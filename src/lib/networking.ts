import { db, auth } from './firebase';
import {
    collection,
    addDoc,
    updateDoc,
    doc,
    query,
    where,
    getDocs,
    getDoc,
    setDoc,
    serverTimestamp,
    increment,
    Timestamp,
    orderBy
} from 'firebase/firestore';

export interface ConnectionRequest {
    id?: string;
    requesterId: string;
    recipientId: string;
    status: 'pending' | 'accepted' | 'ignored';
    note?: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

const DAILY_LIMIT = 20;

export const sendConnectionRequest = async (recipientId: string, note?: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');
    if (user.uid === recipientId) throw new Error('Cannot connect with yourself');

    // 1. Check daily limit
    const today = new Date().toISOString().split('T')[0];
    const activityRef = doc(db, 'userActivity', `${user.uid}_${today}`);
    const activityDoc = await getDoc(activityRef);

    if (activityDoc.exists() && activityDoc.data().connectionRequestsSent >= DAILY_LIMIT) {
        throw new Error(`Daily limit of ${DAILY_LIMIT} requests reached.`);
    }

    // 2. Check if blocked
    const blockRef = doc(db, 'blocks', `${recipientId}_${user.uid}`);
    const blockDoc = await getDoc(blockRef);
    if (blockDoc.exists()) {
        throw new Error('This user has blocked you.');
    }

    // 3. Check for existing request
    const connectionsRef = collection(db, 'connections');
    const q = query(
        connectionsRef,
        where('requesterId', '==', user.uid),
        where('recipientId', '==', recipientId)
    );
    const existing = await getDocs(q);
    if (!existing.empty) {
        throw new Error('Connection request already exists.');
    }

    // 4. Send request
    await addDoc(connectionsRef, {
        requesterId: user.uid,
        recipientId: recipientId,
        status: 'pending',
        note: note ? note.substring(0, 300) : '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    });

    // 5. Update activity
    await setDoc(activityRef, {
        userId: user.uid,
        date: today,
        connectionRequestsSent: increment(1)
    }, { merge: true });
};

export const acceptConnectionRequest = async (requestId: string) => {
    const requestRef = doc(db, 'connections', requestId);
    await updateDoc(requestRef, {
        status: 'accepted',
        updatedAt: serverTimestamp()
    });
};

export const ignoreConnectionRequest = async (requestId: string) => {
    const requestRef = doc(db, 'connections', requestId);
    await updateDoc(requestRef, {
        status: 'ignored',
        updatedAt: serverTimestamp()
    });
};

export const fetchConnectionStatus = async (targetId: string) => {
    const user = auth.currentUser;
    if (!user) return 'none';

    const connectionsRef = collection(db, 'connections');

    // Check if I sent a request
    const q1 = query(
        connectionsRef,
        where('requesterId', '==', user.uid),
        where('recipientId', '==', targetId)
    );
    const sent = await getDocs(q1);
    if (!sent.empty) {
        const data = sent.docs[0].data();
        return data.status === 'accepted' ? 'connected' : 'pending';
    }

    // Check if they sent a request
    const q2 = query(
        connectionsRef,
        where('requesterId', '==', targetId),
        where('recipientId', '==', user.uid)
    );
    const received = await getDocs(q2);
    if (!received.empty) {
        const data = received.docs[0].data();
        return data.status === 'accepted' ? 'connected' : 'received';
    }

    return 'none';
};

export const blockUser = async (targetId: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const blockRef = doc(db, 'blocks', `${user.uid}_${targetId}`);
    await setDoc(blockRef, {
        blockerId: user.uid,
        blockedId: targetId,
        createdAt: serverTimestamp()
    });
};
export const fetchIncomingRequests = async () => {
    const user = auth.currentUser;
    if (!user) return [];

    const connectionsRef = collection(db, 'connections');
    const q = query(
        connectionsRef,
        where('recipientId', '==', user.uid),
        where('status', '==', 'pending'),
        orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as ConnectionRequest));
};

export const fetchConnectionStatusData = async (targetId: string) => {
    const user = auth.currentUser;
    if (!user) return { status: 'none', requestId: null };

    const connectionsRef = collection(db, 'connections');

    // Check if I sent a request
    const q1 = query(
        connectionsRef,
        where('requesterId', '==', user.uid),
        where('recipientId', '==', targetId)
    );
    const sent = await getDocs(q1);
    if (!sent.empty) {
        const data = sent.docs[0].data();
        return {
            status: data.status === 'accepted' ? 'connected' : 'pending',
            requestId: sent.docs[0].id
        };
    }

    // Check if they sent a request
    const q2 = query(
        connectionsRef,
        where('requesterId', '==', targetId),
        where('recipientId', '==', user.uid)
    );
    const received = await getDocs(q2);
    if (!received.empty) {
        const data = received.docs[0].data();
        return {
            status: data.status === 'accepted' ? 'connected' : 'received',
            requestId: received.docs[0].id
        };
    }

    return { status: 'none', requestId: null };
};
