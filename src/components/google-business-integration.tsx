"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Star, Globe, ExternalLink, RefreshCw } from 'lucide-react';

interface GoogleReview {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  profilePhoto?: string;
}

interface GoogleBusinessProfile {
  id: string;
  name: string;
  address: string;
  phone: string;
  website: string;
  rating: number;
  reviewCount: number;
  reviews: GoogleReview[];
  hours: Record<string, string>;
  photos: string[];
}

interface GoogleBusinessIntegrationProps {
  businessId: string;
}

export function GoogleBusinessIntegration({ businessId }: GoogleBusinessIntegrationProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [businessProfileId, setBusinessProfileId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showReviews, setShowReviews] = useState(true);
  const [profile, setProfile] = useState<GoogleBusinessProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load existing configuration
  useEffect(() => {
    loadGoogleBusinessConfig();
  }, [businessId]);

  const loadGoogleBusinessConfig = async () => {
    try {
      const response = await fetch(`/api/google-business/config?businessId=${businessId}`);
      if (response.ok) {
        const data = await response.json();
        setBusinessProfileId(data.businessProfileId || '');
        setApiKey(data.apiKey || '');
        setIsConnected(data.isConnected || false);
        setShowReviews(data.showReviews !== false);
        
        if (data.isConnected) {
          loadBusinessProfile();
        }
      }
    } catch (error) {
      console.error('Error loading Google Business config:', error);
    }
  };

  const loadBusinessProfile = async () => {
    if (!businessProfileId || !apiKey) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/google-business/profile?businessId=${businessId}`);
      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
      } else {
        setError('Failed to load business profile');
      }
    } catch (error) {
      setError('Error loading business profile');
      console.error('Error loading business profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const connectGoogleBusiness = async () => {
    if (!businessProfileId) {
      setError('Please enter your Google Business Profile ID');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/google-business/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessId,
          businessProfileId,
          apiKey,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsConnected(true);
        setProfile(data.profile);
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to connect Google Business');
      }
    } catch (error) {
      setError('Error connecting to Google Business');
      console.error('Error connecting to Google Business:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectGoogleBusiness = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/google-business/disconnect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ businessId }),
      });

      if (response.ok) {
        setIsConnected(false);
        setProfile(null);
        setBusinessProfileId('');
        setApiKey('');
      }
    } catch (error) {
      console.error('Error disconnecting Google Business:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateConfig = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/google-business/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessId,
          showReviews,
        }),
      });

      if (response.ok) {
        // Config updated successfully
      }
    } catch (error) {
      console.error('Error updating config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Google My Business Status
          </CardTitle>
          <CardDescription>
            {isConnected ? 'Connected to Google My Business' : 'Not connected to Google My Business'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm font-medium">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            {isConnected && (
              <Button
                variant="outline"
                size="sm"
                onClick={disconnectGoogleBusiness}
                disabled={isLoading}
              >
                Disconnect
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Configuration */}
      {!isConnected && (
        <Card>
          <CardHeader>
            <CardTitle>Connect to Google My Business</CardTitle>
            <CardDescription>
              Enter your Google Business Profile ID to connect and display reviews
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="business-profile-id">Business Profile ID</Label>
              <Input
                id="business-profile-id"
                value={businessProfileId}
                onChange={(e) => setBusinessProfileId(e.target.value)}
                placeholder="Enter your Google Business Profile ID"
                className="w-full"
              />
              <p className="text-sm text-gray-500 mt-1">
                Find this in your Google My Business dashboard
              </p>
            </div>

            <div>
              <Label htmlFor="google-api-key">Google API Key (Optional)</Label>
              <Input
                id="google-api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full"
              />
              <p className="text-sm text-gray-500 mt-1">
                Required for advanced features like review syncing
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <Button
              onClick={connectGoogleBusiness}
              disabled={isLoading || !businessProfileId}
              className="w-full"
            >
              {isLoading ? 'Connecting...' : 'Connect Google Business'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Display Settings */}
      {isConnected && (
        <Card>
          <CardHeader>
            <CardTitle>Display Settings</CardTitle>
            <CardDescription>
              Configure how Google Business information appears on your booking page
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">Show Google Reviews</Label>
                <p className="text-sm text-gray-500">
                  Display customer reviews from Google on your booking page
                </p>
              </div>
              <Switch
                checked={showReviews}
                onCheckedChange={(checked) => {
                  setShowReviews(checked);
                  updateConfig();
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">Auto-sync Reviews</Label>
                <p className="text-sm text-gray-500">
                  Automatically update reviews from Google (requires API key)
                </p>
              </div>
              <Switch
                checked={!!apiKey}
                disabled={true}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Business Profile Preview */}
      {isConnected && profile && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Business Profile Preview</span>
              <Button
                variant="outline"
                size="sm"
                onClick={loadBusinessProfile}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="ml-2">Refresh</span>
              </Button>
            </CardTitle>
            <CardDescription>
              Preview of your Google Business information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Business Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">{profile.name}</h4>
                  <p className="text-sm text-gray-600">{profile.address}</p>
                  <p className="text-sm text-gray-600">{profile.phone}</p>
                  {profile.website && (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                    >
                      Visit Website
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1 mb-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{profile.rating}</span>
                    <span className="text-gray-500">({profile.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Reviews */}
              {showReviews && profile.reviews.length > 0 && (
                <div>
                  <h5 className="font-semibold mb-3">Recent Reviews</h5>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {profile.reviews.slice(0, 5).map((review) => (
                      <div key={review.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {review.profilePhoto && (
                              <img
                                src={review.profilePhoto}
                                alt={review.author}
                                className="w-6 h-6 rounded-full"
                              />
                            )}
                            <span className="font-medium text-sm">{review.author}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{review.rating}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700">{review.comment}</p>
                        <p className="text-xs text-gray-500 mt-2">{review.date}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 