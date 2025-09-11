import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../../api'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Badge } from '../ui/badge'
import { 
  User, 
  BookOpen, 
  Heart, 
  Gift,
  Coffee,
  Edit,
  Save
} from 'lucide-react'

interface UserProfileProps {
  userId: string;
  onLogout: () => void;
}

export function UserProfile({ userId, onLogout }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    userId: '',
    userFirstName: '',
    userLastName: '',
    role: '',
    contact: { contactId: '', email: '', phoneNumber: '', address: '' }
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
          setProfile(data);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'phoneNumber' || name === 'address' || name === 'email') {
      setProfile({ ...profile, contact: { ...profile.contact, [name]: value } });
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await fetch(`${API_BASE_URL}/users/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: profile.userId,
          userFirstName: profile.userFirstName,
          userLastName: profile.userLastName,
          role: profile.role,
          contact: profile.contact
        }),
      });
      if (response.ok) {
        setSuccess('Profile updated successfully');
        setIsEditing(false);
        const updatedUser = await response.json();
        setProfile(updatedUser);
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
      const response = await fetch(`${API_BASE_URL}/users/delete/${profile.userId}`, {
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
  if (!profile.userId) return null;

  return (
    <div className="max-w-xl mx-auto">
      <Card className="border-orange-100">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <User className="w-5 h-5" />
            Profile Information
          </CardTitle>
          <Button
            variant="outline"
            onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
            className="text-orange-600 border-orange-200 hover:bg-orange-50"
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4 mr-2" />
                Cancel
              </>
            ) : (
              <>
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="userFirstName">First Name</Label>
                <Input
                  id="userFirstName"
                  name="userFirstName"
                  value={profile.userFirstName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="border-orange-200 focus:border-orange-400"
                  required
                />
              </div>
              <div>
                <Label htmlFor="userLastName">Last Name</Label>
                <Input
                  id="userLastName"
                  name="userLastName"
                  value={profile.userLastName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="border-orange-200 focus:border-orange-400"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={profile.contact.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="border-orange-200 focus:border-orange-400"
                  required
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  name="role"
                  value={profile.role}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="border-orange-200 focus:border-orange-400"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phoneNumber">Phone</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={profile.contact.phoneNumber}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="border-orange-200 focus:border-orange-400"
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={profile.contact.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="border-orange-200 focus:border-orange-400"
                />
              </div>
            </div>
            {isEditing && (
              <Button type="submit" disabled={loading}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            )}
          </form>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            Delete Account
          </Button>
          {success && <p className="text-green-600 mt-2">{success}</p>}
          {error && <p className="text-red-600 mt-2">{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
}