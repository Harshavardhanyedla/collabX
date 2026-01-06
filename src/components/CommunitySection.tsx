import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import type { UserProfile } from '../types';
import StudentCard from './StudentCard';

const CommunitySection: React.FC = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<UserProfile[]>([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, limit(8)); // Limit to 8 profiles for the home page
        const querySnapshot = await getDocs(q);

        const fetchedProfiles: UserProfile[] = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            uid: doc.id,
            ...data,
            // Map old fields to new fields if necessary
            name: data.name || data.full_name || 'Anonymous',
            avatar: data.avatar || data.avatar_url || '',
            institution: data.institution || data.university || 'University',
            skills: data.skills || []
          } as UserProfile;
        });

        setStudents(fetchedProfiles);
      } catch (error) {
        console.error('Error fetching profiles:', error);
      }
    };

    fetchProfiles();
  }, []);

  return (
    <section id="community" className="py-24 bg-white">
      <div className="container-custom mx-auto">

        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-bold text-[#0f172a] mb-4">Students</h2>
            <p className="text-lg text-gray-500">
              Connect with ambitious students from top universities who are building the next big thing.
            </p>
          </div>
          <a
            href="https://chat.whatsapp.com/L4AfqBc5pIh5o2D5BGt5rv"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary px-8 py-3 rounded-xl shadow-lg shadow-blue-500/20 whitespace-nowrap"
          >
            Join the Community
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {students.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-12">
              Join the community to be featured here!
            </div>
          ) : (
            students.map((student) => (
              <StudentCard
                key={student.uid}
                student={student}
                onClick={() => navigate(`/profile/${student.uid}`)}
              />
            ))
          )}
        </div>

      </div>
    </section>
  );
};

export default CommunitySection;