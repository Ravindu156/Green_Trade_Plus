import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {
  Text,
  Card,
  Chip,
  Searchbar,
  FAB,
  ActivityIndicator,
  Appbar,
  Surface,
  IconButton,
  Menu,
  Divider,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AllCourses = () => {
  const navigation = useNavigation();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [user, setUser] = useState(null);
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    fetchUserData();
    fetchCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [courses, searchQuery, selectedFilter]);

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

  const fetchCourses = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Authentication required');
        return;
      }

      const response = await fetch('http://localhost:8080/api/academy/courses', {
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
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      Alert.alert('Error', 'Failed to load courses. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
 const filterCourses = () => {
    let filtered = [...courses];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(course =>
        course.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.courseDescription.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply audience filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(course => {
        const suitableFor = course.suitableFor || [];
        switch (selectedFilter) {
          case 'farmers':
            return suitableFor.includes('For Farmers');
          case 'sellers':
            return suitableFor.includes('For Sellers');
          case 'buyers':
            return suitableFor.includes('For Buyers');
          default:
            return true;
        }
      });
    }

    setFilteredCourses(filtered);
  };
  

  const onRefresh = () => {
    setRefreshing(true);
    fetchCourses();
  };

  const handleCoursePress = (course) => {
    navigation.navigate('CourseDetails', { courseId: course.id, course });
  };

  const renderTargetAudienceChips = (course) => {
    const audiences = course.suitableFor || [];
    
    return audiences.map((audience, index) => (
      <Chip
        key={index}
        mode="outlined"
        compact
        style={[styles.audienceChip, { backgroundColor: getChipColor(audience) }]}
        textStyle={styles.audienceChipText}
      >
        {audience.replace('For ', '')}
      </Chip>
    ));
  };

  const getChipColor = (audience) => {
    switch (audience) {
      case 'Farmers': return '#e8f5e8';
      case 'Sellers': return '#fff3e0';
      case 'Buyers': return '#e3f2fd';
      default: return '#f5f5f5';
    }
  };

  const renderCourseCard = (course) => (
    <TouchableOpacity
      key={course.id}
      onPress={() => handleCoursePress(course)}
      activeOpacity={0.7}
    >
      <Card style={styles.courseCard} elevation={3}>
        <View style={styles.cardContent}>
          {/* Thumbnail */}
          <View style={styles.thumbnailContainer}>
            {course.courseThumbnail ? (
              <Image
                source={{ uri: course.courseThumbnail }}
                style={styles.thumbnail}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.placeholderThumbnail}>
                <IconButton icon="play-circle" size={40} color="#1976d2" />
              </View>
            )}
            <View style={styles.priceTag}>
              <Text style={styles.priceText}>
                ${parseFloat(course.courseFees).toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Course Info */}
          <View style={styles.courseInfo}>
            <Text style={styles.courseTitle} numberOfLines={2}>
              {course.courseTitle}
            </Text>
            
            <Text style={styles.tutorName}>
              By {course.tutorName || 'Unknown Tutor'}
            </Text>

            <Text style={styles.courseDescription} numberOfLines={3}>
              {course.courseDescription}
            </Text>

            {/* Target Audience Chips */}
            <View style={styles.audienceContainer}>
              {renderTargetAudienceChips(course)}
            </View>

            {/* Course Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <IconButton icon="clock-outline" size={16} color="#666" />
                <Text style={styles.statText}>Course</Text>
              </View>
              <View style={styles.statItem}>
                <IconButton icon="account-group" size={16} color="#666" />
                <Text style={styles.statText}>
                  {course.enrollmentCount || 0} enrolled
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  const renderFilterMenu = () => (
    <Menu
      visible={filterMenuVisible}
      onDismiss={() => setFilterMenuVisible(false)}
      anchor={
        <IconButton
          icon="filter-variant"
          size={24}
          color="#fff"
          onPress={() => setFilterMenuVisible(true)}
        />
      }
    >
      <Menu.Item
        onPress={() => {
          setSelectedFilter('all');
          setFilterMenuVisible(false);
        }}
        title="All Courses"
        leadingIcon={selectedFilter === 'all' ? 'check' : 'book-multiple'}
      />
      <Divider />
      <Menu.Item
        onPress={() => {
          setSelectedFilter('farmers');
          setFilterMenuVisible(false);
        }}
        title="For Farmers"
        leadingIcon={selectedFilter === 'farmers' ? 'check' : 'account-group'}
      />
      <Menu.Item
        onPress={() => {
          setSelectedFilter('sellers');
          setFilterMenuVisible(false);
        }}
        title="For Sellers"
        leadingIcon={selectedFilter === 'sellers' ? 'check' : 'store'}
      />
      <Menu.Item
        onPress={() => {
          setSelectedFilter('buyers');
          setFilterMenuVisible(false);
        }}
        title="For Buyers"
        leadingIcon={selectedFilter === 'buyers' ? 'check' : 'cart'}
      />
    </Menu>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976d2" />
        <Text style={styles.loadingText}>Loading courses...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color="#fff" />
        <Appbar.Content title="All Courses" titleStyle={styles.headerTitle} />
        {renderFilterMenu()}
      </Appbar.Header>

      <View style={styles.content}>
        {/* Search Bar */}
        <Surface style={styles.searchContainer} elevation={2}>
          <Searchbar
            placeholder="Search courses, tutors..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchbar}
            iconColor="#1976d2"
            inputStyle={styles.searchInput}
          />
        </Surface>

        {/* Filter Info */}
        {selectedFilter !== 'all' && (
          <Surface style={styles.filterInfo} elevation={1}>
            <Text style={styles.filterText}>
              Showing courses for {selectedFilter}
            </Text>
            <TouchableOpacity onPress={() => setSelectedFilter('all')}>
              <Text style={styles.clearFilterText}>Clear filter</Text>
            </TouchableOpacity>
          </Surface>
        )}

        {/* Courses List */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {filteredCourses.length === 0 ? (
            <View style={styles.emptyContainer}>
              <IconButton icon="book-open-variant" size={64} color="#ccc" />
              <Text style={styles.emptyTitle}>No Courses Found</Text>
              <Text style={styles.emptyDescription}>
                {searchQuery.trim() || selectedFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'No courses have been added yet'
                }
              </Text>
            </View>
          ) : (
            <View style={styles.coursesContainer}>
              <Text style={styles.resultsCount}>
                {filteredCourses.length} course(s) found
              </Text>
              {filteredCourses.map(renderCourseCard)}
            </View>
          )}
        </ScrollView>
      </View>

      {/* FAB for adding new course (only for tutors) */}
      {user?.role === 'tutor' && (
        <FAB
          style={styles.fab}
          icon="plus"
          onPress={() => navigation.navigate('AddNewCourseScreen')}
          color="#fff"
        />
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
  content: {
    flex: 1,
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
  searchContainer: {
    margin: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  searchbar: {
    backgroundColor: 'transparent',
    elevation: 0,
  },
  searchInput: {
    fontSize: 16,
  },
  filterInfo: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#e3f2fd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterText: {
    color: '#1976d2',
    fontWeight: '500',
  },
  clearFilterText: {
    color: '#1976d2',
    textDecorationLine: 'underline',
  },
  scrollView: {
    flex: 1,
  },
  coursesContainer: {
    padding: 16,
  },
  resultsCount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    fontWeight: '500',
  },
  courseCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    padding: 16,
  },
  thumbnailContainer: {
    position: 'relative',
    marginRight: 16,
  },
  thumbnail: {
    width: 120,
    height: 90,
    borderRadius: 8,
  },
  placeholderThumbnail: {
    width: 120,
    height: 90,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceTag: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#1976d2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priceText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  tutorName: {
    fontSize: 14,
    color: '#1976d2',
    marginBottom: 8,
    fontWeight: '500',
  },
  courseDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  audienceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  audienceChip: {
    marginRight: 6,
    marginBottom: 4,
    height: 28,
  },
  audienceChipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 32,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#1976d2',
  },
});

export default AllCourses;