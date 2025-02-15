import axios from "axios";
import { Linking } from "react-native";
import Carousel from "react-native-snap-carousel";
import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Dimensions } from "react-native";

interface News {
  uuid: string;
  title: string;
  description: string;
  url: string;
  image_url: string;
  categories: string[];
  source:string;
}

const Index = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [filteredNews, setFilteredNews] = useState<News[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("general");

  const categories = [
    { name: "General", key: "general" },
    { name: "Business", key: "business" },
    { name: "Tech", key: "tech" },
    { name: "Science", key: "science" },
    { name: "Health", key: "health" },
  ];

  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good morning");
    } else if (hour < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, []);

    // Filter news based on selected category
    useEffect(() => {
      filterNewsByCategory(selectedCategory);
    }, [selectedCategory, news]);
  
    const filterNewsByCategory = (category: string) => {
      const filtered = news.filter((item) =>
        item.categories.includes(category)
      );
      setFilteredNews(filtered);
    };
  

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const params = {
        api_token: "s3aTHc7el1qTrLnPdexPVPkaWIoBjiqgN3mGyiEG",
        categories: "general,business,tech", // Add more categories if needed
        limit: "50",
        language: "en",
      };

      const esc = encodeURIComponent;
      const queryString = Object.keys(params)
        .map((k) => esc(k) + "=" + esc(params[k as keyof typeof params]))
        .join("&");

      const response = await axios.get(
        `https://api.thenewsapi.com/v1/news/all?${queryString}`
      );

      setNews(response.data.data); // Assuming the API returns data in `data` field
    } catch (error) {
      console.error("Error fetching news:", error);
      setError("Failed to fetch news. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const renderCarouselItem = ({ item }: { item: { name: string; key: string } }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item.key && styles.selectedCategoryItem,
      ]}
      onPress={() => setSelectedCategory(item.key)}
    >
      <Text
        style={[
          styles.categoryText,
          selectedCategory === item.key && styles.selectedCategoryText,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );


  const renderItem = ({ item }: { item: { url: string; image_url: string; title: string; description: string; source: string; uuid: string } }) => (
    <TouchableOpacity
      style={styles.newsItem}
      onPress={() => Linking.openURL(item.url)} // Open the article URL
    >
     {/* Validate image_url before rendering */}
     {item.image_url ? (
        <Image source={{ uri: item.image_url }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Text>No Image Available</Text>
        </View>
      )}
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.source}>{item.source}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with Greeting */}
      <View style={styles.header}>
        <Text style={styles.greeting}>{greeting}</Text>
      </View>

      {/* Category Carousel */}
      <View style={styles.carouselContainer}>
        <Carousel
          data={categories}
          renderItem={renderCarouselItem}
          sliderWidth={Dimensions.get("window").width}
          itemWidth={100}
          inactiveSlideScale={0.9}
          inactiveSlideOpacity={0.7}
          activeSlideAlignment="start"
        />
      </View>

      <FlatList
        data={filteredNews}
        renderItem={renderItem}
        keyExtractor={(item) => item.uuid}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  header: { marginBottom: 20 },
  greeting: { fontSize: 24, fontWeight: "bold" },
  newsItem: { marginBottom: 20 },
  image: { width: "100%", height: 200, borderRadius: 10 },
  placeholder: {
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  carouselContainer: { marginBottom: 20 },
  categoryItem: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedCategoryItem: {
    backgroundColor: "#007BFF",
  },
  categoryText: {
    fontSize: 16,
    color: "#000",
  },
  selectedCategoryText: {
    color: "#fff",
  },
  title: { fontSize: 18, fontWeight: "bold", marginTop: 10 },
  description: { fontSize: 14, color: "gray", marginTop: 5 },
  source: { fontSize: 12, color: "blue", marginTop: 5 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  error: { color: "red", fontSize: 16 },
});

export default Index;