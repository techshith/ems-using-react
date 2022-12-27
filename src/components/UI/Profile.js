// src/components/Profile.js
import React, { useState, useEffect } from 'react';
import Gravatar from 'react-gravatar';
import { auth, firestore } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import '../../App.css';
import './Profile.css';

const Profile = () => {
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUserData = async () => {
            try {
                setLoading(true);
                const user = auth.currentUser;

                if (user) {
                    const userDocRef = doc(firestore, 'employees', user.uid);
                    const userDocSnapshot = await getDoc(userDocRef);

                    if (userDocSnapshot.exists()) {
                        const userData = userDocSnapshot.data();
                        setName(userData.name);
                        setEmail(userData.email);
                    } else {
                        console.error('User document does not exist in Firestore.');
                    }
                } else {
                    console.error('User not logged in.');
                }
            } catch (error) {
                console.error('Error getting user data:', error);
            } finally {
                // Set loading to false regardless of success or error
                setLoading(false);
            }
        };

        getUserData();
    }, []);

    if (loading) {
        return <div className='spinner'></div>;
      }

    return (
        <div className="profile">
                <div className="profile-info">
                    <Gravatar style={{ borderRadius: '20px' }} email={email} size={35} className="avatar" />
                    <div className="email">{name}</div>
                </div>
        </div>
    );
};

export default Profile;
