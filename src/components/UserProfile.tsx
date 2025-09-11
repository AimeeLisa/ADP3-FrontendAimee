import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface UserProfileProps {
  userId: string;
  onLogout: () => void;
}

interface User {
  userId: string;
  userFirstName: string;
  userLastName: string;
  email: string;
  role: string;
}

export function UserProfile({ userId, onLogout }: UserProfileProps) {
  const [user, setUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    userFirstName: '',
    userLastName: '',
    email: '',
    role: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setUser(data);
          setForm({
            userFirstName: data.userFirstName,
            userLastName: data.userLastName,
            email: data.email,
            role: data.role,
          });
        } else {
          setError('Failed to fetch user');
        }
      } catch (err) {
        setError('Error fetching user');
      }
      setLoading(false);
    }
    fetchUser();
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await fetch(`${API_BASE_URL}/users/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          ...form,
        }),
      });
      if (response.ok) {
        setSuccess('Profile updated successfully');
        setEditMode(false);
        const updatedUser = await response.json();
        setUser(updatedUser);
      } else {
        setError('Failed to update profile');
      }
    } catch (err) {
      setError('Error updating profile');
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your account?')) return;
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/users/delete/${userId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        onLogout();
      } else {
        setError('Failed to delete account');
      }
    } catch (err) {
      setError('Error deleting account');
    }
    setLoading(false);
  };

  if (loading) return <Card><CardContent>Loading...</CardContent></Card>;
  if (error) return <Card><CardContent className="text-red-600">{error}</CardContent></Card>;
  if (!user) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent>
        {editMode ? (
          <form onSubmit={handleUpdate} className="space-y-4">
            <Input name="userFirstName" value={form.userFirstName} onChange={handleChange} placeholder="First Name" required />
            <Input name="userLastName" value={form.userLastName} onChange={handleChange} placeholder="Last Name" required />
            <Input name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
            <Input name="role" value={form.role} onChange={handleChange} placeholder="Role" required />
            <Button type="submit" disabled={loading}>Save</Button>
            <Button type="button" variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
          </form>
        ) : (
          <div className="space-y-2">
            <p><strong>Name:</strong> {user.userFirstName} {user.userLastName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <Button onClick={() => setEditMode(true)}>Edit Profile</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete Account</Button>
          </div>
        )}
        {success && <p className="text-green-600 mt-2">{success}</p>}
      </CardContent>
    </Card>
  );
}
