import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  Chip,
  ActivityIndicator,
  Appbar,
  Surface,
  IconButton,
  Divider,
  Avatar,
} from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VideoView } from 'expo-video';

const { width: screenWidth } = Dimensions.get('window');

const CourseDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { courseId, course: initialCourse } = route.params;

  const [course, setCourse] = useState(initialCourse || null);
  const [loading, setLoading] = useState(!initialCourse);
  const [enrolling, setEnrolling] = useState(false);
  const [user, setUser] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    fetchUserData();
    if (!initialCourse) {
      fetchCourseDetails();
    }
    checkEnrollmentStatus();
  }, []);

  const fetchUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchCourseDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Authentication required');
        return;
      }

      const response = await fetch(`http://localhost:8080/api/academy/courses/${courseId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCourse(data);
    } catch (error) {
      console.error('Error fetching course details:', error);
      Alert.alert('Error', 'Failed to load course details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollmentStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`http://localhost:8080/api/academy/enrollments/check/${courseId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIsEnrolled(data.isEnrolled);
      }
    } catch (error) {
      console.error('Error checking enrollment status:', error);
    }
  };

  const handleEnrollment = async () => {
    if (!user) {
      Alert.alert('Authentication Required', 'Please login to enroll in this course.');
      return;
    }

    setEnrolling(true);

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Authentication required');
        return;
      }

      const response = await fetch('http://localhost:8080/api/academy/enrollments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: course.id,
          userId: user.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to enroll');
      }

      Alert.alert(
        'Enrollment Successful!',
        'You have successfully enrolled in this course. You can now access the course content.',
        [
          {
            text: 'Start Learning',
            onPress: () => {
              setIsEnrolled(true);
              setShowVideo(true);
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error enrolling in course:', error);
      Alert.alert('Enrollment Failed', error.message || 'Failed to enroll in course. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

  const renderTargetAudienceChips = () => {
    if (!course?.suitableFor || course.suitableFor.length === 0) return null;

    return (
      <View style={styles.audienceContainer}>
        <Text style={styles.sectionTitle}>Target Audience</Text>
        <View style={styles.chipsRow}>
          {course.suitableFor.map((audience, index) => (
            <Chip
              key={index}
              mode="outlined"
              style={[styles.audienceChip, { backgroundColor: getChipColor(audience) }]}
              textStyle={styles.audienceChipText}
              icon={getChipIcon(audience)}
            >
              {audience.replace('For ', '')}
            </Chip>
          ))}
        </View>
      </View>
    );
  };

  const getChipColor = (audience) => {
    switch (audience) {
      case 'For Farmers': return '#e8f5e8';
      case 'For Sellers': return '#fff3e0';
      case 'For Buyers': return '#e3f2fd';
      default: return '#f5f5f5';
    }
  };

  const getChipIcon = (audience) => {
    switch (audience) {
      case 'For Farmers': return 'account-group';
      case 'For Sellers': return 'store';
      case 'For Buyers': return 'cart';
      default: return 'account';
    }
  };

  const renderVideoPlayer = () => {
    if (!showVideo || !course?.courseVideo) return null;

    return (
      <Surface style={styles.videoContainer} elevation={4}>
        <Text style={styles.sectionTitle}>Course Video</Text>
        <View style={styles.videoWrapper}>
          <VideoView
            source={{ uri: course.courseVideo }}
            style={styles.video}
            showsPlaybackControls={true}
            contentFit="contain"
            onError={(error) => {
              console.error('Video error:', error);
              Alert.alert('Video Error', 'Failed to load video. Please try again.');
            }}
          />
        </View>
      </Surface>
    );
  };

  const renderCourseStats = () => (
    <Surface style={styles.statsContainer} elevation={2}>
      <View style={styles.statItem}>
        <IconButton icon="account-group" size={24} color="#1976d2" />
        <View>
          <Text style={styles.statValue}>{course.enrollmentCount || 0}</Text>
          <Text style={styles.statLabel}>Students</Text>
        </View>
      </View>

      <Divider style={styles.statDivider} />

      <View style={styles.statItem}>
        <IconButton icon="star" size={24} color="#ff9800" />
        <View>
          <Text style={styles.statValue}>{course.averageRating?.toFixed(1) || '0.0'}</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
      </View>

      <Divider style={styles.statDivider} />

      <View style={styles.statItem}>
        <IconButton icon="cash" size={24} color="#4caf50" />
        <View>
          <Text style={styles.statValue}>${parseFloat(course.courseFees).toFixed(2)}</Text>
          <Text style={styles.statLabel}>Price</Text>
        </View>
      </View>
    </Surface>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976d2" />
        <Text style={styles.loadingText}>Loading course details...</Text>
      </View>
    );
  }

  if (!course) {
    return (
      <View style={styles.errorContainer}>
        <IconButton icon="alert-circle" size={64} color="#d32f2f" />
        <Text style={styles.errorTitle}>Course Not Found</Text>
        <Text style={styles.errorDescription}>
          The course you're looking for could not be found.
        </Text>
        <Button
          mode="contained"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color="#fff" />
        <Appbar.Content
          title="Course Details"
          titleStyle={styles.headerTitle}
          subtitle={course.courseTitle}
          subtitleStyle={styles.headerSubtitle}
        />
      </Appbar.Header>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Course Thumbnail */}
        <View style={styles.thumbnailContainer}>
          <Image
            source={{ uri: course.courseThumbnail }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
          <View style={styles.thumbnailOverlay}>
            <IconButton
              icon="play-circle"
              size={60}
              color="#fff"
              onPress={() => setShowVideo(true)}
              style={styles.playButton}
            />
          </View>
        </View>

        <View style={styles.contentContainer}>
          {/* Course Title and Tutor */}
          <Surface style={styles.titleContainer} elevation={2}>
            <Text style={styles.courseTitle}>{course.courseTitle}</Text>
            <View style={styles.tutorInfo}>
              <Avatar.Icon size={40} icon="account" style={styles.tutorAvatar} />
              <View style={styles.tutorDetails}>
                <Text style={styles.tutorLabel}>Instructor</Text>
                <Text style={styles.tutorName}>{course.tutorName || 'Unknown Tutor'}</Text>
              </View>
            </View>
          </Surface>

          {/* Course Stats */}
          {renderCourseStats()}

          {/* Course Description */}
          <Surface style={styles.descriptionContainer} elevation={2}>
            <Text style={styles.sectionTitle}>About This Course</Text>
            <Text style={styles.courseDescription}>{course.courseDescription}</Text>
          </Surface>

          {/* Target Audience */}
          <Surface style={styles.audienceSection} elevation={2}>
            {renderTargetAudienceChips()}
          </Surface>

          {/* Video Player (if enrolled and video should be shown) */}
          {isEnrolled && renderVideoPlayer()}

          {/* Course Info */}
          <Surface style={styles.infoContainer} elevation={2}>
            <Text style={styles.sectionTitle}>Course Information</Text>
            <View style={styles.infoRow}>
              <IconButton icon="calendar" size={20} color="#666" />
              <Text style={styles.infoText}>
                Created: {new Date(course.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <IconButton icon="update" size={20} color="#666" />
              <Text style={styles.infoText}>
                Last Updated: {new Date(course.updatedAt).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <IconButton icon="check-circle" size={20} color="#4caf50" />
              <Text style={styles.infoText}>
                Status: {course.isActive ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </Surface>
        </View>
      </ScrollView>

      {/* Enrollment Button */}
      {!isEnrolled && (
        <Surface style={styles.enrollmentContainer} elevation={8}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Course Price</Text>
            <Text style={styles.priceValue}>Rs.{parseFloat(course.courseFees).toFixed(2)}</Text>
          </View>
          <Button
            mode="contained"
            onPress={handleEnrollment}
            loading={enrolling}
            disabled={enrolling}
            style={styles.enrollButton}
            contentStyle={styles.enrollButtonContent}
            labelStyle={styles.enrollButtonLabel}
          >
            {enrolling ? 'Enrolling...' : 'Enroll Now'}
          </Button>
        </Surface>
      )}

      {/* Enrolled Status */}
      {isEnrolled && (
        <Surface style={styles.enrolledContainer} elevation={8}>
          <View style={styles.enrolledStatus}>
            <IconButton icon="check-circle" size={24} color="#4caf50" />
            <Text style={styles.enrolledText}>You are enrolled in this course</Text>
          </View>
          <Button
            mode="outlined"
            onPress={() => setShowVideo(true)}
            style={styles.watchButton}
            contentStyle={styles.watchButtonContent}
          >
            Watch Course
          </Button>
        </Surface>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#1976d2',
    elevation: 4,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#e3f2fd',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#f8fafc',
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    textAlign: 'center',
  },
  errorDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 24,
  },
  backButton: {
    marginTop: 24,
    backgroundColor: '#1976d2',
  },
  scrollView: {
    flex: 1,
  },
  thumbnailContainer: {
    position: 'relative',
    height: 250,
    backgroundColor: '#000',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  thumbnailOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  playButton: {
    backgroundColor: 'rgba(25, 118, 210, 0.8)',
  },
  contentContainer: {
    padding: 16,
  },
  titleContainer: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  courseTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 32,
    marginBottom: 16,
  },
  tutorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tutorAvatar: {
    backgroundColor: '#1976d2',
    marginRight: 12,
  },
  tutorDetails: {
    flex: 1,
  },
  tutorLabel: {
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  tutorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976d2',
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e0e0e0',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 2,
  },
  descriptionContainer: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  courseDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  audienceSection: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  audienceContainer: {
    marginBottom: 8,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  audienceChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  audienceChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  videoContainer: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  videoWrapper: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: 200,
  },
  infoContainer: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  enrollmentContainer: {
    backgroundColor: '#fff',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  priceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  enrollButton: {
    backgroundColor: '#1976d2',
    borderRadius: 8,
    marginLeft: 16,
  },
  enrollButtonContent: {
    height: 48,
    paddingHorizontal: 24,
  },
  enrollButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  enrolledContainer: {
    backgroundColor: '#fff',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  enrolledStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  enrolledText: {
    fontSize: 16,
    color: '#4caf50',
    fontWeight: '500',
    marginLeft: 8,
  },
  watchButton: {
    borderColor: '#1976d2',
    borderRadius: 8,
    marginLeft: 16,
  },
  watchButtonContent: {
    height: 48,
    paddingHorizontal: 24,
  },
});

export default CourseDetails;