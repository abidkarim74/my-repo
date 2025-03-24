import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/apiRequests.tsx';
import { User } from '../interfaces/userInterface.tsx';
import { BASE_URL } from '../constants.tsx';
import { AuthContext } from '../context/contextProvider.tsx';

const Profile: React.FC = () => {
  const authContext = useContext(AuthContext);
  const { user: loggedInUser } = authContext || {};

  const params = useParams<{ username: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [following, setFollowing] = useState<boolean>(false);
  const [followers, setFollowers] = useState<number>(0);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get(`user-profile/${params.username}/`);
        const userData = response.data;

        setUser(userData);
        setFollowers(userData.followers);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch user profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [params.username]);

  useEffect(() => {
    if (!user) return;

    const fetchIsFollowing = async () => {
      try {
        const response = await api.get(`is_following/${user.username}/`);
        setFollowing(response.data.is_following);
      } catch (err: any) {
        console.error(err.message);
      }
    };
    fetchIsFollowing();
  }, [user]);

  const handleFollowToggle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post(`is_following/${user?.username}/`);
      if (response.status === 200) {
        setFollowing((prev) => !prev);

        setFollowers((prev) => (following ? prev - 1 : prev + 1));
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    user && (
      <section className="userProfile">
        <div className="container">
          <div className="profile">
            <img
              src={`${BASE_URL}${user.profileImage || 'default.png'}`}
              alt="Profile"
              className="profile-image"
            />
            <h3>{`${user.first_name} ${user.last_name}`}</h3>
            <p className="username">@{user.username}</p>
            <p className="stats">
              {followers} Followers · {user.followings} Followings
            </p>
            <p className="bio">{user.bio}</p>

            {user.email !== loggedInUser?.email && (
              <button
                onClick={handleFollowToggle}
                className={`follow-btn ${following ? 'following' : ''}`}
              >
                {following ? 'Following' : 'Follow'}
              </button>
            )}
          </div>

          <div className="pinterest-grid">
            <div className="card">Card 1</div>
            <div className="card">Card 2</div>
            <div className="card">Card 3</div>
            <div className="card">Card 4</div>
          </div>
        </div>
      </section>
    )
  );
};

export default Profile;
