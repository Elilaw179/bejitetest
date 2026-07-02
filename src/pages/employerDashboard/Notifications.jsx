import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import NewsFeedHeader from '../../components/NewsFeedHeader'
import { API_URL } from '../../config'
import NewsFeedLayout from '../../components/layout/NewsFeedLayout'
import { getPostDetailPath } from '../../utils/postNavigation'

const Notifications = () => {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedNotification, setSelectedNotification] = useState(null)
  const [invitations, setInvitations] = useState([])
  const [showInvitations, setShowInvitations] = useState(false)

  useEffect(() => {
    fetchNotifications()
    fetchInvitations()
  }, [])

  const fetchInvitations = async () => {
    try {
      const token = localStorage.getItem('accessToken') || localStorage.getItem('authToken') || localStorage.getItem('token')

      if (!token) return

      const response = await fetch(`${API_URL}/api/interview-invitations/candidate?status=pending`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      })

      const data = await response.json()

      if (response.ok && data.data) {
        setInvitations(data.data)
      }
    } catch (err) {
      console.error('Error fetching invitations:', err)
    }
  }

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('accessToken') || localStorage.getItem('authToken') || localStorage.getItem('token')

      if (!token) {
        setError('Please log in to view notifications')
        setLoading(false)
        return
      }

      const response = await fetch(`${API_URL}/api/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch notifications')
      }

      setNotifications(data.data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('accessToken') || localStorage.getItem('authToken') || localStorage.getItem('token')

      await fetch(`${API_URL}/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      })

      // Update local state
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      )
    } catch (err) {
      console.error('Error marking notification as read:', err)
    }
  }

  const handleNotificationClick = async (notification) => {
    console.log('Notification clicked:', notification);

    // Mark as read
    if (!notification.is_read) {
      await markAsRead(notification.id)
    }

    console.log('Notification type:', notification.type);
    console.log('Notification data:', notification.data);

    // Check if it's an interview invitation - try multiple approaches
    let invitationId = null;
    let parsedData = null;

    // Try parsing the data field
    if (notification.data) {
      try {
        parsedData = typeof notification.data === 'string'
          ? JSON.parse(notification.data)
          : notification.data;
        invitationId = parsedData?.invitation_id;
        console.log('Parsed data:', parsedData);
      } catch (e) {
        console.error('Error parsing notification data:', e);
      }
    }

    // Connection posted — open news feed at the post
    if (notification.type === 'connection_post') {
      const postId = parsedData?.postId
      if (postId) {
        navigate(getPostDetailPath(postId))
        return
      }
      navigate('/news-feed')
      return
    }

    // Post engagement — open news feed at the post
    if (
      notification.type === 'post_liked' ||
      notification.type === 'post_commented' ||
      notification.type === 'post_shared' ||
      notification.type === 'post_saved'
    ) {
      const postId = parsedData?.postId
      if (postId) {
        navigate(getPostDetailPath(postId))
        return
      }
      navigate('/news-feed')
      return
    }

    // Connection request or accepted — open connections page
    if (
      notification.type === 'connection_request' ||
      notification.type === 'connection_accepted'
    ) {
      navigate('/connection')
      return
    }

    // If we found an invitation ID, show the modal
    if (invitationId) {
      setSelectedNotification({
        ...notification,
        data: parsedData || { invitation_id: invitationId }
      })
      return
    }

    // Also check if type is interview_invite and try to extract ID from message or other fields
    if (notification.type === 'interview_invite') {
      // Try to extract from message if data is not available
      const match = notification.message?.match(/ID[:\s]+(\d+)/i) ||
        notification.message?.match(/invitation[\s#]+(\d+)/i);
      if (match) {
        setSelectedNotification({
          ...notification,
          data: { invitation_id: match[1] }
        })
        return
      }

      // If still no ID, still show modal but without pre-filled data
      console.log('No invitation ID found, but showing modal anyway');
    }
  }

  const handleAccept = async (invitationId) => {
    try {
      const token = localStorage.getItem('accessToken') || localStorage.getItem('authToken') || localStorage.getItem('token')

      const response = await fetch(`${API_URL}/api/interview-invitations/${invitationId}/accept`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to accept invitation')
      }

      // Update notification in list
      setNotifications(prev =>
        prev.map(n => n.id === selectedNotification.id
          ? { ...n, type: 'invite_accepted', title: 'Invitation Accepted' }
          : n)
      )
      setSelectedNotification(null)
      alert('You have accepted the interview invitation!')
    } catch (err) {
      alert(err.message)
    }
  }

  const handleDecline = async (invitationId) => {
    try {
      const token = localStorage.getItem('accessToken') || localStorage.getItem('authToken') || localStorage.getItem('token')

      const response = await fetch(`${API_URL}/api/interview-invitations/${invitationId}/decline`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to decline invitation')
      }

      // Update notification in list
      setNotifications(prev =>
        prev.map(n => n.id === selectedNotification.id
          ? { ...n, type: 'invite_declined', title: 'Invitation Declined' }
          : n)
      )
      setSelectedNotification(null)
      alert('You have declined the interview invitation.')
    } catch (err) {
      alert(err.message)
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'interview_invite':
        return '📅'
      case 'invite_accepted':
        return '✅'
      case 'invite_declined':
        return '❌'
      case 'connection_post':
        return '📝'
      case 'post_liked':
        return '❤️'
      case 'post_commented':
        return '💬'
      case 'post_shared':
        return '🔁'
      case 'post_saved':
        return '🔖'
      case 'connection_request':
        return '🤝'
      case 'connection_accepted':
        return '✅'
      default:
        return '🔔'
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <div>
        <NewsFeedHeader />
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#16730F]"></div>
            <p className="text-[#16730F] mt-4">Loading notifications...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <NewsFeedLayout scrollable={true} classes={false} showSidebars={false}>

      <div>
        {/* <NewsFeedHeader /> */}

        <div className="max-w-2xl mx-auto p-4">
          <h1 className="text-2xl font-semibold text-[#16730F] text-center mb-4">
            Notifications
          </h1>

          {/* Toggle between Notifications and Invitations */}
          <div className="flex justify-center gap-2 mb-6">
            <button
              onClick={() => setShowInvitations(false)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${!showInvitations
                ? 'bg-[#16730F] text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              Notifications
            </button>
            <button
              onClick={() => {
                setShowInvitations(true)
                fetchInvitations()
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${showInvitations
                ? 'bg-[#16730F] text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              My Interview Invitations
              {invitations.length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {invitations.length}
                </span>
              )}
            </button>
          </div>

          {/* Interview Invitations View */}
          {showInvitations ? (
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Pending Interview Invitations</h2>
              {invitations.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">📅</p>
                  <p className="text-gray-500 mt-2">No pending interview invitations</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {invitations.map((invitation) => (
                    <div
                      key={invitation.id}
                      className="bg-white border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-[#16730F]">
                            {invitation.job_title || 'Interview Invitation'}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            From: {invitation.employer_first_name} {invitation.employer_last_name}
                            {invitation.company_name && ` (${invitation.company_name})`}
                          </p>
                          <div className="mt-2 text-sm text-gray-500">
                            <p><strong>Date:</strong> {new Date(invitation.interview_date).toLocaleDateString()}</p>
                            <p><strong>Time:</strong> {invitation.interview_time}</p>
                            <p><strong>Type:</strong> {invitation.interview_type === 'online' ? 'Online (Video Call)' : 'In-Person'}</p>
                            {invitation.interview_type === 'online' && invitation.meeting_link && (
                              <p><strong>Link:</strong> <a href={invitation.meeting_link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">{invitation.meeting_link}</a></p>
                            )}
                            {invitation.interview_type === 'offline' && invitation.venue && (
                              <p><strong>Venue:</strong> {invitation.venue}</p>
                            )}
                            {invitation.message && (
                              <p className="mt-2"><strong>Message:</strong> {invitation.message}</p>
                            )}
                            <p className="mt-2 text-red-500">
                              Expires: {new Date(invitation.expires_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={() => handleDecline(invitation.id)}
                          className="flex-1 py-2 px-4 border-2 border-red-500 text-red-500 rounded-lg font-medium hover:bg-red-50 transition-colors"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => handleAccept(invitation.id)}
                          className="flex-1 py-2 px-4 bg-[#16730F] text-white rounded-lg font-medium hover:bg-[#125a0c] transition-colors"
                        >
                          Accept
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Notifications View */
            <>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-center">
                  {error}
                </div>
              )}

              {notifications.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">🔔</p>
                  <p className="text-gray-500 mt-2">No notifications yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-4 rounded-lg cursor-pointer transition-colors ${notification.is_read
                        ? 'bg-white border border-gray-200'
                        : 'bg-[#16730F]/5 border-l-4 border-[#16730F]'
                        }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                        <div className="flex-1">
                          <h3 className="font-medium text-[#16730F]">{notification.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            {formatDate(notification.created_at)}
                          </p>
                        </div>
                        {!notification.is_read && (
                          <span className="w-2 h-2 bg-[#16730F] rounded-full"></span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Interview Invitation Modal */}
        {selectedNotification && selectedNotification.type === 'interview_invite' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto nfl-scroll scroll-smooth">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-[#16730F] mb-4">Interview Invitation</h2>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-gray-600 mb-2">{selectedNotification.message}</p>
                  {selectedNotification.data?.interview_date && (
                    <p className="text-sm text-gray-500 mt-2">
                      <strong>Date:</strong> {new Date(selectedNotification.data.interview_date).toLocaleDateString()}
                    </p>
                  )}
                  {selectedNotification.data?.interview_time && (
                    <p className="text-sm text-gray-500 mt-1">
                      <strong>Time:</strong> {selectedNotification.data.interview_time}
                    </p>
                  )}
                  {selectedNotification.data?.interview_type && (
                    <p className="text-sm text-gray-500 mt-1">
                      <strong>Type:</strong> {selectedNotification.data.interview_type === 'online' ? 'Online' : 'In-Person'}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 mt-2">
                    Expires: {selectedNotification.data?.expires_at ? new Date(selectedNotification.data.expires_at).toLocaleString() : '72 hours from now'}
                  </p>
                </div>

                {selectedNotification.data?.invitation_id ? (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleDecline(selectedNotification.data.invitation_id)}
                      className="flex-1 py-3 px-4 border-2 border-red-500 text-red-500 rounded-xl font-medium hover:bg-red-50 transition-colors"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleAccept(selectedNotification.data.invitation_id)}
                      className="flex-1 py-3 px-4 bg-[#16730F] text-white rounded-xl font-medium hover:bg-[#125a0c] transition-colors"
                    >
                      Accept
                    </button>
                  </div>
                ) : (
                  <p className="text-center text-red-500 text-sm">
                    Unable to load invitation details. Please try again later.
                  </p>
                )}

                <button
                  onClick={() => setSelectedNotification(null)}
                  className="mt-3 w-full py-2 text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </NewsFeedLayout>
  )
}

export default Notifications
